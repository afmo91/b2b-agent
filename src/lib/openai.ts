import OpenAI from "openai";

export const openAIModel = process.env.OPENAI_MODEL || "gpt-4.1-mini";

export const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

export const hasOpenAIKey = Boolean(process.env.OPENAI_API_KEY);
