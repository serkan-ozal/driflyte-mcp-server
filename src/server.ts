import { createClient, DriflyteClient } from './client';
import * as logger from './logger';
import { tools, Tool, ToolInput } from './tools/';

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

const SERVER_NAME = 'driflyte-mcp-server';
const { version: SERVER_VERSION } = require('../package.json');

const DEFAULT_DRIFLYTE_API_URL: string = 'https://api.driflyte.com';

function _createDriflyteClient(): DriflyteClient {
    return createClient({
        url: process.env.DRIFLYTE_API_URL || DEFAULT_DRIFLYTE_API_URL,
    });
}

export async function startServer(): Promise<void> {
    const server = new McpServer(
        {
            name: SERVER_NAME,
            version: SERVER_VERSION,
        },
        {
            capabilities: {
                resources: {},
                tools: {},
            },
        }
    );

    const driflyteClient: DriflyteClient = _createDriflyteClient();

    const createToolCallback = (tool: Tool) => {
        return async (args: ToolInput): Promise<CallToolResult> => {
            try {
                const response = await tool.handle(
                    server.server,
                    driflyteClient,
                    args
                );
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(response, null, 2),
                        },
                    ],
                    structuredContent: response,
                    isError: false,
                };
            } catch (error: any) {
                return {
                    content: [
                        { type: 'text', text: `Error: ${error.message}` },
                    ],
                    isError: true,
                };
            }
        };
    };

    tools.forEach((t: Tool) => {
        logger.info(`Registering tool ${t.name} ...`);
        server.registerTool(
            t.name(),
            {
                description: t.description(),
                inputSchema: t.inputSchema(),
                outputSchema: t.outputSchema(),
            },
            createToolCallback(t)
        );
    });

    const transport = new StdioServerTransport();
    await server.connect(transport);
}
