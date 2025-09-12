# Driflyte MCP Server

![Build Status](https://github.com/serkan-ozal/driflyte-mcp-server/actions/workflows/build.yml/badge.svg)
![NPM Version](https://badge.fury.io/js/driflyte-mcp-server.svg)
![License](https://img.shields.io/badge/license-MIT-blue)

MCP Server for [driflyte](http://www.driflyte.com).


## Prerequisites
- Node.js 18+


## Quick Start

This MCP server (using `STDIO` transport) can be added to any MCP Client 
like VS Code, Claude, Cursor, Windsurf Github Copilot via the `@driflyte/mcp-server` NPM package.

### VS Code

```json
{
  "servers": {
    "driflyte": {
      "command": "npx",
      "args": ["-y", "@driflyte/mcp-server"],
      "envFile": "${workspaceFolder}/.env"
    }
  }
}
```

### Claude Desktop
```json
{
  "mcpServers": {
    "driflyte": {
      "command": "npx",
      "args": ["-y", "@driflyte/mcp-server"]
    }
  }
}
```


## Components

### Tools

- `list-topics`: Returns a list of topics for which resources (web pages, etc ...) have been crawled and content is available. 
                 This allows AI assistants to discover the most relevant and up-to-date subject areas currently indexed by the crawler.
  - **Input Schema**: No input parameter supported.
  - **Output Schema**:
    - `topics`:
      - `Optinal`: `false`
      - `Type`: `Array<string>`
      - `Description`: List of the supported topics.
- `search`: Given a list of topics and a user question, this tool retrieves the top-K most relevant documents from the crawled content. 
            It is designed to help AI assistants surface the most contextually appropriate and up-to-date information for a specific topic and query.
            This enables more informed and accurate responses based on real-world, topic-tagged web content.
  - **Input Schema**:
    - `topics`
      - `Optinal`: `false`
      - `Type`: `Array<string>`
      - `Description`: A list of one or more topic identifiers to constrain the search space.
                       Only documents tagged with at least one of these topics will be considered.
    - `query`
      - `Optinal`: `false`
      - `Type`: `string`
      - `Description`: The natural language query or question for which relevant information is being sought.
                       This will be used to rank documents by semantic relevance. 
    - `topK`
      - `Optinal`: `true`
      - `Type`: `number`
      - `Default Value`: `10`
      - `Min Value`: `1`
      - `Max Value`: `30`
      - `Description`: The maximum number of relevant documents to return.
                       Results are sorted by descending relevance score.
  - **Output Schema**:
    - `documents`:
      - `Optional`: `false`
      - `Type`: `Array<Document>`
      - `Description`: Matched documents to the search query.
      - **Type**: `Document`:
        - `content`
          - `Optinal`: `false`
          - `Type`: `string`
          - `Description`: Related content (full or partial) of the matched document.
        - `metadata`
          - `Optinal`: `false`
          - `Type`: `Map<string, any>`
          - `Description`: Metadata of the document and related content in key-value format.
        - `score`
          - `Optinal`: `false`
          - `Type`: `number`
          - `Min Value`: `0`
          - `Max Value`: `1`
          - `Description`: Similarity score (between `0` and `1`) for the content of the document.

### Resources

N/A


## Roadmap

- Support `HTTP Stream` transport protocol (`SSE` transport protocol is deprecated in favor of it) to be able to use the MCP server from remote.
- Add more supported topics with their resources


## Issues and Feedback

[![Issues](https://img.shields.io/github/issues/serkan-ozal/driflyte-mcp-server.svg)](https://github.com/serkan-ozal/driflyte-mcp-server/issues?q=is%3Aopen+is%3Aissue)
[![Closed issues](https://img.shields.io/github/issues-closed/serkan-ozal/driflyte-mcp-server.svg)](https://github.com/serkan-ozal/driflyte-mcp-server/issues?q=is%3Aissue+is%3Aclosed)

Please use [GitHub Issues](https://github.com/serkan-ozal/driflyte-mcp-server/issues) for any bug report, feature request and support.


## Contribution

[![Pull requests](https://img.shields.io/github/issues-pr/serkan-ozal/driflyte-mcp-server.svg)](https://github.com/serkan-ozal/driflyte-mcp-server/pulls?q=is%3Aopen+is%3Apr)
[![Closed pull requests](https://img.shields.io/github/issues-pr-closed/serkan-ozal/driflyte-mcp-server.svg)](https://github.com/serkan-ozal/driflyte-mcp-server/pulls?q=is%3Apr+is%3Aclosed)
[![Contributors](https://img.shields.io/github/contributors/serkan-ozal/driflyte-mcp-server.svg)]()

If you would like to contribute, please
- Fork the repository on GitHub and clone your fork.
- Create a branch for your changes and make your changes on it.
- Send a pull request by explaining clearly what is your contribution.

> Tip:
> Please check the existing pull requests for similar contributions and
> consider submit an issue to discuss the proposed feature before writing code.

## License

Licensed under [MIT](LICENSE).
