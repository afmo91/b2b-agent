"use client";

import { Award, CalendarCheck, Euro, ShieldAlert } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { SectionCard } from "@/components/shared/section-card";
import { Badge } from "@/components/ui/badge";

export function BusinessCaseCard({ visible }: { visible: boolean }) {
  if (!visible) {
    return null;
  }

  return (
    <SectionCard
      id="business-case"
      eyebrow="Business case généré"
      title="Synthèse de l’opportunité VINCI Energies"
    >
      <div className="rounded-md border border-emerald-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-slate-950 text-white">Score : 91/100</Badge>
              <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-800">
                Priorité : Très haute
              </Badge>
              <Badge variant="outline" className="border-orange-200 bg-orange-50 text-orange-800">
                Contrat cadre multi-sites
              </Badge>
            </div>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">
              Opportunité structurée pour ouvrir un rendez-vous découverte QHSE,
              cadrer un pilote terrain et préparer une extension progressive vers
              350 collaborateurs.
            </p>
          </div>
          <Award className="size-8 text-orange-600" />
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <CaseItem icon={CalendarCheck} label="Pilote recommandé" value="40 collaborateurs" />
          <CaseItem icon={Award} label="Déploiement potentiel" value="350 collaborateurs" />
          <CaseItem icon={CalendarCheck} label="Prochaine action" value="RDV découverte avec Responsable QHSE" />
          <CaseItem icon={Award} label="Commercial recommandé" value="Clara" />
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          <div className="rounded-md border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-3">
              <ShieldAlert className="mt-0.5 size-5 text-amber-700" />
              <div>
                <p className="text-sm font-semibold text-amber-950">Risque principal</p>
                <p className="mt-1 text-sm leading-6 text-amber-900">
                  Référencement fournisseur / validation achats.
                </p>
                <p className="mt-2 text-sm leading-6 text-amber-900">
                  Action recommandée : préparer pilote terrain + proposition personnalisée.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-start gap-3">
              <Euro className="mt-0.5 size-5 text-emerald-700" />
              <div>
                <p className="text-sm font-semibold text-emerald-950">Potentiel financier</p>
                <div className="mt-2 grid gap-2 text-sm text-emerald-950">
                  <span>Pilote : 12 000 € – 18 000 €</span>
                  <span>Déploiement régional : 60 000 € – 110 000 €</span>
                  <span>Contrat cadre multi-sites : 250 000 €+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

function CaseItem({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
      <Icon className="size-4 text-orange-600" />
      <p className="mt-2 text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-950">{value}</p>
    </div>
  );
}
