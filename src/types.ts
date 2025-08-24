export interface ReserveArgs {
  date: string; // e.g. '2025-08-31'
  time: string; // e.g. '7PM'
  people: number; // e.g. 2
  location: string; // e.g. 'San Francisco'
  inboxId?: string; // e.g. 'opentable_2@agentmail.to'
  phone?: string; // e.g. '+18777804236'
  firstName?: string; // e.g. 'WAGENT'
  lastName?: string; // e.g. 'SRY'
}
