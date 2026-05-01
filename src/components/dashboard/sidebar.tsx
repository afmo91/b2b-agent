"use client";

import {
  Bot,
  CalendarCheck,
  ClipboardList,
  FileText,
  ListChecks,
  MailCheck,
  Map,
  Menu,
  Radar,
  Route,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navItems = [
  { id: "command", label: "Command Center", icon: Radar },
  { id: "account", label: "Account Intelligence", icon: Sparkles },
  { id: "committee", label: "Buying Committee", icon: Users },
  { id: "leads", label: "Lead List", icon: ListChecks },
  { id: "sequence", label: "Sequence Studio", icon: MailCheck },
  { id: "reply", label: "Reply Intelligence", icon: Bot },
  { id: "meeting", label: "Meeting Booker", icon: CalendarCheck },
  { id: "crm", label: "CRM Pipeline", icon: Route },
  { id: "discovery", label: "Brief découverte", icon: ClipboardList },
  { id: "field", label: "Visite terrain", icon: Map },
  { id: "proposal", label: "Proposition", icon: FileText },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={onNavigate}
            className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/8 hover:text-white"
          >
            <Icon className="size-4 text-amber-300 group-hover:text-orange-300" />
            <span>{item.label}</span>
          </a>
        );
      })}
    </nav>
  );
}

export function Sidebar({
  aiModeLabel,
  className,
}: {
  aiModeLabel: string;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "hidden min-h-screen w-72 shrink-0 flex-col bg-slate-950 px-4 py-5 text-white md:flex",
        className,
      )}
    >
      <div className="mb-8 rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-orange-500 text-white">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight">Urban Circus</p>
            <p className="text-xs text-slate-400">Agent IA B2B</p>
          </div>
        </div>
        <div className="mt-4 rounded-lg border border-amber-300/20 bg-amber-300/10 px-3 py-2 text-xs text-amber-100">
          {aiModeLabel}
        </div>
      </div>
      <NavLinks />
      <div className="mt-auto rounded-xl border border-emerald-300/20 bg-emerald-400/10 p-3 text-xs text-emerald-50">
        Pipedrive reste la source de vérité. L’agent enrichit, priorise et prépare les actions.
      </div>
    </aside>
  );
}

export function MobileNav({ aiModeLabel }: { aiModeLabel: string }) {
  return (
    <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur md:hidden">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-950">Urban Circus</p>
          <p className="text-xs text-slate-500">{aiModeLabel}</p>
        </div>
        <Sheet>
          <SheetTrigger render={<Button variant="outline" size="icon" />}>
            <Menu />
            <span className="sr-only">Ouvrir la navigation</span>
          </SheetTrigger>
          <SheetContent side="left" className="bg-slate-950 text-white">
            <SheetHeader>
              <SheetTitle className="text-white">Cockpit IA</SheetTitle>
            </SheetHeader>
            <div className="px-4">
              <NavLinks />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
