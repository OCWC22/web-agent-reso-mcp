import dotenv from 'dotenv';
dotenv.config();

export interface Config {
  openaiApiKey: string;
  port: number;
  isProduction: boolean;
}

export function loadConfig(): Config {
  const openaiApiKey = process.env.OPENAI_API_KEY;
  if (!openaiApiKey) {
    throw new Error('OPENAI_API_KEY environment variable is required');
  }

  const port = parseInt(process.env.PORT || '8080', 10);
  const isProduction = process.env.NODE_ENV === 'production';

  return { openaiApiKey, port, isProduction };
}
