"use client";

import { BriefcaseBusiness, Send, UserCheck } from "lucide-react";

import { PriorityBadge } from "@/components/shared/status-badge";
import { SectionCard } from "@/components/shared/section-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { DemoLead, SalesRep } from "@/lib/demo-data";

export function LeadListBuilder({
  leads,
  salesReps,
  selectedSalesRep,
  onSelectSalesRep,
  onCreateInCrm,
  onPrepareSequence,
  onAssignSalesRep,
}: {
  leads: DemoLead[];
  salesReps: SalesRep[];
  selectedSalesRep: string;
  onSelectSalesRep: (name: string) => void;
  onCreateInCrm: () => void;
  onPrepareSequence: () => void;
  onAssignSalesRep: () => void;
}) {
  return (
    <SectionCard
      id="leads"
      eyebrow="Lead List Builder"
      title="Liste de leads prête pour campagne outbound"
      action={
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" onClick={onCreateInCrm} disabled={leads.length === 0}>
            <BriefcaseBusiness />
            Créer dans CRM Pipeline
          </Button>
          <Button onClick={onPrepareSequence} disabled={leads.length === 0}>
            <Send />
            Préparer séquence outbound
          </Button>
        </div>
      }
    >
      <div className="mb-3 flex flex-col gap-2 rounded-md border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">
          Les contacts sont fictifs et marqués démo. Aucun enrichissement réel ni envoi
          externe n’est déclenché.
        </p>
        <div className="flex gap-2">
          <select
            value={selectedSalesRep}
            onChange={(event) => onSelectSalesRep(event.target.value)}
            className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none ring-orange-200 transition focus:ring-4"
          >
            {salesReps.map((rep) => (
              <option key={rep.name} value={rep.name}>
                {rep.name}
              </option>
            ))}
          </select>
          <Button variant="outline" onClick={onAssignSalesRep} disabled={leads.length === 0}>
            <UserCheck />
            Assigner
          </Button>
        </div>
      </div>

      <div className="rounded-md border border-slate-200 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contact</TableHead>
              <TableHead>Persona</TableHead>
              <TableHead>Compte</TableHead>
              <TableHead>Priorité</TableHead>
              <TableHead>Canal</TableHead>
              <TableHead>Angle</TableHead>
              <TableHead>Statut CRM simulé</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.length > 0 ? (
              leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium text-slate-900">{lead.contact}</TableCell>
                  <TableCell>{lead.persona}</TableCell>
                  <TableCell>{lead.account}</TableCell>
                  <TableCell>
                    <PriorityBadge value={lead.priority} />
                  </TableCell>
                  <TableCell>{lead.recommendedChannel}</TableCell>
                  <TableCell className="max-w-72 whitespace-normal text-slate-600">
                    {lead.angle}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-700">
                      {lead.crmStatus}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-slate-500">
                  Créez la liste depuis le Buying Committee Mapper.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </SectionCard>
  );
}
