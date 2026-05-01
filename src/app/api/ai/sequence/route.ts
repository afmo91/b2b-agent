import { NextResponse } from "next/server";

import { sequenceInputSchema, sequenceOutputSchema } from "@/lib/ai-schemas";
import { mockSequence } from "@/lib/demo-data";
import { runStructuredAi } from "@/lib/ai-runtime";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = sequenceInputSchema.parse(body);
    const result = await runStructuredAi({
      schema: sequenceOutputSchema,
      schemaName: "urban_circus_outbound_sequence",
      instructions:
        "Génère une séquence multicanale type outbound tool, sans envoyer de message réel. 5 à 6 étapes, concrètes, adaptées aux grands comptes infrastructure.",
      payload: input,
      fallback: mockSequence(input.accountName, input.persona, input.objective, input.tone),
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[api/sequence]", error);
    return NextResponse.json(
      { error: "Requête invalide pour la génération de séquence." },
      { status: 400 },
    );
  }
}
