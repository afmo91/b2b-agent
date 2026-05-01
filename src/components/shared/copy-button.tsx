"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function CopyButton({
  value,
  label = "Copier",
  className,
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            className={className}
            onClick={copy}
          />
        }
      >
        {copied ? <Check className="text-emerald-600" /> : <Copy />}
        <span className="sr-only">{label}</span>
      </TooltipTrigger>
      <TooltipContent>{copied ? "Copié" : label}</TooltipContent>
    </Tooltip>
  );
}
