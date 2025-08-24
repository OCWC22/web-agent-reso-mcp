# Browser-Use MCP Server (Dedalus compatible)

Streamable HTTP MCP server that exposes a tool to complete an OpenTable reservation using the experimental `@browser-use/browser-use-node` port and OpenAI o3 via the official Node SDK.

## Quickstart

1. Install deps (npm + JSR):

```bash
npm i
npx jsr add @browser-use/browser-use-node
```

2. Set env:

```bash
cp .env.example .env # then edit OPENAI_API_KEY
```

3. Build and run HTTP server:

```bash
npm run dev
```

Or STDIO for local development:

```bash
npm run dev:stdio
```

## Tool

- `browser_use_reserve_opentable` — Inputs: { date, time, people, location, inboxId?, phone?, firstName?, lastName? }

## Client config (development)

```json
{
  "mcpServers": {
    "browser-use": {
      "url": "http://localhost:8080/mcp"
    }
  }
}
```

## Notes

- The Browser-Use JS/TS API is experimental; verify symbols if it changes.
- Implement `src/utils/getCopyCode.ts` with your email provider.
- Requires OPENAI_API_KEY. Server is stateless aside from transient browser profile per run.
