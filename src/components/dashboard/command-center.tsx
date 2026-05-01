"use client";

import { motion } from "framer-motion";
import {
  CalendarCheck,
  CheckCircle2,
  MailPlus,
  MonitorUp,
  Play,
  RotateCcw,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

import {
  AgentReasoningPanel,
  type AgentMessage,
} from "@/components/dashboard/agent-reasoning-panel";
import { SectionCard } from "@/components/shared/section-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const metrics = [
  { label: "Comptes grands comptes analysés", value: "24", icon: Target, tone: "text-orange-600" },
  { label: "Contacts cibles recommandés", value: "86", icon: Users, tone: "text-slate-700" },
  { label: "Séquences prêtes", value: "12", icon: MailPlus, tone: "text-amber-600" },
  { label: "Réponses positives détectées", value: "7", icon: TrendingUp, tone: "text-emerald-600" },
  { label: "RDV proposés", value: "4", icon: CalendarCheck, tone: "text-blue-700" },
  { label: "Activités CRM loggées", value: "100%", icon: CheckCircle2, tone: "text-emerald-700" },
];

const businessImpact = [
  { label: "Temps de qualification", value: "15 min → 2 min" },
  { label: "Temps de préparation séquence", value: "-70%" },
  { label: "Activités CRM oubliées", value: "-90%" },
  { label: "Leads relancés", value: "+100%" },
  { label: "RDV potentiels détectés", value: "+25%" },
  { label: "Deals à risque identifiés", value: "8" },
];

const realityColumns = [
  {
    title: "V1 réelle",
    items: [
      "OpenAI connecté",
      "analyse compte",
      "génération séquence",
      "analyse réponse",
      "brief découverte",
      "proposition commerciale",
    ],
  },
  {
    title: "Simulé en V1",
    items: ["CRM Pipeline / Pipedrive", "Outbound Sequence", "Google Calendar"],
  },
  {
    title: "V2 branchable",
    items: [
      "API Pipedrive",
      "API Lemlist",
      "Google Calendar API",
      "webhooks réponses prospects",
      "reporting commercial",
    ],
  },
];

