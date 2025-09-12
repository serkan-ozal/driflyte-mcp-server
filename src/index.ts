#!/usr/bin/env node

import * as logger from './logger';
import { startServer } from './server';

async function main() {
    logger.info('Starting Driflyte MCP server...');
    await startServer();
    logger.info('Started Driflyte MCP Server');
}

main().catch((error) => {
    logger.error(`Server error: ${error}`);
    process.exit(1);
});
