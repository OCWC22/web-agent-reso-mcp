import type { AgentMailMessage, AgentMailMessageList } from './types.js';

export class AgentMailClient {
  private apiKey: string;
  private baseUrl?: string;

  constructor(apiKey: string, baseUrl?: string) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  private ensureConfigured() {
    if (!this.baseUrl) {
      throw new Error(
        'AgentMail base URL is not configured. Set AGENTMAIL_BASE_URL to the AgentMail HTTP API base (e.g., https://api.agentmail.to) or provide a custom client.'
      );
    }
  }

  async listMessages(inboxId: string): Promise<AgentMailMessageList> {
    this.ensureConfigured();

    const url = new URL(`/inboxes/${encodeURIComponent(inboxId)}/messages`, this.baseUrl);
    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
    });

    if (!res.ok) {
      const text = await safeReadText(res);
      throw new Error(`AgentMail list messages failed: ${res.status} ${res.statusText} — ${text}`);
    }

    const data = (await res.json()) as AgentMailMessageList;
    return data;
  }

  async getMessage(inboxId: string, messageId: string): Promise<AgentMailMessage> {
    this.ensureConfigured();

    const url = new URL(
      `/inboxes/${encodeURIComponent(inboxId)}/messages/${encodeURIComponent(messageId)}`,
      this.baseUrl
    );
    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
    });

    if (!res.ok) {
      const text = await safeReadText(res);
      throw new Error(`AgentMail get message failed: ${res.status} ${res.statusText} — ${text}`);
    }

    const data = (await res.json()) as AgentMailMessage;
    return data;
  }

  async getLatestMessageHtml(inboxId: string): Promise<string | null> {
    const list = await this.listMessages(inboxId);
    if (!list || list.count === 0 || !Array.isArray(list.messages) || list.messages.length === 0) {
      return null;
    }

    const latest = list.messages[0];
    const id = latest.message_id || latest.id;
    if (!id) return null;

    const message = await this.getMessage(inboxId, id);
    return message.html ?? null;
  }
}

async function safeReadText(res: Response): Promise<string> {
  try {
    return await res.text();
  } catch {
    return '<no response body>';
  }
}
