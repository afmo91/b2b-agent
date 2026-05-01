import { NextResponse } from "next/server";

import { proposalInputSchema, proposalOutputSchema } from "@/lib/ai-schemas";
import { mockProposal } from "@/lib/demo-data";
import { runStructuredAi } from "@/lib/ai-runtime";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = proposalInputSchema.parse(body);
    const result = await runStructuredAi({
      schema: proposalOutputSchema,
      schemaName: "urban_circus_proposal",
      instructions:
        "Prépare une proposition commerciale Urban Circus. Inclure pilote 40 collaborateurs, extension 350 collaborateurs, visibilité, sécurité, confort thermique, logo, contrat cadre et déploiement multi-sites.",
      payload: input,
      fallback: mockProposal(input.accountName),
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[api/proposal]", error);
    return NextResponse.json(
      { error: "Requête invalide pour la proposition commerciale." },
      { status: 400 },
    );
  }
}
