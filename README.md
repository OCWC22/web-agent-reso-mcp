# web-agent-reso-mcp (Dedalus-compatible)

A TypeScript MCP server exposing tools to retrieve verification data from AgentMail inboxes. Implements the Dedalus "streamable HTTP" transport pattern with `/mcp`, `/sse`, and `/health` endpoints.

## Tools

- `agentmail_get_latest_email_html`
  - Input: `{ "inbox_id": string }`
  - Output: HTML string of the latest message or note if none
- `agentmail_get_copy_code`
  - Input: `{ "inbox_id": string }`
  - Output: Text inside `span#copy-code` from the latest email HTML
- `agentmail_get_confirmation_url`
  - Input: `{ "inbox_id": string }`
  - Output: `href` from `a#confirm-email-link` in the latest email HTML

These mirror the Python helpers in `wei-prototype/browser-use/utils.py`.

## Requirements

- Node 18+ (global `fetch` available)
- Environment variables:
  - `AGENTMAIL_API_KEY` (required)
  - `AGENTMAIL_BASE_URL` (required for live HTTP access, e.g., `https://api.agentmail.to`)
  - `PORT` (optional, default `8080`)
  - `NODE_ENV` (`production` to listen on 0.0.0.0)

## Install & Build

```bash
npm install
npm run build
```

## Run

HTTP transport (recommended):
```bash
AGENTMAIL_API_KEY=... AGENTMAIL_BASE_URL=https://api.agentmail.to PORT=8080 \
node dist/index.js
```

STDIO transport (for local dev):
```bash
AGENTMAIL_API_KEY=... AGENTMAIL_BASE_URL=https://api.agentmail.to \
node dist/index.js --stdio
```

Health check:
```bash
curl -s http://localhost:8080/health | jq
```

Client config example (local dev):
```json
{
  "mcpServers": {
    "web-agent-reso-mcp": {
      "url": "http://localhost:8080/mcp"
    }
  }
}
```

## Project Structure

- `src/index.ts` — entrypoint, selects transport
- `src/config.ts` — env + config
- `src/cli.ts` — CLI parsing
- `src/server.ts` — MCP server + tools registration
- `src/tools/agentmail.ts` — tool definitions + handlers
- `src/client.ts` — HTTP client for AgentMail
- `src/transport/http.ts` — streamable HTTP transport
- `src/transport/stdio.ts` — stdio transport

## Notes

- The server is stateless and does not implement authentication itself; it relies on `AGENTMAIL_API_KEY`.
- This focuses on the custom email verification functions used by the Python `script.py` so browser automation can call MCP tools when a verification code is needed.