export function CommandCenter({
  aiModeLabel,
  guidedStepLabel,
  onStartGuidedDemo,
  onNextGuidedStep,
  onResetDemo,
  guidedActive,
  guidedLoading,
  guidedProgress,
  guidedStep,
  guidedStepTotal,
  guidedGain,
  agentMessages,
  onLoadFullScenario,
  presentationMode,
  onTogglePresentation,
}: {
  aiModeLabel: string;
  guidedStepLabel: string;
  onStartGuidedDemo: () => void;
  onNextGuidedStep: () => void;
  onResetDemo: () => void;
  guidedActive: boolean;
  guidedLoading: boolean;
  guidedProgress: number;
  guidedStep: number | null;
  guidedStepTotal: number;
  guidedGain: string;
  agentMessages: AgentMessage[];
  onLoadFullScenario: () => void;
  presentationMode: boolean;
  onTogglePresentation: () => void;
}) {
  return (
    <SectionCard
      id="command"
      eyebrow="Command Center"
      title="Urban Circus — Agent IA B2B Grands Comptes"
      action={
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button
            variant={presentationMode ? "default" : "outline"}
            onClick={onTogglePresentation}
            className={presentationMode ? "bg-slate-950 text-white hover:bg-slate-800" : undefined}
          >
            <MonitorUp />
            Mode présentation
          </Button>
          <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-800">
            {aiModeLabel}
          </Badge>
        </div>
      }
    >
      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className={`rounded-md border border-slate-200 bg-white shadow-sm ${presentationMode ? "p-7" : "p-5"}`}>
          <p className="max-w-3xl text-lg font-medium leading-7 text-slate-900">
            De la prospection grands comptes au rendez-vous qualifié : un agent IA pour
            prioriser, personnaliser, relancer et garder Pipedrive à jour.
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            À chaque interaction, l’agent analyse le contexte, recommande la prochaine
            action, prépare le contenu commercial et crée les activités CRM nécessaires.
          </p>
          {!presentationMode ? (
            <div className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-2">
              <div className="rounded-md border border-orange-100 bg-orange-50 p-3">
                L’agent ne remplace pas les commerciaux : il accélère la prospection,
                prépare les actions et maintient le CRM propre.
              </div>
              <div className="rounded-md border border-emerald-100 bg-emerald-50 p-3">
                Pipedrive reste la source de vérité. L’agent IA devient la couche
                intelligente qui enrichit, priorise, relance et maintient le CRM à jour.
              </div>
            </div>
          ) : null}
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Button onClick={onStartGuidedDemo} size="lg" className="bg-slate-950 text-white hover:bg-slate-800">
              <Play />
              Lancer la démo guidée avec VINCI Energies
            </Button>
            <Button variant="outline" size="lg" onClick={onLoadFullScenario}>
              Charger scénario complet VINCI Energies
            </Button>
            <Button variant="ghost" size="lg" onClick={onResetDemo}>
              <RotateCcw />
              Reset démo
            </Button>
            {guidedActive ? (
              <Button
                variant="outline"
                size="lg"
                onClick={onNextGuidedStep}
                disabled={guidedLoading}
              >
                {guidedLoading ? "Étape en cours..." : "Étape suivante"}
              </Button>
            ) : null}
          </div>
          {guidedActive ? (
            <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium text-slate-900">
                  Étape {(guidedStep ?? 0) + 1}/{guidedStepTotal} — {guidedStepLabel}
                </span>
                <span className="text-slate-500">Démo guidée</span>
              </div>
              <Progress value={guidedProgress} className="mt-3" />
              <div className="mt-3 rounded-md border border-emerald-200 bg-white px-3 py-2 text-sm text-emerald-900">
                <span className="font-medium">Ce que l’équipe gagne à cette étape : </span>
                {guidedGain}
              </div>
            </div>
          ) : null}
        </div>

        <div className="grid gap-4">
          <div className="rounded-md border border-slate-200 bg-slate-950 p-5 text-white shadow-sm">
            <p className="text-sm font-medium text-amber-200">Démo V1</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              OpenAI connecté, intégrations CRM / outbound / calendrier simulées. APIs
              réelles branchables en V2.
            </p>
            {!presentationMode ? (
              <div className="mt-5 grid grid-cols-2 gap-2 text-sm">
                {["CRM Pipeline", "Outbound Sequence", "Calendrier commercial", "Agent IA"].map(
                  (item) => (
                    <div key={item} className="rounded-md border border-white/10 bg-white/5 px-3 py-2">
                      {item}
                    </div>
                  ),
                )}
              </div>
            ) : null}
          </div>

          <div className="rounded-md border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
            <p className="text-sm font-semibold text-emerald-950">Impact business estimé</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {businessImpact.map((item) => (
                <div key={item.label} className="rounded-md border border-emerald-100 bg-white p-3">
                  <p className="text-lg font-semibold text-emerald-950">{item.value}</p>
                  <p className="mt-1 text-xs text-emerald-800">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={`mt-4 grid gap-3 sm:grid-cols-2 ${presentationMode ? "xl:grid-cols-2" : "xl:grid-cols-3"}`}>
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              <Card className="border-slate-200 bg-white shadow-sm">
                <CardContent className={`flex items-center justify-between gap-4 ${presentationMode ? "p-6" : "p-4"}`}>
                  <div>
                    <p className={`${presentationMode ? "text-4xl" : "text-2xl"} font-semibold text-slate-950`}>
                      {metric.value}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">{metric.label}</p>
                  </div>
                  <Icon className={metric.tone} />
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-950">Ce que montre cette démo</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Cette démo montre comment un agent IA peut s’intégrer au workflow commercial
            existant d’Urban Circus : prospection grands comptes, qualification, séquences
            outbound, prise de RDV, suivi CRM, préparation des visites et proposition
            commerciale.
          </p>
        </div>

        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-950">
            Ce qui est réel aujourd’hui vs. ce qui sera branché ensuite
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {realityColumns.map((column) => (
              <div key={column.title} className="rounded-md border border-slate-200 bg-slate-50 p-3">
                <p className="text-sm font-semibold text-slate-950">{column.title}</p>
                <ul className="mt-2 space-y-1.5 text-sm leading-5 text-slate-600">
                  {column.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-orange-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <AgentReasoningPanel
          messages={agentMessages}
          currentStep={guidedStep}
          totalSteps={guidedStepTotal}
        />
      </div>
    </SectionCard>
  );
}
