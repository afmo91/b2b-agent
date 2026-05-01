"use client";

import { Brain, Loader2, RefreshCw, Shield, ThermometerSun } from "lucide-react";

import { PriorityBadge } from "@/components/shared/status-badge";
import { SectionCard } from "@/components/shared/section-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { AccountAnalysis } from "@/lib/ai-schemas";
import type { DemoAccount } from "@/lib/demo-data";

export function AccountIntelligence({
  accounts,
  selectedAccount,
  selectedAccountName,
  analysis,
  loading,
  onSelectAccount,
  onAnalyze,
}: {
  accounts: DemoAccount[];
  selectedAccount: DemoAccount;
  selectedAccountName: string;
  analysis: AccountAnalysis | null;
  loading: boolean;
  onSelectAccount: (accountName: string) => void;
  onAnalyze: () => void;
}) {
  return (
    <SectionCard
      id="account"
      eyebrow="Account Intelligence"
      title="Identifier et prioriser les comptes à potentiel"
      action={
        <Button onClick={onAnalyze} disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : <Brain />}
          Analyser avec l’agent IA
        </Button>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardContent className="space-y-4 p-4">
            <label className="text-sm font-medium text-slate-700" htmlFor="account-select">
              Compte cible
            </label>
            <select
              id="account-select"
              value={selectedAccountName}
              onChange={(event) => onSelectAccount(event.target.value)}
              className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none ring-orange-200 transition focus:ring-4"
            >
              {accounts.map((account) => (
                <option key={account.name} value={account.name}>
                  {account.name}
                </option>
              ))}
            </select>

            <div className="space-y-3 text-sm">
              <Info label="Secteur" value={selectedAccount.sector} />
              <Info label="Taille estimée" value={selectedAccount.estimatedSize} />
              <Info label="Équipes terrain" value={selectedAccount.fieldTeams} />
              <Info label="Besoin probable" value={selectedAccount.probableNeed} />
              <Info label="Potentiel" value={selectedAccount.potential} />
            </div>

            <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              {selectedAccount.signal}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {analysis ? (
            <>
              <Card className="border-slate-200 bg-white shadow-sm">
                <CardContent className="p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-2xl font-semibold text-slate-950">
                          {selectedAccountName} — Score {analysis.score}/100
                        </h3>
                        <PriorityBadge value={analysis.priority} />
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {analysis.probableNeed}
                      </p>
                    </div>
                    <div className="min-w-40">
                      <Progress value={analysis.score} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-3 md:grid-cols-2">
                <Insight icon={Shield} title="Fit Urban Circus" body={analysis.commercialPotential} />
                <Insight icon={ThermometerSun} title="Angle recommandé" body={analysis.recommendedAngle} />
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <ListCard title="Équipes concernées" items={analysis.teamsConcerned} />
                <ListCard title="Décideurs probables" items={analysis.likelyDecisionMakers} />
                <ListCard title="Objections probables" items={analysis.likelyObjections} />
              </div>

              <Card className="border-emerald-200 bg-emerald-50 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <RefreshCw className="mt-0.5 size-4 text-emerald-700" />
                    <div>
                      <p className="font-medium text-emerald-950">Prochaine meilleure action</p>
                      <p className="mt-1 text-sm leading-6 text-emerald-900">
                        {analysis.nextBestAction}
                      </p>
                      <Badge variant="outline" className="mt-3 border-emerald-300 bg-white text-emerald-800">
                        {analysis.suggestedCrmActivity}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="border-dashed border-slate-300 bg-white shadow-sm">
              <CardContent className="flex min-h-72 items-center justify-center p-6 text-center">
                <div>
                  <Brain className="mx-auto mb-3 size-8 text-orange-500" />
                  <p className="font-medium text-slate-900">Analyse prête</p>
                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
                    Sélectionnez un grand compte puis lancez l’analyse pour obtenir score,
                    angles, objections et activité CRM suggérée.
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

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase text-slate-500">{label}</p>
      <p className="mt-1 leading-6 text-slate-800">{value}</p>
    </div>
  );
}

function Insight({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Shield;
  title: string;
  body: string;
}) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Icon className="mt-1 size-4 text-orange-600" />
          <div>
            <p className="font-medium text-slate-950">{title}</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">{body}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ListCard({ title, items }: { title: string; items: string[] }) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardContent className="p-4">
        <p className="font-medium text-slate-950">{title}</p>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          {items.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-orange-500" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
