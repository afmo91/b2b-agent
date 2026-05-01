"use client";

import { FilePenLine, Loader2 } from "lucide-react";

import { CopyButton } from "@/components/shared/copy-button";
import { SectionCard } from "@/components/shared/section-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { Proposal } from "@/lib/ai-schemas";

export function ProposalAssistant({
  accountName,
  notes,
  proposal,
  loading,
  onNotesChange,
  onGenerate,
}: {
  accountName: string;
  notes: string;
  proposal: Proposal | null;
  loading: boolean;
  onNotesChange: (value: string) => void;
  onGenerate: () => void;
}) {
  const proposalText = proposal
    ? [
        proposal.needSummary,
        proposal.recommendedOffer,
        proposal.pilotProposal,
        ...proposal.rolloutPlan,
        ...proposal.commercialArguments,
        ...proposal.risksAndObjections,
        proposal.proposalEmail,
        ...proposal.followUpPlan,
      ].join("\n")
    : "";

  return (
    <SectionCard
      id="proposal"
      eyebrow="Proposal Assistant"
      title="Préparer la proposition commerciale"
      action={
        <Button onClick={onGenerate} disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : <FilePenLine />}
          Préparer proposition avec l’agent IA
        </Button>
      }
    >
      <div className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardContent className="p-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">
                Input proposition — {accountName}
              </span>
              <Textarea
                value={notes}
                onChange={(event) => onNotesChange(event.target.value)}
                rows={10}
                className="resize-none"
              />
            </label>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Pilote 40 collaborateurs", "Extension 350 collaborateurs", "Logo client", "Contrat cadre"].map(
                (item) => (
                  <Badge key={item} variant="outline" className="border-orange-200 bg-orange-50 text-orange-800">
                    {item}
                  </Badge>
                ),
              )}
            </div>
          </CardContent>
        </Card>

        {proposal ? (
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-slate-950">Proposition générée</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {proposal.needSummary}
                  </p>
                </div>
                <CopyButton value={proposalText} label="Copier la proposition" />
              </div>

              <div className="mt-4 space-y-3">
                <Block title="Offre recommandée" value={proposal.recommendedOffer} />
                <Block title="Proposition pilote" value={proposal.pilotProposal} />
                <ListBlock title="Plan de déploiement" items={proposal.rolloutPlan} />
                <ListBlock title="Arguments commerciaux" items={proposal.commercialArguments} />
                <ListBlock title="Risques / objections" items={proposal.risksAndObjections} />
                <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium text-slate-950">Email d’envoi de proposition</p>
                    <CopyButton value={proposal.proposalEmail} label="Copier l’email de proposition" />
                  </div>
                  <pre className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                    {proposal.proposalEmail}
                  </pre>
                </div>
                <ListBlock title="Plan de relance" items={proposal.followUpPlan} />
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-dashed border-slate-300 bg-white shadow-sm">
            <CardContent className="flex min-h-80 items-center justify-center p-6 text-center">
              <div>
                <FilePenLine className="mx-auto mb-3 size-8 text-orange-500" />
                <p className="font-medium text-slate-900">Proposition en attente</p>
                <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
                  L’agent prépare l’offre, le pilote, le plan de déploiement et les relances.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </SectionCard>
  );
}

function Block({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
      <p className="text-sm font-medium text-slate-950">{title}</p>
      <p className="mt-1 text-sm leading-6 text-slate-600">{value}</p>
    </div>
  );
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
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
