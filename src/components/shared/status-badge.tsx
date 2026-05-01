import { Badge } from "@/components/ui/badge";
import type { Priority, Temperature } from "@/lib/ai-schemas";
import { cn } from "@/lib/utils";

const priorityClass: Record<Priority, string> = {
  Faible: "border-slate-200 bg-slate-50 text-slate-700",
  Moyenne: "border-amber-200 bg-amber-50 text-amber-800",
  Haute: "border-orange-200 bg-orange-50 text-orange-800",
  "Très haute": "border-emerald-200 bg-emerald-50 text-emerald-800",
};

const temperatureClass: Record<Temperature, string> = {
  Froid: "border-slate-200 bg-slate-50 text-slate-700",
  Tiède: "border-amber-200 bg-amber-50 text-amber-800",
  Chaud: "border-emerald-200 bg-emerald-50 text-emerald-800",
};

export function PriorityBadge({ value }: { value: Priority }) {
  return (
    <Badge variant="outline" className={cn("font-medium", priorityClass[value])}>
      {value}
    </Badge>
  );
}

export function TemperatureBadge({ value }: { value: Temperature }) {
  return (
    <Badge variant="outline" className={cn("font-medium", temperatureClass[value])}>
      {value}
    </Badge>
  );
}
