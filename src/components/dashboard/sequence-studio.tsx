"use client";

import { Loader2, SendHorizonal, WandSparkles } from "lucide-react";
import type { ReactNode } from "react";

import { CopyButton } from "@/components/shared/copy-button";
import { SectionCard } from "@/components/shared/section-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Sequence } from "@/lib/ai-schemas";

const objectives = [
  "obtenir rendez-vous découverte",
  "qualifier besoin",
  "proposer pilote terrain",
];

const tones = ["direct", "premium", "consultatif", "très court"];

export function SequenceStudio({
  accountName,
  persona,
  objective,
  tone,
  sequence,
  loading,
  onPersonaChange,
  onObjectiveChange,
  onToneChange,
  onGenerate,
  onSimulateSend,
}: {
  accountName: string;
  persona: string;
  objective: string;
  tone: string;
  sequence: Sequence | null;
  loading: boolean;
  onPersonaChange: (persona: string) => void;
  onObjectiveChange: (objective: string) => void;
  onToneChange: (tone: string) => void;
  onGenerate: () => void;
  onSimulateSend: () => void;
}) {
  return (
    <SectionCard
      id="sequence"
      eyebrow="Sequence Studio"
      title="Préparer une séquence multicanale type outbound"
      action={
        <Button onClick={onGenerate} disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : <WandSparkles />}
          Générer la séquence avec l’agent IA
        </Button>
      }
    >
      <div className="grid gap-4 xl:grid-cols-[0.75fr_1.25fr]">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardContent className="space-y-4 p-4">
            <Field label="Compte">
              <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-900">
                {accountName}
              </div>
            </Field>
            <Field label="Persona">
              <select
                value={persona}
                onChange={(event) => onPersonaChange(event.target.value)}
                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none ring-orange-200 transition focus:ring-4"
              >
                {["Responsable QHSE", "Responsable Achats", "Responsable RH"].map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Objectif">
              <select
                value={objective}
                onChange={(event) => onObjectiveChange(event.target.value)}
                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none ring-orange-200 transition focus:ring-4"
              >
                {objectives.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Ton">
              <select
                value={tone}
                onChange={(event) => onToneChange(event.target.value)}
                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none ring-orange-200 transition focus:ring-4"
              >
                {tones.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </Field>
            <div className="grid gap-2 sm:grid-cols-3 xl:grid-cols-1">
              <Button variant="outline" onClick={() => onPersonaChange("Responsable QHSE")}>
                Adapter pour QHSE
              </Button>
              <Button variant="outline" onClick={() => onPersonaChange("Responsable Achats")}>
                Adapter pour Achats
              </Button>
              <Button variant="outline" onClick={() => onPersonaChange("Responsable RH")}>
                Adapter pour RH
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {sequence ? (
            <>
              <Card className="border-slate-200 bg-white shadow-sm">
                <CardContent className="p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-950">
                        {sequence.sequenceName}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {sequence.strategicSummary}
                      </p>
                    </div>
                    <Button variant="outline" onClick={onSimulateSend}>
                      <SendHorizonal />
                      Simuler envoi vers outbound tool
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                {sequence.steps.map((step) => (
                  <Card key={`${step.day}-${step.channel}`} className="border-slate-200 bg-white shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge className="bg-slate-950 text-white">{step.day}</Badge>
                            <Badge variant="outline" className="border-orange-200 bg-orange-50 text-orange-800">
                              {step.channel}
                            </Badge>
                            <span className="text-sm font-medium text-slate-900">
                              {step.objective}
                            </span>
                          </div>
                          {step.subject ? (
                            <p className="mt-3 text-sm font-medium text-slate-950">
                              Objet : {step.subject}
                            </p>
                          ) : null}
                        </div>
                        <CopyButton value={step.message} label="Copier le message" />
                      </div>
                      <pre className="mt-3 whitespace-pre-wrap rounded-md border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-700">
                        {step.message}
                      </pre>
                      <p className="mt-3 text-sm leading-6 text-slate-500">
                        {step.commercialLogic}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <Card className="border-dashed border-slate-300 bg-white shadow-sm">
              <CardContent className="flex min-h-80 items-center justify-center p-6 text-center">
                <div>
                  <WandSparkles className="mx-auto mb-3 size-8 text-orange-500" />
                  <p className="font-medium text-slate-900">
                    Prêt à générer une séquence QHSE personnalisée pour VINCI Energies
                  </p>
                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
                    Email, LinkedIn, appel, relance et proposition de pilote terrain :
                    l’agent prépare le contenu et la logique commerciale pour chaque étape.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </SectionCard>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}
