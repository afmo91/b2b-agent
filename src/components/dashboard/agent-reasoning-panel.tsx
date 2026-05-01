"use client";

import { Bot, CheckCircle2, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export type AgentMessage = {
  id: string;
  step: number;
  title: string;
  body: string;
};

export function AgentReasoningPanel({
  messages = [],
  currentStep,
  totalSteps,
}: {
  messages: AgentMessage[];
  currentStep: number | null;
  totalSteps: number;
}) {
  const visibleMessages =
    messages.length > 0
      ? [...messages].reverse()
      : [
          {
            id: "idle",
            step: 0,
            title: "Scénario prêt",
            body: "Lancez la démo guidée pour voir l’agent analyser VINCI Energies, préparer l’outbound, détecter un rendez-vous et alimenter le CRM simulé.",
          },
        ];

  return (
    <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-md bg-slate-950 text-white">
            <Bot className="size-5" />
          </div>
          <div>
            <p className="font-semibold text-slate-950">Agent IA — Raisonnement & actions</p>
            <p className="text-sm text-slate-500">
              Démo commerciale guidée, aucune action externe réelle.
            </p>
          </div>
        </div>
        <Badge variant="outline" className="border-orange-200 bg-orange-50 text-orange-800">
          {currentStep === null ? "Prêt" : `Étape ${currentStep + 1}/${totalSteps}`}
        </Badge>
      </div>

      <ScrollArea className="mt-4 h-72 pr-3">
        <div className="space-y-3">
          {visibleMessages.map((message, index) => (
            <div
              key={message.id}
              className={`rounded-md border p-3 ${
                index === 0 && message.id !== "idle"
                  ? "border-orange-200 bg-orange-50"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2">
                {message.id === "idle" ? (
                  <Sparkles className="size-4 text-orange-600" />
                ) : (
                  <CheckCircle2 className="size-4 text-emerald-600" />
                )}
                <p className="text-sm font-medium text-slate-950">{message.title}</p>
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-600">{message.body}</p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
