// Server only. OPENROUTER_API_KEY must never reach the browser.
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

const openrouter = createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY });

export const model = openrouter(
  process.env.OPENROUTER_MODEL ?? "meta-llama/llama-3.3-70b-instruct:free",
);
