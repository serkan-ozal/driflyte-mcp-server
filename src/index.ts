#!/usr/bin/env node

import * as logger from './logger';
import {
    createServer as createMcpServer,
    createAndConnectServer as createAndConnectMcpServer,
} from './server';

import {
    createServer as createHttpServer,
    IncomingMessage,
    Server as HttpServer,
    ServerResponse,
} from 'http';

import { Server as McpServerRaw } from '@modelcontextprotocol/sdk/server/index.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { Command, Option, InvalidOptionArgumentError } from 'commander';

const DEFAULT_PORT = 3000;

const MCP_TEMPLATE = {
    jsonrpc: '2.0',
    error: {
        code: 0,
        message: 'N/A',
    },
    id: null,
};

const MCP_ERRORS = {
    get internalServerError() {
        return _buildMCPErrorResponse(-32603, 'Internal Server Error');
    },
};

function _buildMCPErrorResponse(code: number, message: string): any {
    const result = { ...MCP_TEMPLATE };
    result.error.code = code;
    result.error.message = message;
    return result;
}

type Options = {
    transport: 'stdio' | 'streamable-http';
    port: number;
};

function _parsePort(value: string): number {
    const n: number = Number(value);
    if (!Number.isInteger(n) || n < 1 || n > 65535) {
        throw new InvalidOptionArgumentError(
            'port must be an integer between 1 and 65535'
        );
    }
    return n;
}

function _getOptions(): Options {
    const program: Command = new Command()
        .addOption(
            new Option('--transport <type>', 'transport type')
                .choices(['stdio', 'streamable-http'])
                .default('stdio')
        )
        .addOption(
            new Option('--port <number>', 'port for Streamable HTTP transport')
                .argParser(_parsePort)
                .default(
                    process.env.PORT ? Number(process.env.PORT) : DEFAULT_PORT
                )
        )
        .allowUnknownOption()
        .parse(process.argv);

    return program.opts<Options>();
}

async function _startStdioServer(): Promise<void> {
    await createAndConnectMcpServer(new StdioServerTransport());
}

async function _closeMCPServer(
    transport: StreamableHTTPServerTransport | undefined,
    mcpServer: McpServer | undefined
): Promise<void> {
    if (transport) {
        try {
            await transport.close();
        } catch (err: any) {
            logger.error(`Error occurred while closing MCP transport: ${err}`);
        }
    }
    if (mcpServer) {
        try {
            await mcpServer.close();
        } catch (err: any) {
            logger.error(`Error occurred while closing MCP server: ${err}`);
        }
    }
}

async function _startStreamableHTTPServer(port: number): Promise<void> {
    const httpServer: HttpServer<
        typeof IncomingMessage,
        typeof ServerResponse
    > = createHttpServer(
        async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
            const pathname: string = new URL(req.url || '/', 'http://localhost')
                .pathname;

            // Set CORS headers for all responses
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
            res.setHeader(
                'Access-Control-Allow-Headers',
                'Content-Type, Authorization, MCP-Protocol-Version'
            );

            // Handle preflight OPTIONS requests
            if (req.method === 'OPTIONS') {
                res.writeHead(200);
                res.end();
                return;
            }

            if (pathname === '/mcp') {
                if (req.method === 'POST') {
                    let transport: StreamableHTTPServerTransport | undefined;
                    let mcpServer: McpServer | undefined;
                    try {
                        // Create new instances of MCP Server and Transport for each incoming request
                        transport = new StreamableHTTPServerTransport({
                            // This is a stateless MCP server, so we don't need to keep track of sessions
                            sessionIdGenerator: undefined,
                            // Change to `false` if you want to enable SSE in responses.
                            enableJsonResponse: true,
                        });
                        mcpServer = await createAndConnectMcpServer(transport);

                        res.on('close', async (): Promise<void> => {
                            logger.debug(`Request processing completed`);
                            await _closeMCPServer(transport, mcpServer);
                        });

                        await transport.handleRequest(req, res);
                    } catch (err: any) {
                        logger.error(`Error handling MCP request: ${err}`);
                        await _closeMCPServer(transport, mcpServer);
                        if (!res.headersSent) {
                            res.writeHead(500, {
                                'Content-Type': 'application/json',
                            });
                            res.end(
                                JSON.stringify(MCP_ERRORS.internalServerError)
                            );
                        }
                    }
                } else {
                    res.writeHead(405, {
                        'Content-Type': 'application/json',
                    });
                    res.end(
                        JSON.stringify({
                            error: 'Method Not Allowed',
                            status: 405,
                        })
                    );
                }
            } else if (pathname === '/ping') {
                if (req.method === 'GET') {
                    res.writeHead(200, {
                        'Content-Type': 'application/json',
                    });
                    res.end(JSON.stringify({ status: 'ok', message: 'pong' }));
                } else {
                    res.writeHead(405, {
                        'Content-Type': 'application/json',
                    });
                    res.end(
                        JSON.stringify({
                            error: 'Method Not Allowed',
                            status: 405,
                        })
                    );
                }
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Not Found', status: 404 }));
            }
        }
    );

    httpServer
        .once('listening', () => {
            logger.info(`Listening on port ${port}`);
        })
        .on('error', (err: NodeJS.ErrnoException) => {
            if (err.code === 'EADDRINUSE') {
                logger.error(`Port ${port} is already in use`);
            } else if (err.code === 'EACCES') {
                logger.error(`Port ${port} requires elevated privileges`);
            } else {
                logger.error({ err }, 'HTTP server error');
            }
            process.exit(1);
        })
        .on('close', () => {
            logger.warn('HTTP server closed');
        });

    httpServer.listen(port);
}

async function main(): Promise<void> {
    const options: Options = _getOptions();
    if (options.transport === 'stdio') {
        logger.disable();
        await _startStdioServer();
    } else if (options.transport === 'streamable-http') {
        logger.info('Starting Driflyte MCP server...');
        await _startStreamableHTTPServer(options.port);
        logger.info('Started Driflyte MCP Server');
    } else {
        logger.error(`Invalid transport: ${options.transport}`);
        process.exit(1);
    }
}

export default function createServer({ config }: any): McpServerRaw {
    const mcpServer: McpServer = createMcpServer();
    return mcpServer.server;
}

main().catch((error: any): never => {
    logger.enable();
    logger.error(`Server error: ${error}`);
    process.exit(1);
});
