"use client";

import { Check, Circle, DatabaseZap } from "lucide-react";

import { SectionCard } from "@/components/shared/section-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { CrmEvent } from "@/lib/demo-data";

const toneClass: Record<CrmEvent["tone"], string> = {
  agent: "bg-orange-500",
  crm: "bg-emerald-600",
  outbound: "bg-amber-500",
  calendar: "bg-blue-600",
};

export function CrmPanel({
  timeline,
  stages,
  activeStage,
}: {
  timeline: CrmEvent[];
  stages: string[];
  activeStage: string;
}) {
  const activeIndex = Math.max(0, stages.indexOf(activeStage));

  return (
    <SectionCard
      id="crm"
      eyebrow="CRM Pipeline / Timeline simulée"
      title="Pipedrive simulé : source de vérité et journal d’actions"
      action={
        <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-800">
          Étape active : {activeStage}
        </Badge>
      }
    >
      <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DatabaseZap className="size-4 text-orange-600" />
              <p className="font-medium text-slate-950">Mini pipeline</p>
            </div>
            <div className="mt-4 grid gap-2 md:grid-cols-3">
              {stages.map((stage, index) => {
                const done = index < activeIndex;
                const active = index === activeIndex;
                return (
                  <div
                    key={stage}
                    className={`rounded-md border p-3 text-sm ${
                      active
                        ? "border-orange-300 bg-orange-50 text-orange-950"
                        : done
                          ? "border-emerald-200 bg-emerald-50 text-emerald-950"
                          : "border-slate-200 bg-slate-50 text-slate-600"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {done ? (
                        <Check className="size-4 text-emerald-700" />
                      ) : (
                        <Circle className={`size-4 ${active ? "text-orange-700" : "text-slate-400"}`} />
                      )}
                      <span className="font-medium">{stage}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <CardContent className="p-4">
            <p className="font-medium text-slate-950">Timeline CRM persistante</p>
            <Separator className="my-3" />
            <ScrollArea className="h-96 pr-3">
              <div className="space-y-4">
                {timeline.map((event) => (
                  <div key={event.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span className={`mt-1 size-2.5 rounded-full ${toneClass[event.tone]}`} />
                      <span className="h-full w-px bg-slate-200" />
                    </div>
                    <div className="pb-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium text-slate-950">{event.label}</p>
                        <span className="text-xs text-slate-500">{event.timestamp}</span>
                      </div>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{event.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </SectionCard>
  );
}
