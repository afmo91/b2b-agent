"use client";

import { CalendarPlus, CheckCircle2, Clock } from "lucide-react";

import { SectionCard } from "@/components/shared/section-card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { SalesRep } from "@/lib/demo-data";

export function MeetingBooker({
  salesReps,
  slots,
  selectedRep,
  selectedSlot,
  meetingCreated,
  briefGenerated,
  onSelectRep,
  onSelectSlot,
  onCreateMeeting,
}: {
  salesReps: SalesRep[];
  slots: string[];
  selectedRep: string;
  selectedSlot: string;
  meetingCreated: boolean;
  briefGenerated: boolean;
  onSelectRep: (name: string) => void;
  onSelectSlot: (slot: string) => void;
  onCreateMeeting: () => void;
}) {
  return (
    <SectionCard
      id="meeting"
      eyebrow="Meeting Booker"
      title="Proposer un rendez-vous dans le calendrier commercial"
      action={
        <Button onClick={onCreateMeeting}>
          <CalendarPlus />
          Créer RDV Google Calendar
        </Button>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="grid gap-3">
          {salesReps.map((rep) => (
            <button
              key={rep.name}
              type="button"
              onClick={() => onSelectRep(rep.name)}
              className={`rounded-md border bg-white p-4 text-left shadow-sm transition ${
                selectedRep === rep.name
                  ? "border-orange-300 ring-4 ring-orange-100"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <Avatar className="size-10">
                  <AvatarFallback className="bg-slate-950 text-white">
                    {rep.name.slice(0, 1)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-slate-950">{rep.name}</p>
                  <p className="text-sm text-slate-600">{rep.focus}</p>
                </div>
              </div>
              <Badge variant="outline" className="mt-3 border-emerald-200 bg-emerald-50 text-emerald-800">
                Disponible {rep.availability}
              </Badge>
            </button>
          ))}
        </div>

        <Card className="border-slate-200 bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-500">Calendrier commercial simulé</p>
                <p className="mt-1 text-lg font-semibold text-slate-950">
                  {selectedRep} — RDV découverte
                </p>
              </div>
              <Clock className="text-orange-600" />
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {slots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => onSelectSlot(slot)}
                  className={`rounded-md border px-3 py-4 text-left text-sm font-medium transition ${
                    selectedSlot === slot
                      ? "border-emerald-300 bg-emerald-50 text-emerald-950"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>

            {meetingCreated ? (
              <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950 shadow-sm">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-700" />
                  <div className="space-y-2">
                    <p className="text-base font-semibold">
                      RDV créé — {selectedRep} — {selectedSlot}
                    </p>
                    <p>Invitation envoyée au prospect — simulation</p>
                    <p>Activité ajoutée au CRM — simulation</p>
                    <p>
                      {briefGenerated
                        ? "Brief découverte généré automatiquement"
                        : "Brief découverte prêt à générer à l’étape suivante"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm leading-6 text-slate-600">
                Les créneaux sont simulés. Aucune API calendrier réelle n’est appelée en V1.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </SectionCard>
  );
}
