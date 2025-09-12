import { DriflyteClient } from '../client';

import { z, ZodRawShape, ZodTypeAny } from 'zod';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';

export type ToolInputSchema = ZodRawShape;
export type ToolOutputSchema = ZodRawShape;
export type ToolInput = z.objectOutputType<ZodRawShape, ZodTypeAny>;
export type ToolOutput = any;

export interface Tool {
    name(): string;
    description(): string;
    inputSchema(): ToolInputSchema;
    outputSchema(): ToolOutputSchema;
    handle(
        server: Server,
        driflyteClient: DriflyteClient,
        args: ToolInput
    ): Promise<ToolOutput>;
}
