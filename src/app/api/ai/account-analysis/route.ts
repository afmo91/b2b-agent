import { NextResponse } from "next/server";

import {
  accountAnalysisInputSchema,
  accountAnalysisOutputSchema,
} from "@/lib/ai-schemas";
import { mockAccountAnalysis } from "@/lib/demo-data";
import { runStructuredAi } from "@/lib/ai-runtime";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = accountAnalysisInputSchema.parse(body);
    const result = await runStructuredAi({
      schema: accountAnalysisOutputSchema,
      schemaName: "urban_circus_account_analysis",
      instructions:
        "Analyse le fit grands comptes pour Urban Circus. Sois précis, orienté cycle commercial complexe et prochaine action CRM simulée.",
      payload: input,
      fallback: mockAccountAnalysis(input.accountName),
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[api/account-analysis]", error);
    return NextResponse.json(
      { error: "Requête invalide pour l’analyse de compte." },
      { status: 400 },
    );
  }
}
