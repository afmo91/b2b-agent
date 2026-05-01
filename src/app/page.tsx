import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import type { AiMode } from "@/lib/ai-schemas";

export const dynamic = "force-dynamic";

export default function Home() {
  const initialAiMode: AiMode = process.env.OPENAI_API_KEY ? "openai" : "mock";

  return <DashboardShell initialAiMode={initialAiMode} />;
}
