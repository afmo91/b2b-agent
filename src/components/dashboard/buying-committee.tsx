"use client";

import { UserPlus, UsersRound } from "lucide-react";

import { PriorityBadge } from "@/components/shared/status-badge";
import { SectionCard } from "@/components/shared/section-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { BuyingPersona, DemoLead } from "@/lib/demo-data";

export function BuyingCommittee({
  accountName,
  personas,
  leads,
  onCreateLeads,
}: {
  accountName: string;
  personas: BuyingPersona[];
  leads: DemoLead[];
  onCreateLeads: () => void;
}) {
  return (
    <SectionCard
      id="committee"
      eyebrow="Buying Committee Mapper"
      title={`Mapper les interlocuteurs cibles — ${accountName}`}
      action={
        <Button onClick={onCreateLeads}>
          <UserPlus />
          Créer la liste de leads
        </Button>
      }
    >
      <Alert className="mb-4 border-amber-200 bg-amber-50 text-amber-950">
        <UsersRound className="text-amber-700" />
        <AlertTitle>Contacts fictifs pour démonstration</AlertTitle>
        <AlertDescription>
          Les personas et contacts générés servent uniquement à montrer le workflow commercial.
        </AlertDescription>
      </Alert>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {personas.map((persona) => (
          <Card key={persona.title} className="border-slate-200 bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-950">{persona.title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {persona.roleInDecision}
                  </p>
                </div>
                <PriorityBadge value={persona.priority} />
              </div>
              <div className="mt-4 space-y-3 text-sm">
                <PersonaLine label="Angle commercial" value={persona.angle} />
                <PersonaLine label="Objections probables" value={persona.likelyObjections} />
                <PersonaLine label="Canal recommandé" value={persona.recommendedChannel} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {leads.length > 0 ? (
        <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950">
          {leads.length} contacts fictifs démo créés pour {accountName}. La liste est prête
          pour le CRM Pipeline et la séquence outbound.
        </div>
      ) : null}
    </SectionCard>
  );
}

function PersonaLine({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase text-slate-500">{label}</p>
      <p className="mt-1 leading-6 text-slate-700">{value}</p>
    </div>
  );
}
