import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  InitializedNotificationSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { AgentMailClient } from './client.js';
import {
  agentmailGetLatestEmailHtml,
  agentmailGetCopyCode,
  agentmailGetConfirmationUrl,
  handleAgentmailGetLatestEmailHtml,
  handleAgentmailGetCopyCode,
  handleAgentmailGetConfirmationUrl,
} from './tools/index.js';

export function createStandaloneServer(apiKey: string, baseUrl?: string): Server {
  const serverInstance = new Server(
    {
      name: 'web-agent-reso-mcp',
      version: '0.2.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  const client = new AgentMailClient(apiKey, baseUrl);

  serverInstance.setNotificationHandler(InitializedNotificationSchema, async () => {
    console.log('[AgentMail] MCP client initialized');
  });

  serverInstance.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [agentmailGetLatestEmailHtml, agentmailGetCopyCode, agentmailGetConfirmationUrl],
  }));

  serverInstance.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    switch (name) {
      case 'agentmail_get_latest_email_html':
        return await handleAgentmailGetLatestEmailHtml(client, args);
      case 'agentmail_get_copy_code':
        return await handleAgentmailGetCopyCode(client, args);
      case 'agentmail_get_confirmation_url':
        return await handleAgentmailGetConfirmationUrl(client, args);
      default:
        return {
          content: [{ type: 'text', text: `Unknown tool: ${name}` }],
          isError: true,
        };
    }
  });

  return serverInstance;
}

export class AgentMailServer {
  private apiKey: string;
  private baseUrl?: string;

  constructor(apiKey: string, baseUrl?: string) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  getServer(): Server {
    return createStandaloneServer(this.apiKey, this.baseUrl);
  }
}
