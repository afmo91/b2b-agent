"use client";

import { motion } from "framer-motion";
import {
  CalendarCheck,
  CheckCircle2,
  MailPlus,
  Play,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

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

export function CommandCenter({
  aiModeLabel,
  guidedStepLabel,
  onStartGuidedDemo,
  onNextGuidedStep,
  guidedActive,
  guidedLoading,
  guidedProgress,
}: {
  aiModeLabel: string;
  guidedStepLabel: string;
  onStartGuidedDemo: () => void;
  onNextGuidedStep: () => void;
  guidedActive: boolean;
  guidedLoading: boolean;
  guidedProgress: number;
}) {
  return (
    <SectionCard
      id="command"
      eyebrow="Command Center"
      title="Urban Circus — Agent IA B2B Grands Comptes"
      action={
        <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-800">
          {aiModeLabel}
        </Badge>
      }
    >
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <p className="max-w-3xl text-lg font-medium leading-7 text-slate-900">
            De la prospection grands comptes au rendez-vous qualifié : un agent IA pour
            prioriser, personnaliser, relancer et garder Pipedrive à jour.
          </p>
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
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Button onClick={onStartGuidedDemo} size="lg" className="bg-slate-950 text-white hover:bg-slate-800">
              <Play />
              Lancer la démo guidée avec VINCI Energies
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
                <span className="font-medium text-slate-900">{guidedStepLabel}</span>
                <span className="text-slate-500">Démo guidée</span>
              </div>
              <Progress value={guidedProgress} className="mt-3" />
            </div>
          ) : null}
        </div>

        <div className="rounded-md border border-slate-200 bg-slate-950 p-5 text-white shadow-sm">
          <p className="text-sm font-medium text-amber-200">Démo V1</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            OpenAI connecté, intégrations CRM / outbound / calendrier simulées. APIs
            réelles branchables en V2.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-2 text-sm">
            {["CRM Pipeline", "Outbound Sequence", "Calendrier commercial", "Agent IA"].map(
              (item) => (
                <div key={item} className="rounded-md border border-white/10 bg-white/5 px-3 py-2">
                  {item}
                </div>
              ),
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
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
                <CardContent className="flex items-center justify-between gap-4 p-4">
                  <div>
                    <p className="text-2xl font-semibold text-slate-950">{metric.value}</p>
                    <p className="mt-1 text-sm text-slate-600">{metric.label}</p>
                  </div>
                  <Icon className={metric.tone} />
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </SectionCard>
  );
}
