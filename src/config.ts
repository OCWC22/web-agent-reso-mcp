import dotenv from 'dotenv';
dotenv.config();

export interface Config {
  apiKey: string;
  port: number;
  isProduction: boolean;
  agentMailBaseUrl?: string; // Optional: required for live AgentMail API calls
}

export function loadConfig(): Config {
  const apiKey = process.env['AGENTMAIL_API_KEY'];
  if (!apiKey) {
    throw new Error('AGENTMAIL_API_KEY environment variable is required');
  }

  const port = parseInt(process.env.PORT || '8080', 10);
  const isProduction = process.env.NODE_ENV === 'production';
  const agentMailBaseUrl = process.env['AGENTMAIL_BASE_URL'];

  return { apiKey, port, isProduction, agentMailBaseUrl };
}
