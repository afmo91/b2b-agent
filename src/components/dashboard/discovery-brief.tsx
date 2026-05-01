"use client";

import { ClipboardCheck, Loader2 } from "lucide-react";

import { CopyButton } from "@/components/shared/copy-button";
import { SectionCard } from "@/components/shared/section-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { DiscoveryBrief } from "@/lib/ai-schemas";

export function DiscoveryBriefSection({
  accountName,
  persona,
  context,
  notes,
  brief,
  loading,
  onPersonaChange,
  onContextChange,
  onNotesChange,
  onGenerate,
}: {
  accountName: string;
  persona: string;
  context: string;
  notes: string;
  brief: DiscoveryBrief | null;
  loading: boolean;
  onPersonaChange: (value: string) => void;
  onContextChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onGenerate: () => void;
}) {
  const briefText = brief
    ? [
        brief.meetingObjective,
        ...brief.questionsToAsk,
        ...brief.informationToCapture,
        ...brief.risksToCheck,
        ...brief.buyingSignalsToDetect,
        ...brief.nextActions,
      ].join("\n")
    : "";

  return (
    <SectionCard
      id="discovery"
      eyebrow="Discovery Brief"
      title="Brief visite découverte"
      action={
        <Button onClick={onGenerate} disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : <ClipboardCheck />}
          Générer brief découverte
        </Button>
      }
    >
      <div className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardContent className="space-y-4 p-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Compte</span>
              <Input value={accountName} readOnly />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Persona</span>
              <Input value={persona} onChange={(event) => onPersonaChange(event.target.value)} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Contexte</span>
              <Textarea
                value={context}
                onChange={(event) => onContextChange(event.target.value)}
                rows={4}
                className="resize-none"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Notes éventuelles</span>
              <Textarea
                value={notes}
                onChange={(event) => onNotesChange(event.target.value)}
                rows={4}
                className="resize-none"
              />
            </label>
          </CardContent>
        </Card>

        {brief ? (
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-slate-950">Brief généré</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {brief.meetingObjective}
                  </p>
                </div>
                <CopyButton value={briefText} label="Copier le brief découverte" />
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <BriefList title="Questions à poser" items={brief.questionsToAsk} />
                <BriefList title="Informations à capturer" items={brief.informationToCapture} />
                <BriefList title="Risques à vérifier" items={brief.risksToCheck} />
                <BriefList title="Signaux d’achat" items={brief.buyingSignalsToDetect} />
                <BriefList title="Prochaines actions" items={brief.nextActions} />
                <BriefList title="À transmettre à l’expert terrain" items={brief.handoffToFieldExpert} />
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-dashed border-slate-300 bg-white shadow-sm">
            <CardContent className="flex min-h-80 items-center justify-center p-6 text-center">
              <div>
                <ClipboardCheck className="mx-auto mb-3 size-8 text-orange-500" />
                <p className="font-medium text-slate-900">Brief en attente</p>
                <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
                  Le brief prépare questions, risques, signaux d’achat et passage à la visite terrain.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </SectionCard>
  );
}

function BriefList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
      <p className="text-sm font-medium text-slate-950">{title}</p>
      <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-600">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-orange-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
