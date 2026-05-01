import { NextResponse } from "next/server";

import {
  discoveryBriefInputSchema,
  discoveryBriefOutputSchema,
} from "@/lib/ai-schemas";
import { mockDiscoveryBrief } from "@/lib/demo-data";
import { runStructuredAi } from "@/lib/ai-runtime";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = discoveryBriefInputSchema.parse(body);
    const result = await runStructuredAi({
      schema: discoveryBriefOutputSchema,
      schemaName: "urban_circus_discovery_brief",
      instructions:
        "Prépare un brief de visite découverte pour un commercial Urban Circus. Couvrir volumes, météo, visibilité, sécurité, personnalisation, tailles, sites, budget, calendrier achat, pilote et décisionnaires.",
      payload: input,
      fallback: mockDiscoveryBrief(input.accountName, input.persona),
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[api/discovery-brief]", error);
    return NextResponse.json(
      { error: "Requête invalide pour le brief découverte." },
      { status: 400 },
    );
  }
}
