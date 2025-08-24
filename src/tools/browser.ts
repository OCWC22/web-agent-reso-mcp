import { Tool, CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { BrowserUseClient } from '../client.js';
import { ReserveArgs } from '../types.js';

export const reserveOpenTableToolDefinition: Tool = {
  name: 'browser_use_reserve_opentable',
  description: 'Complete an OpenTable reservation via a headful browser agent. Provide date, time, people, location, and optional contact details.',
  inputSchema: {
    type: 'object',
    properties: {
      date: { type: 'string', description: 'Reservation date, e.g., 2025-08-31' },
      time: { type: 'string', description: 'Reservation time, e.g., 7PM' },
      people: { type: 'number', description: 'Number of people, e.g., 2' },
      location: { type: 'string', description: 'City or area, e.g., San Francisco' },
      inboxId: { type: 'string', description: 'Inbox email to receive verification code' },
      phone: { type: 'string', description: 'Contact phone number, E.164 format' },
      firstName: { type: 'string' },
      lastName: { type: 'string' }
    },
    required: ['date', 'time', 'people', 'location']
  }
};

function isReserveArgs(args: unknown): args is ReserveArgs {
  if (!args || typeof args !== 'object') return false;
  const a = args as Record<string, unknown>;
  return typeof a.date === 'string' && typeof a.time === 'string' && typeof a.people === 'number' && typeof a.location === 'string';
}

export async function handleReserveOpenTableTool(client: BrowserUseClient, args: unknown): Promise<CallToolResult> {
  try {
    if (!isReserveArgs(args)) {
      throw new Error('Invalid arguments for browser_use_reserve_opentable');
    }
    const result = await client.reserveOpenTable(args);
    return { content: [{ type: 'text', text: result }], isError: false };
  } catch (error) {
    return {
      content: [{ type: 'text', text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
      isError: true,
    };
  }
}
