"use client";

import { Activity, Clock3 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { CrmEvent } from "@/lib/demo-data";

const toneClass: Record<CrmEvent["tone"], string> = {
  agent: "bg-orange-500",
  crm: "bg-emerald-600",
  outbound: "bg-amber-500",
  calendar: "bg-blue-600",
};

export function LiveTimeline({
  events,
  compact = false,
}: {
  events: CrmEvent[];
  compact?: boolean;
}) {
  return (
    <aside className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="size-4 text-orange-600" />
            <p className="font-semibold text-slate-950">CRM Live Timeline</p>
          </div>
          <p className="mt-1 text-sm text-slate-500">Pipedrive simulé, mis à jour en direct.</p>
        </div>
        <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-800">
          Live
        </Badge>
      </div>

      <ScrollArea className={compact ? "mt-4 h-80 pr-3" : "mt-4 h-[calc(100vh-210px)] pr-3"}>
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span className={`mt-1 size-2.5 rounded-full ${toneClass[event.tone]}`} />
                <span className="h-full w-px bg-slate-200" />
              </div>
              <div className="pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium text-slate-950">{event.label}</p>
                  <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                    <Clock3 className="size-3" />
                    {event.timestamp}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-6 text-slate-600">{event.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
}
