import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema, ListToolsRequestSchema, InitializedNotificationSchema } from '@modelcontextprotocol/sdk/types.js';
import { BrowserUseClient } from './client.js';
import { reserveOpenTableToolDefinition, handleReserveOpenTableTool } from './tools/index.js';

export function createStandaloneServer(openaiApiKey: string): Server {
  const serverInstance = new Server(
    { name: 'org/browser-use', version: '0.2.0' },
    { capabilities: { tools: {} } }
  );

  const client = new BrowserUseClient(openaiApiKey);

  serverInstance.setNotificationHandler(InitializedNotificationSchema, async () => {
    console.log('browser-use MCP client initialized');
  });

  serverInstance.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [reserveOpenTableToolDefinition],
  }));

  serverInstance.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    switch (name) {
      case 'browser_use_reserve_opentable':
        return await handleReserveOpenTableTool(client, args);
      default:
        return { content: [{ type: 'text', text: `Unknown tool: ${name}` }], isError: true };
    }
  });

  return serverInstance;
}

export class BrowserUseServer {
  constructor(private openaiApiKey: string) {}
  getServer(): Server {
    return createStandaloneServer(this.openaiApiKey);
  }
}
