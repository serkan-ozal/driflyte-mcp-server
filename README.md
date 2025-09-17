# Driflyte MCP Server

![Build Status](https://github.com/serkan-ozal/driflyte-mcp-server/actions/workflows/build.yml/badge.svg)
![NPM Version](https://badge.fury.io/js/%40driflyte%2Fmcp-server.svg)
![License](https://img.shields.io/badge/license-MIT-blue)

MCP Server for [Driflyte](http://console.driflyte.com).

The Driflyte MCP Server exposes tools that allow AI assistants to query and retrieve topic-specific knowledge from recursively crawled and indexed web pages.
With this MCP server, Driflyte acts as a bridge between diverse, topic-aware content sources (web, GitHub, and more) and AI-powered reasoning, enabling richer, more accurate answers.


## What It Does

- **Deep Web Crawling**: Recursively follows links to crawl and index web pages.
- **GitHub Integration**: Crawls repositories, issues, and discussions.
- **Extensible Resource Support**: Future support planned for Slack, Microsoft Teams, Google Docs/Drive, Confluence, JIRA, Zendesk, Salesforce, and more.
- **Topic-Aware Indexing**: Each document is tagged with one or more topics, enabling targeted, topic-specific retrieval.
- **Designed for RAG with RAG**: The server itself is built with Retrieval-Augmented Generation (RAG) in mind, and it powers RAG workflows by providing assistants with high-quality, topic-specific documents as grounding context.
- **Designed for AI with AI**: The system is not just for AI assistants — it is also designed and evolved using AI itself, making it an AI-native component for intelligent knowledge retrieval.


## Usage & Limits

- **Free Access**: Driflyte is currently free to use.
- **No Signup Required**: You can start using it immediately — no registration or subscription needed.
- **Rate Limits**: To ensure fair usage, requests are limited by IP:
  - **`100` API requests** per **`5` minutes** per **IP address**.
- Future changes to usage policies and limits may be introduced as new features and resource integrations become available.

## Prerequisites
- Node.js 18+
- An AI assistant (with MCP client) like Cursor, Claude (Desktop or Code), VS Code, Windsurf, etc ...


## Quick Start

This MCP server (using `STDIO` transport) can be added to any MCP Client 
like VS Code, Claude, Cursor, Windsurf Github Copilot via the `@driflyte/mcp-server` NPM package.

### Claude Code

Run the following command.
See [Claude Code MCP docs](https://docs.anthropic.com/en/docs/claude-code/mcp) for more info.

#### Local Server
```sh
claude mcp add driflyte -- npx -y @driflye/mcp-server
```

#### Remote Server
```sh
claude mcp add --transport http driflyte https://mcp.driflyte.com/mcp
```

### Claude Desktop

#### Local Server
Add the following configuration into the `claude_desktop_config.json` file.
See the [Claude Desktop MCP docs](https://modelcontextprotocol.io/docs/develop/connect-local-servers) for more info.
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

#### Remote Server
Go to the `Settings` > `Connectors` > `Add Custom Connector` in the Claude Desktop and add the new MCP server with the following fields: 
- Name: `Driflyte` 
- Remote MCP server URL: `https://mcp.driflyte.com/mcp`

### Copilot Coding Agent

Add the following configuration to the `mcpServers` section of your Copilot Coding Agent configuration through 
`Repository` > `Settings` > `Copilot` > `Coding agent` > `MCP configuration`.
See the [Copilot Coding Agent MCP docs](https://docs.github.com/en/enterprise-cloud@latest/copilot/how-tos/agents/copilot-coding-agent/extending-copilot-coding-agent-with-mcp) for more info.

#### Local Server
```json
{
  "mcpServers": {
    "driflyte": {
      "type": "local",
      "command": "npx",
      "args": ["-y", "@driflyte/mcp-server"]
    }
  }
}
```

#### Remote Server
```json
{
  "mcpServers": {
    "driflyte": {
      "type": "http",
      "url": "https://mcp.driflyte.com/mcp"
    }
  }
}
```

### Cursor

Add the following configuration into the `~/.cursor/mcp.json` file (or `.cursor/mcp.json` in your project folder).
Or setup by 🖱️[One Click Installation](https://cursor.com/en/install-mcp?name=driflyte&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyIteSIsIkBkcmlmbHl0ZS9tY3Atc2VydmVyIl19).
See the [Cursor MCP docs](https://docs.cursor.com/context/model-context-protocol) for more info.

#### Local Server
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

#### Remote Server
```json
{
  "mcpServers": {
    "driflyte": {
      "url": "https://mcp.driflyte.com/mcp"
    }
  }
}
```

### Gemini CLI

Add the following configuration into the `~/.gemini/settings.json` file.
See the [Gemini CLI MCP docs](https://google-gemini.github.io/gemini-cli/docs/tools/mcp-server.html) for more info.

#### Local Server
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

#### Remote Server
```json
{
  "mcpServers": {
    "driflyte": {
      "httpUrl": "https://mcp.driflyte.com/mcp"
    }
  }
}
```

### VS Code

Add the following configuration into the `.vscode/mcp.json` file.
Or setup by 🖱️[One Click Installation](https://insiders.vscode.dev/redirect?url=vscode%3Amcp%2Finstall%3F%7B%22name%22%3A%22driflyte%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40driflyte%2Fmcp-server%22%5D%7D).
See the [VS Code MCP docs](https://code.visualstudio.com/docs/copilot/chat/mcp-servers) for more info.

#### Local Server
```json
{
  "mcp": {
    "servers": {
      "driflyte": {
        "type": "stdio",
        "command": "npx",
        "args": ["-y", "@driflyte/mcp-server"]
      }
    }
  }
}
```

#### Remote Server
```json
{
  "mcp": {
    "servers": {
      "driflyte": {
        "type": "http",
        "url": "https://mcp.driflyte.com/mcp"
      }
    }
  }
}
```

### Windsurf

Add the following configuration into the `~/.codeium/windsurf/mcp_config.json` file. 
See the [Windsurf MCP docs](https://docs.windsurf.com/windsurf/cascade/mcp) for more info.

#### Local Server
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

#### Remote Server
```json
{
  "mcpServers": {
    "driflyte": {
      "serverUrl": "https://mcp.driflyte.com/mcp"
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
- Integrate with more data sources (Slack, Teams, Google Docs/Drive, Confluence, JIRA, Zendesk, Salesforce, etc ...))
- Support more topics with their resources


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
