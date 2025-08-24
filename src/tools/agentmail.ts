import type { Tool, CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { AgentMailClient } from '../client.js';
import type {
  GetLatestEmailHtmlArgs,
  GetCopyCodeArgs,
  GetConfirmationUrlArgs,
} from '../types.js';
import * as cheerio from 'cheerio';

// ===== Tool Definitions =====
export const agentmailGetLatestEmailHtml: Tool = {
  name: 'agentmail_get_latest_email_html',
  description:
    'Returns the HTML content of the latest email in the specified AgentMail inbox.',
  inputSchema: {
    type: 'object',
    properties: {
      inbox_id: {
        type: 'string',
        description: 'AgentMail inbox ID (e.g., opentable@agentmail.to)',
      },
    },
    required: ['inbox_id'],
  },
};

export const agentmailGetCopyCode: Tool = {
  name: 'agentmail_get_copy_code',
  description:
    'Extracts the verification code from the latest email HTML by selecting span#copy-code.',
  inputSchema: {
    type: 'object',
    properties: {
      inbox_id: {
        type: 'string',
        description: 'AgentMail inbox ID (e.g., opentable@agentmail.to)',
      },
    },
    required: ['inbox_id'],
  },
};

export const agentmailGetConfirmationUrl: Tool = {
  name: 'agentmail_get_confirmation_url',
  description:
    'Extracts the confirmation URL from the latest email HTML by selecting a#confirm-email-link.',
  inputSchema: {
    type: 'object',
    properties: {
      inbox_id: {
        type: 'string',
        description: 'AgentMail inbox ID (e.g., opentable@agentmail.to)',
      },
    },
    required: ['inbox_id'],
  },
};

// ===== Type Guards =====
function isLatestArgs(x: unknown): x is GetLatestEmailHtmlArgs {
  return !!x && typeof x === 'object' && 'inbox_id' in (x as any) && typeof (x as any).inbox_id === 'string';
}

function isCopyCodeArgs(x: unknown): x is GetCopyCodeArgs {
  return isLatestArgs(x);
}

function isConfirmUrlArgs(x: unknown): x is GetConfirmationUrlArgs {
  return isLatestArgs(x);
}

// ===== Handlers =====
export async function handleAgentmailGetLatestEmailHtml(
  client: AgentMailClient,
  args: unknown
): Promise<CallToolResult> {
  try {
    if (!isLatestArgs(args)) throw new Error('Invalid arguments: inbox_id is required');

    const html = await client.getLatestMessageHtml(args.inbox_id);
    if (!html) {
      return {
        content: [{ type: 'text', text: 'No messages found in inbox or message has no HTML.' }],
        isError: false,
      };
    }

    return {
      content: [{ type: 'text', text: html }],
      isError: false,
    };
  } catch (err) {
    return errorResult(err);
  }
}

export async function handleAgentmailGetCopyCode(
  client: AgentMailClient,
  args: unknown
): Promise<CallToolResult> {
  try {
    if (!isCopyCodeArgs(args)) throw new Error('Invalid arguments: inbox_id is required');

    const html = await client.getLatestMessageHtml(args.inbox_id);
    if (!html) {
      return {
        content: [{ type: 'text', text: 'No messages found in inbox or message has no HTML.' }],
        isError: false,
      };
    }

    const $ = cheerio.load(html);
    const code = $('span#copy-code').text().trim();

    return {
      content: [{ type: 'text', text: code || '' }],
      isError: false,
    };
  } catch (err) {
    return errorResult(err);
  }
}

export async function handleAgentmailGetConfirmationUrl(
  client: AgentMailClient,
  args: unknown
): Promise<CallToolResult> {
  try {
    if (!isConfirmUrlArgs(args)) throw new Error('Invalid arguments: inbox_id is required');

    const html = await client.getLatestMessageHtml(args.inbox_id);
    if (!html) {
      return {
        content: [{ type: 'text', text: 'No messages found in inbox or message has no HTML.' }],
        isError: false,
      };
    }

    const $ = cheerio.load(html);
    const href = $('a#confirm-email-link').attr('href') || '';

    return {
      content: [{ type: 'text', text: href }],
      isError: false,
    };
  } catch (err) {
    return errorResult(err);
  }
}

function errorResult(err: unknown): CallToolResult {
  return {
    content: [{ type: 'text', text: `Error: ${err instanceof Error ? err.message : String(err)}` }],
    isError: true,
  };
}
