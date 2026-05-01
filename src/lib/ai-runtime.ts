import { zodTextFormat } from "openai/helpers/zod";
import type { z } from "zod";

import type { AiMode } from "@/lib/ai-schemas";
import { openai, openAIModel } from "@/lib/openai";

const systemPrompt = [
  "Tu es l’agent IA B2B grands comptes Urban Circus.",
  "Toutes les réponses doivent être en français, professionnelles, concrètes et actionnables.",
  "Ne jamais inventer de vrais contacts privés : utiliser uniquement des personas ou des contacts fictifs explicitement marqués démo.",
  "Adapter les recommandations aux vêtements techniques personnalisés Urban Circus : sécurité, visibilité, confort terrain, météo, personnalisation, adoption, contrats cadres.",
  "Ne pas faire de promesses techniques irréalistes.",
  "Ne pas envoyer de vrais messages, ne pas scraper, ne pas appeler de vraie API Pipedrive, outbound ou calendrier.",
  "Pipedrive, l’outbound tool et le calendrier sont simulés visuellement en V1, branchables en V2.",
  "Retourner strictement l’objet JSON conforme au schéma demandé.",
].join("\n");

export async function runStructuredAi<TSchema extends z.ZodType>({
  schema,
  schemaName,
  instructions,
  payload,
  fallback,
}: {
  schema: TSchema;
  schemaName: string;
  instructions: string;
  payload: unknown;
  fallback: z.infer<TSchema>;
}): Promise<{ data: z.infer<TSchema>; mode: AiMode; warning?: string }> {
  if (!openai) {
    return { data: fallback, mode: "mock" };
  }

  try {
    const response = await openai.responses.parse({
      model: openAIModel,
      instructions: `${systemPrompt}\n\n${instructions}`,
      input: JSON.stringify(payload, null, 2),
      text: {
        format: zodTextFormat(schema, schemaName),
      },
    });

    const parsed = response.output_parsed;

    if (!parsed) {
      throw new Error("Réponse OpenAI vide ou non structurée.");
    }

    return { data: schema.parse(parsed), mode: "openai" };
  } catch (error) {
    console.error(`[ai:${schemaName}] fallback mock`, error);
    return {
      data: fallback,
      mode: "mock",
      warning: "OpenAI indisponible pour cette génération, fallback démo local utilisé.",
    };
  }
}
