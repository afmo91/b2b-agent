import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import type { AiMode } from "@/lib/ai-schemas";

export const dynamic = "force-dynamic";

type HomeProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function Home({ searchParams }: HomeProps) {
  const initialAiMode: AiMode = process.env.OPENAI_API_KEY ? "openai" : "mock";
  const params = searchParams ? await searchParams : {};
  const demo = firstParam(params.demo);
  const presentation = firstParam(params.presentation);

  return (
    <DashboardShell
      initialAiMode={initialAiMode}
      initialLoadFullScenario={demo === "vinci"}
      initialPresentationMode={presentation === "true"}
    />
  );
}
