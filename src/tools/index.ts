import { Tool, ToolInput, ToolOutput } from './types';
import { ListTopics } from './list-topics';
import { Search } from './search';

export const tools: Tool[] = [new ListTopics(), new Search()];

export { Tool, ToolInput, ToolOutput };
