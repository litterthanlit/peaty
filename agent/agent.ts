import { defineAgent } from "eve";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export default defineAgent({
  // Coaching agent: no sandbox shell/file tools unless we opt back in.
  defaultTools: false,
  model: "openai/gpt-5.6-luna-fast",
  // Same HTTP session stays alive for the morning return loop.
  limits: {
    sessionTimeoutMs: THIRTY_DAYS_MS,
  },
});
