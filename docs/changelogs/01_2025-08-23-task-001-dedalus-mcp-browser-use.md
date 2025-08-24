# Changelog: 01_2025-08-23 - Dedalus-compliant MCP server scaffold (Task 001)

**Task:** [001] Convert browser-use web agent into a Dedalus-compliant MCP server
**Status:** Done

### Files Updated:
- **CREATED:** `src/index.ts` – entrypoint with transport selection, dotenv load
- **CREATED:** `src/cli.ts` – CLI arg parsing
- **CREATED:** `src/config.ts` – env configuration, OPENAI key validation
- **CREATED:** `src/server.ts` – MCP server with tool registration
- **CREATED:** `src/types.ts` – typed tool args for reservation
- **CREATED:** `src/client.ts` – BrowserUseClient wrapping browser-use flow and OpenAI o3
- **CREATED:** `src/tools/browser.ts` – tool definition + handler for OpenTable reservation
- **CREATED:** `src/tools/index.ts` – re-export tools
- **CREATED:** `src/transport/http.ts` – Streamable HTTP transport + SSE + health
- **CREATED:** `src/transport/stdio.ts` – STDIO transport for dev
- **CREATED:** `src/transport/index.ts` – transport exports
- **CREATED:** `src/utils/getCopyCode.ts` – placeholder for inbox verification code
- **CREATED:** `package.json` – ESM, scripts, deps (@mcp sdk, openai, dotenv)
- **CREATED:** `tsconfig.json` – strict TS config
- **CREATED:** `.gitignore` – standard ignores + .env
- **CREATED:** `.env.example` – env template
- **CREATED:** `README.md` – usage and notes

### Description:
Initial scaffold of a streamable HTTP MCP server exposing a browser-use reservation tool. Architecture matches Dedalus guide with modular src/ layout, typed inputs, transports, and config management.

### Reasoning:
Follows Dedalus Labs MCP server architecture for maintainability and compatibility. Encapsulates the browser agent in a dedicated client with a stable tool surface.

### Key Decisions & Trade‑off:
- Used OpenAI o3 via Responses API; requires OPENAI_API_KEY. Dedalus HTTP auth not used per guidance.
- `@browser-use/browser-use-node` is installed via JSR; documented in README. If API changes, only client import/Agent construction should need tweaks.
- `getCopyCode` left as provider-agnostic stub to avoid guessing proprietary inbox APIs; keeps server stateless and configurable.

### Future Work:
- Implement `getCopyCode` for your inbox provider (AgentMail).
- Add structured logging and tests.
- Consider rate limiting and metrics in production.
