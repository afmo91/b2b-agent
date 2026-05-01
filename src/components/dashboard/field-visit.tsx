"use client";

import { MapPinned, WandSparkles } from "lucide-react";

import { SectionCard } from "@/components/shared/section-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const checklist = [
  "conditions terrain",
  "contraintes météo",
  "visibilité jour/nuit",
  "contraintes de mouvement",
  "besoins de poches / matériaux / résistance",
  "image de marque",
  "personnalisation logo",
  "contraintes lavage / durabilité",
  "tailles et morphologies",
  "contraintes sécurité / QHSE",
];

export type StructuredFieldNotes = {
  summary: string;
  technicalConstraints: string[];
  recommendedProducts: string[];
  risks: string[];
  proposalInputs: string[];
};

export function FieldVisitAssistant({
  notes,
  structuredNotes,
  onNotesChange,
  onStructureNotes,
}: {
  notes: string;
  structuredNotes: StructuredFieldNotes | null;
  onNotesChange: (value: string) => void;
  onStructureNotes: () => void;
}) {
  return (
    <SectionCard
      id="field"
      eyebrow="Field Visit Assistant"
      title="Visite terrain expert"
      action={
        <Button onClick={onStructureNotes}>
          <WandSparkles />
          Structurer les notes terrain
        </Button>
      }
    >
      <div className="grid gap-4 xl:grid-cols-[0.75fr_1.25fr]">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MapPinned className="size-4 text-orange-600" />
              <p className="font-medium text-slate-950">Checklist expert terrain</p>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
              {checklist.map((item) => (
                <label
                  key={item}
                  className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
                >
                  <input type="checkbox" className="size-4 accent-orange-600" defaultChecked={item.includes("météo") || item.includes("visibilité")} />
                  {item}
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="p-4">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">
                  Notes terrain
                </span>
                <Textarea
                  value={notes}
                  onChange={(event) => onNotesChange(event.target.value)}
                  rows={8}
                  className="resize-none"
                />
              </label>
            </CardContent>
          </Card>

          {structuredNotes ? (
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardContent className="p-4">
                <p className="font-medium text-slate-950">Notes structurées</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{structuredNotes.summary}</p>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <StructuredList title="Contraintes techniques" items={structuredNotes.technicalConstraints} />
                  <StructuredList title="Produits recommandés" items={structuredNotes.recommendedProducts} />
                  <StructuredList title="Risques" items={structuredNotes.risks} />
                  <StructuredList title="Éléments pour proposition" items={structuredNotes.proposalInputs} />
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </SectionCard>
  );
}

function StructuredList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
      <p className="text-sm font-medium text-slate-950">{title}</p>
      <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-600">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-emerald-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
