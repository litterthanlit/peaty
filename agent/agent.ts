import { defineAgent } from "eve";

export default defineAgent({
  // Coaching agent: no sandbox shell/file tools unless we opt back in.
  defaultTools: false,
  model: "openai/gpt-5.6-luna-fast",
});
