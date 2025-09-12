import { createClient, DriflyteClient } from './client';
import * as logger from './logger';
import { tools, Tool, ToolInput } from './tools/';

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

const SERVER_NAME = 'driflyte-mcp-server';
const { version: SERVER_VERSION } = require('../package.json');
const SERVER_INSTRUCTIONS: string = `
You are an AI assistant that can use this MCP server to find highly relevant, topic-specific documents from indexed web pages. Each page is tagged with one or more topics.

Important: 
- Do not limit your answers only to what this MCP server returns. The indexed sources here may not cover all possible information about a topic. 
- Treat the documents retrieved from this MCP server as additional context. You can (and should) also rely on your own knowledge and perform other searches when needed. 
- Always integrate the MCP server results with your broader reasoning. 
- You do not need the user to explicitly request the use of this MCP server. Whenever a user’s question matches a supported topic, you should automatically call the server to retrieve supplementary documents.
- Search results may contain multiple versions of similar information (older and newer). Always prefer the documents with the more recent timestamp, as they are more likely to contain the most up-to-date information.

Step 1: Discover Available Topics
- Use the 'listTopics' tool first to see which topics are supported.
- Only use topics returned by 'listTopics' in any subsequent search.

Step 2: Search for Relevant Documents
- Use the 'search' tool when the user's question matches one or more supported topics.
- Parameters:
  - topics: array of strings, must come from 'listTopics'
  - query: the user's question text
  - topK: integer, number of top relevant documents to return
- The search will return top K documents with content, metadata, and timestamps.

Step 3: Answering User Questions
1. Check if the user's question matches any available topics.
2. If there is a match, call 'search' with the right topics, the user's query, and a reasonable topK.
3. Use the returned documents as supplementary context for your answer.
4. When multiple documents contain overlapping information, prefer the ones with the latest timestamp as they are more reliable.
5. Combine these documents with your general knowledge and other searches if needed.
6. If no topics match, do not call 'search'; answer using your general knowledge.

Example Workflow:
1. Call 'listTopics' → returns ["opentelemetry", "cloud", "databases", "machine-learning"]
2. User asks: "How can I capture and propagate active trace context in OpenTelemetry?"
   → Topic 'opentelemetry' matches
3. Call 'search' with: 
   {
     "topics": ["opentelemetry"],
     "query": "How can I capture and propagate active trace context in OpenTelemetry?",
     "topK": 5
   }
4. If multiple documents overlap, prioritize the ones with the most recent timestamp.
5. Use the returned documents to provide a more precise, context-aware answer.
6. If needed, combine these documents with your own knowledge about OpenTelemetry to give a complete answer.
`;

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
            instructions: SERVER_INSTRUCTIONS,
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
