FROM node:22-slim

WORKDIR /app

# Default HTTP port
ENV PORT=8081

# Copy package files
COPY package.json package-lock.json tsconfig.types.json ./

# Copy source code
COPY src ./src

# Install dependencies
RUN npm ci

# Build
RUN npm run build

# Expose HTTP port
EXPOSE $PORT

# Start MCP server with "streamable-http" transport on given port (defaults to 8081)
CMD ["node", "dist/index.cjs", "--transport", "streamable-http"]
