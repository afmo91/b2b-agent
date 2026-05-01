"use client";

import { Bot, Loader2, MailCheck } from "lucide-react";

import { CopyButton } from "@/components/shared/copy-button";
import { SectionCard } from "@/components/shared/section-card";
import { TemperatureBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { ReplyAnalysis } from "@/lib/ai-schemas";
import type { ProspectReply } from "@/lib/demo-data";

export function ReplyIntelligence({
  replies,
  replyText,
  analysis,
  loading,
  onReplyTextChange,
  onSelectReply,
  onAnalyze,
}: {
  replies: ProspectReply[];
  replyText: string;
  analysis: ReplyAnalysis | null;
  loading: boolean;
  onReplyTextChange: (value: string) => void;
  onSelectReply: (value: string) => void;
  onAnalyze: () => void;
}) {
  return (
    <SectionCard
      id="reply"
      eyebrow="Reply Intelligence"
      title="Analyser les réponses prospects et préparer la suite"
      action={
        <Button onClick={onAnalyze} disabled={loading || replyText.length === 0}>
          {loading ? <Loader2 className="animate-spin" /> : <Bot />}
          Analyser la réponse
        </Button>
      }
    >
      <div className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardContent className="space-y-4 p-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">
                Réponses exemples
              </span>
              <select
                onChange={(event) => onSelectReply(event.target.value)}
                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none ring-orange-200 transition focus:ring-4"
                defaultValue=""
              >
                <option value="" disabled>
                  Choisir une réponse
                </option>
                {replies.map((reply) => (
                  <option key={reply.id} value={reply.body}>
                    {reply.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">
                Réponse prospect
              </span>
              <Textarea
                value={replyText}
                onChange={(event) => onReplyTextChange(event.target.value)}
                rows={8}
                className="resize-none"
              />
            </label>
          </CardContent>
        </Card>

        {analysis ? (
          <div className="space-y-3">
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardContent className="p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <TemperatureBadge value={analysis.temperature} />
                      <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-700">
                        {analysis.recommendedCrmStageChange}
                      </Badge>
                    </div>
                    <p className="mt-3 text-sm font-medium text-slate-950">Intention détectée</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{analysis.intent}</p>
                  </div>
                  <MailCheck className="size-5 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-950">Réponse proposée</p>
                    <p className="mt-1 text-sm text-slate-500">Prête à copier, aucun envoi réel.</p>
                  </div>
                  <CopyButton value={analysis.proposedReply} label="Copier la réponse prospect" />
                </div>
                <pre className="mt-3 whitespace-pre-wrap rounded-md border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-700">
                  {analysis.proposedReply}
                </pre>
              </CardContent>
            </Card>

            <div className="grid gap-3 md:grid-cols-2">
              <Action title="Prochaine action" value={analysis.recommendedNextAction} />
              <Action title="Activité CRM" value={analysis.crmActivityToCreate} />
              <Action title="Relance à programmer" value={analysis.followUpToSchedule} />
              <Action title="Commercial recommandé" value={analysis.recommendedSalesRep} />
            </div>
          </div>
        ) : (
          <Card className="border-dashed border-slate-300 bg-white shadow-sm">
            <CardContent className="flex min-h-80 items-center justify-center p-6 text-center">
              <div>
                <Bot className="mx-auto mb-3 size-8 text-orange-500" />
                <p className="font-medium text-slate-900">Analyse en attente</p>
                <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
                  L’agent classe l’intention, la température et prépare la meilleure action CRM.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </SectionCard>
  );
}

function Action({ title, value }: { title: string; value: string }) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardContent className="p-4">
        <p className="text-sm font-medium text-slate-950">{title}</p>
        <p className="mt-1 text-sm leading-6 text-slate-600">{value}</p>
      </CardContent>
    </Card>
  );
}
