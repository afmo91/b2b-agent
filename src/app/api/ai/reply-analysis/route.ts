import { NextResponse } from "next/server";

import {
  replyAnalysisInputSchema,
  replyAnalysisOutputSchema,
} from "@/lib/ai-schemas";
import { mockReplyAnalysis } from "@/lib/demo-data";
import { runStructuredAi } from "@/lib/ai-runtime";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = replyAnalysisInputSchema.parse(body);
    const result = await runStructuredAi({
      schema: replyAnalysisOutputSchema,
      schemaName: "urban_circus_reply_analysis",
      instructions:
        "Analyse la réponse prospect et propose une réponse prête à envoyer, sans envoyer réellement. Adapter la recommandation au pipeline commercial Urban Circus.",
      payload: input,
      fallback: mockReplyAnalysis(input.accountName, input.reply),
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[api/reply-analysis]", error);
    return NextResponse.json(
      { error: "Requête invalide pour l’analyse de réponse." },
      { status: 400 },
    );
  }
}
