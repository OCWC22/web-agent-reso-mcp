export interface AgentMailToolBaseArgs {
  inbox_id: string; // e.g., "opentable@agentmail.to"
}

export interface GetLatestEmailHtmlArgs extends AgentMailToolBaseArgs {}

export interface GetCopyCodeArgs extends AgentMailToolBaseArgs {}

export interface GetConfirmationUrlArgs extends AgentMailToolBaseArgs {}

export interface AgentMailMessageList {
  count: number;
  messages: Array<{
    message_id?: string;
    id?: string;
    subject?: string;
  }>;
}

export interface AgentMailMessage {
  message_id?: string;
  id?: string;
  html?: string;
  subject?: string;
}
