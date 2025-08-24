import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import OpenAI from 'openai';
// NOTE: install via JSR: npx jsr add @browser-use/browser-use-node
import {
  Agent,
  BrowserSession,
  BrowserProfile,
  Controller,
  type ActionResult,
} from '@browser-use/browser-use-node';

import { ReserveArgs } from './types.js';
import { getCopyCode } from './utils/getCopyCode.js';

export class BrowserUseClient {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  private async llm(prompt: string): Promise<string> {
    const res = await this.openai.responses.create({ model: 'o3', input: prompt });
    const text = (res as any).output_text ?? '';
    if (text) return String(text).trim();
    const mapped = (res as any).output?.map((p: any) => p?.content?.map((c: any) => c?.text).join('\n')).join('\n');
    return String(mapped || '').trim();
  }

  /**
   * Execute the OpenTable reservation task using browser-use.
   */
  async reserveOpenTable(args: ReserveArgs): Promise<string> {
    const DATE = args.date;
    const TIME = args.time;
    const PPL = args.people;
    const LOCATION = args.location;
    const INBOX_ID = args.inboxId ?? 'opentable_2@agentmail.to';
    const PHONE = args.phone ?? '+18777804236';
    const FIRST_NAME = args.firstName ?? 'WAGENT';
    const LAST_NAME = args.lastName ?? 'SRY';

    const taskDetails = `\nComplete a restaurant reservation on OpenTable:\n\n1) Go to opentable.com\n2) In the search: date:${DATE}, time:${TIME}, people:${PPL}, location:${LOCATION}, then Search\n3) Select the first available restaurant\n4) Use email ${INBOX_ID} to make the reservation\n   - If credit card is required, go back and choose another restaurant\n5) If asked for a verification code:\n   - Call the \"Get verification code from email\" action to fetch the code\n   - Enter the code and continue\n   - If no code yet, wait briefly and try again\n6) If prompted for personal info:\n   - Phone: ${PHONE}  (USA +1)\n   - First name: ${FIRST_NAME}\n   - Last name: ${LAST_NAME}\n7) Finish the reservation and return:\n   - Restaurant name & location\n   - Reservation date & time\n   - Number of people\n   - Confirmation number (if available)\n\nImportant: Do not pause when verification is needed—use the custom action to get the code and continue.\n`.trim();

    // Temp user profile dir
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'browser_use_'));
    const profile = new BrowserProfile({ user_data_dir: tmp });
    const session = new BrowserSession({ browser_profile: profile });

    const controller = new Controller();
    controller.action('Get verification code from email', async (inbox_id: string = INBOX_ID): Promise<ActionResult> => {
      try {
        const code = await getCopyCode(inbox_id);
        if (code) {
          return { extracted_content: `Found verification code: ${code}`, include_in_memory: false };
        }
        return { extracted_content: 'No verification code found yet. Wait and try again.', include_in_memory: false };
      } catch (err: any) {
        return { extracted_content: `Error retrieving verification code: ${String(err?.message || err)}` , include_in_memory: false };
      }
    });

    const agent = new Agent({
      task: taskDetails,
      llm: (p: string) => this.llm(p),
      browser_session: session,
      controller,
      max_steps: 50,
      save_conversation_path: path.resolve('complete_reservation_conversation.json'),
    });

    try {
      const result = await agent.run();
      const finalText = typeof (result as any)?.final_result === 'function' ? String((result as any).final_result()) : String(result ?? '');
      return finalText || 'Reservation flow finished (no summary returned).';
    } finally {
      try { fs.rmSync(tmp, { recursive: true, force: true }); } catch {}
    }
  }
}
