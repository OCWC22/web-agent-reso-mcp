#!/usr/bin/env node
import { config as loadEnv } from 'dotenv';
loadEnv();

import { loadConfig } from './config.js';
import { parseArgs } from './cli.js';
import { AgentMailServer } from './server.js';
import { runStdioTransport, startHttpTransport } from './transport/index.js';

async function main() {
  try {
    const config = loadConfig();
    const cliOptions = parseArgs();

    if (cliOptions.stdio) {
      const server = new AgentMailServer(config.apiKey, config.agentMailBaseUrl);
      await runStdioTransport(server.getServer());
    } else {
      const port = cliOptions.port || config.port;
      startHttpTransport({ ...config, port });
    }
  } catch (error) {
    console.error('Fatal error running web-agent-reso-mcp server:', error);
    process.exit(1);
  }
}

main();
