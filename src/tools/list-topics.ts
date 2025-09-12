import { DriflyteClient } from '../client';
import { CrawlJobInventoryListResponse, Response } from '../domain';
import { Tool, ToolInputSchema, ToolOutputSchema } from './types';

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { z } from 'zod';

export class ListTopics implements Tool {
    name(): string {
        return 'list-topics';
    }

    description(): string {
        return (
            'Returns a list of topics for which resources (web pages, etc ...) have been crawled and content is available. ' +
            'This allows AI assistants to discover the most relevant and up-to-date subject areas currently indexed by the crawler.'
        );
    }

    inputSchema(): ToolInputSchema {
        return {};
    }

    outputSchema(): ToolOutputSchema {
        return {
            topics: z
                .array(z.string())
                .describe('List of the supported topics.'),
        };
    }

    async handle(
        server: Server,
        driflyteClient: DriflyteClient,
        {}: any
    ): Promise<any> {
        const response: Response<CrawlJobInventoryListResponse> =
            await driflyteClient.listJobInventory();
        return {
            topics: response.response?.jobInventory?.topics || [],
        };
    }
}
