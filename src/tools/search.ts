import { DriflyteClient } from '../client';
import { Response, SearchResponse } from '../domain';
import { Tool, ToolInputSchema, ToolOutputSchema } from './types';

import { z } from 'zod';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';

export class Search implements Tool {
    name(): string {
        return 'search';
    }

    description(): string {
        return (
            'Given a list of topics and a user question, this tool retrieves the top-K most relevant documents from the crawled content. ' +
            'It is designed to help AI assistants surface the most contextually appropriate and up-to-date information for a specific topic and query. ' +
            'This enables more informed and accurate responses based on real-world, topic-tagged web content.'
        );
    }

    inputSchema(): ToolInputSchema {
        return {
            topics: z
                .array(z.string())
                .describe(
                    'A list of one or more topic identifiers to constrain the search space. ' +
                        'Only documents tagged with at least one of these topics will be considered.'
                ),
            query: z
                .string()
                .describe(
                    'The natural language query or question for which relevant information is being sought. ' +
                        'This will be used to rank documents by semantic relevance.'
                )
                .optional(),
            topK: z
                .number()
                .min(1)
                .max(30)
                .optional()
                .default(10)
                .describe(
                    'The maximum number of relevant documents to return. ' +
                        'Results are sorted by descending relevance score.'
                ),
        };
    }

    outputSchema(): ToolOutputSchema {
        return {
            documents: z.array(
                z
                    .object({
                        id: z.string().describe('Id of the matched document.'),
                        content: z
                            .string()
                            .describe(
                                'Related content (full or partial) of the matched document.'
                            ),
                        metadata: z
                            .record(z.string(), z.any())
                            .describe(
                                'Metadata of the document and related content in key-value format.'
                            ),
                        score: z
                            .number()
                            .min(0)
                            .max(1)
                            .describe(
                                'Similarity score (between 0 and 1) for the content of the document.'
                            ),
                    })
                    .describe('Matched documents to the search query')
            ),
        };
    }

    async handle(
        server: Server,
        driflyteClient: DriflyteClient,
        { topics, query, topK }: any
    ): Promise<any> {
        const response: Response<SearchResponse> = await driflyteClient.search({
            topics,
            query,
            topK,
        });
        if (response.response) {
            return {
                documents: response.response.documents,
            };
        } else {
            return {};
        }
    }
}
