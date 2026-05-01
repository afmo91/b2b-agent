"use client";

import { ArrowRight, CheckCircle2, XCircle } from "lucide-react";

import { SectionCard } from "@/components/shared/section-card";

const before = [
  "Recherche manuelle",
  "Relances oubliées",
  "CRM incomplet",
  "Séquences peu personnalisées",
  "Transmission commercial → expert terrain variable",
];

const after = [
  "Comptes scorés",
  "Personas recommandés",
  "Séquences personnalisées",
  "Réponses analysées",
  "RDV proposés",
  "Pipedrive alimenté automatiquement",
  "Briefs et propositions structurés",
];

export function BeforeAfterSection({ presentationMode }: { presentationMode: boolean }) {
  return (
    <SectionCard
      id="avant-apres"
      eyebrow="Avant / Après"
      title="Ce que la démo rend immédiatement visible"
      className={presentationMode ? "xl:scale-[1.01]" : undefined}
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
        <div className="rounded-md border border-red-100 bg-white p-4 shadow-sm">
          <p className="font-semibold text-slate-950">Avant</p>
          <ul className="mt-4 space-y-3">
            {before.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-slate-700">
                <XCircle className="mt-0.5 size-4 shrink-0 text-red-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden items-center justify-center lg:flex">
          <div className="flex size-12 items-center justify-center rounded-md bg-slate-950 text-white">
            <ArrowRight className="size-5" />
          </div>
        </div>

        <div className="rounded-md border border-emerald-100 bg-emerald-50 p-4 shadow-sm">
          <p className="font-semibold text-emerald-950">Après</p>
          <ul className="mt-4 space-y-3">
            {after.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-emerald-950">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SectionCard>
  );
}
