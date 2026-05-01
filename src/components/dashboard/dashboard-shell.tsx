"use client";

import {
  ArrowLeft,
  ArrowRight,
  Bot,
  CalendarCheck,
  Check,
  ClipboardList,
  Euro,
  FileText,
  Loader2,
  MailCheck,
  MonitorUp,
  Play,
  RefreshCcw,
  Route,
  SendHorizonal,
  Sparkles,
  Target,
  Users,
  WandSparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";

import type { AgentMessage } from "@/components/dashboard/agent-reasoning-panel";
import { CopyButton } from "@/components/shared/copy-button";
import { PriorityBadge, TemperatureBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import type {
  AccountAnalysis,
  AiMode,
  ApiEnvelope,
  DiscoveryBrief,
  Proposal,
  ReplyAnalysis,
  Sequence,
} from "@/lib/ai-schemas";
import {
  buildDemoLeads,
  buyingPersonas,
  calendarSlots,
  getAccount,
  getFinancialPotential,
  mockAccountAnalysis,
  mockDiscoveryBrief,
  mockProposal,
  mockReplyAnalysis,
  mockSequence,
  pipelineStages,
  prospectReplies,
  salesReps,
  type BuyingPersona,
  type CrmEvent,
  type DemoLead,
  type SalesRep,
} from "@/lib/demo-data";

const WIZARD_STEPS = [
  { title: "Intro & Value", icon: Sparkles },
  { title: "Compte cible", icon: Target },
  { title: "Buying Committee & Leads", icon: Users },
  { title: "Séquence outbound", icon: SendHorizonal },
  { title: "Réponse prospect", icon: MailCheck },
  { title: "Prise de RDV", icon: CalendarCheck },
  { title: "Brief découverte & visite terrain", icon: ClipboardList },
  { title: "Proposition & Business Case", icon: FileText },
] as const;

const INITIAL_TIMELINE: CrmEvent[] = [
  {
    id: "ready",
    label: "Démo prête",
    detail: "Workflow Urban Circus chargé. Aucune API CRM, outbound ou calendrier réelle appelée.",
    timestamp: "09:00",
    tone: "agent",
  },
];

const PROPOSAL_SEED =
  "350 techniciens, interventions extérieures, besoin visibilité nuit + pluie, confort thermique, logo entreprise, décision achats en septembre, test pilote possible sur 40 personnes.";

const FIELD_NOTES_SEED =
  "Équipes terrain exposées pluie et nuit. Besoin de poches accessibles, liberté de mouvement, logo visible mais sobre, lavage fréquent, tailles variées et validation QHSE avant extension.";

const ACTION_BY_STEP = [
  "Lancer scénario",
  "Analyser avec IA",
  "Créer leads fictifs",
  "Générer séquence",
  "Analyser réponse",
  "Créer RDV",
  "Générer brief",
  "Préparer proposition",
];

const NEXT_ACTION_BY_STEP = [
  "Prochaine action : lancer le scénario VINCI Energies",
  "Prochaine action : cartographier les décideurs et créer les leads fictifs",
  "Prochaine action : générer la séquence QHSE personnalisée",
  "Prochaine action : simuler une réponse chaude et l’analyser",
  "Prochaine action : proposer un RDV découverte avec Clara",
  "Prochaine action : créer le RDV découverte simulé",
  "Prochaine action : préparer la proposition pilote",
  "Prochaine action : présenter le business case VINCI Energies",
];

const STEP_GAINS = [
  "L’équipe comprend immédiatement la valeur de la couche IA au-dessus du workflow existant.",
  "Le commercial priorise un compte à potentiel contrat cadre sans partir d’une page blanche.",
  "Les personas et leads fictifs sont prêts avec angles, objections et canaux.",
  "La prospection devient personnalisée et multicanale en quelques secondes.",
  "Les réponses chaudes sont détectées et transformées en prochaine action commerciale.",
  "Le bon commercial et le bon créneau sont proposés sans friction interne.",
  "La visite découverte et la visite terrain sont préparées avec une trame exploitable.",
  "Le pilote, l’extension et le potentiel financier sont résumés pour décider vite.",
];

const REQUIRED_PERSONAS = [
  "Responsable Achats",
  "Responsable QHSE",
  "Responsable RH",
  "Directeur Opérationnel",
  "Responsable Dotation / Équipements",
  "Responsable Prévention / Sécurité",
];

const IMPACT_METRICS = [
  { label: "Temps de qualification", value: "15 min → 2 min" },
  { label: "Préparation séquence", value: "-70%" },
  { label: "Activités CRM oubliées", value: "-90%" },
  { label: "Leads relancés", value: "+100%" },
  { label: "RDV potentiels détectés", value: "+25%" },
  { label: "Deals à risque identifiés", value: "8" },
];

const REALITY_COLUMNS = [
  {
    title: "V1 réelle",
    items: [
      "OpenAI connecté",
      "analyse compte",
      "génération séquence",
      "analyse réponse",
      "brief découverte",
      "proposition commerciale",
    ],
  },
  {
    title: "Simulé en V1",
    items: ["CRM Pipeline / Pipedrive", "Outbound Sequence", "Google Calendar"],
  },
  {
    title: "V2 branchable",
    items: [
      "API Pipedrive",
      "API Lemlist",
      "Google Calendar API",
      "webhooks réponses prospects",
      "reporting commercial",
    ],
  },
];

const FIELD_STRUCTURED_NOTES = {
  summary:
    "La visite terrain confirme un besoin pilote sur techniciens exposés pluie/nuit avant extension multi-sites.",
  technicalConstraints: [
    "Visibilité jour/nuit",
    "Protection pluie et confort thermique",
    "Personnalisation logo",
    "Tailles et morphologies variées",
    "Durabilité au lavage fréquent",
  ],
  recommendedProducts: [
    "Veste visibilité renforcée",
    "Protection pluie",
    "Couche thermique",
    "Pack pilote terrain",
  ],
  risks: ["Validation QHSE", "Référencement fournisseur", "Déploiement multi-sites"],
  proposalInputs: [
    "Pilote 40 collaborateurs",
    "Extension 350 collaborateurs",
    "Contrat cadre multi-sites",
  ],
};

type StructuredFieldNotes = typeof FIELD_STRUCTURED_NOTES;

async function postAi<T>(url: string, payload: unknown): Promise<ApiEnvelope<T>> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json() as Promise<ApiEnvelope<T>>;
}

function nowLabel() {
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

function normalizeAccountAnalysis(analysis: AccountAnalysis): AccountAnalysis {
  return {
    ...analysis,
    score: 91,
    priority: "Très haute",
  };
}

function buildEvent(
  id: string,
  label: string,
  detail: string,
  tone: CrmEvent["tone"],
): CrmEvent {
  return { id, label, detail, tone, timestamp: nowLabel() };
}

function sequenceText(sequence: Sequence) {
  return sequence.steps
    .map((step) => {
      const subject = step.subject ? `\nObjet : ${step.subject}` : "";
      return `${step.day} — ${step.channel}${subject}\n${step.message}`;
    })
    .join("\n\n---\n\n");
}

export function DashboardShell({
  initialAiMode,
  initialLoadFullScenario = false,
  initialPresentationMode = false,
}: {
  initialAiMode: AiMode;
  initialLoadFullScenario?: boolean;
  initialPresentationMode?: boolean;
}) {
  const [aiMode, setAiMode] = useState<AiMode>(initialAiMode);
  const [currentStep, setCurrentStep] = useState(0);
  const [presentationMode, setPresentationMode] = useState(initialPresentationMode);
  const [accountAnalysis, setAccountAnalysis] = useState<AccountAnalysis | null>(null);
  const [leads, setLeads] = useState<DemoLead[]>([]);
  const [sequencePersona, setSequencePersona] = useState("Responsable QHSE");
  const [sequence, setSequence] = useState<Sequence | null>(null);
  const [replyText, setReplyText] = useState(prospectReplies[0].body);
  const [replyAnalysis, setReplyAnalysis] = useState<ReplyAnalysis | null>(null);
  const [selectedSalesRep, setSelectedSalesRep] = useState("Clara");
  const [selectedSlot, setSelectedSlot] = useState("Mercredi 14h00");
  const [meetingCreated, setMeetingCreated] = useState(false);
  const [discoveryBrief, setDiscoveryBrief] = useState<DiscoveryBrief | null>(null);
  const [fieldNotes, setFieldNotes] = useState(FIELD_NOTES_SEED);
  const [structuredFieldNotes, setStructuredFieldNotes] =
    useState<StructuredFieldNotes | null>(null);
  const [proposalNotes, setProposalNotes] = useState(PROPOSAL_SEED);
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [timeline, setTimeline] = useState<CrmEvent[]>(INITIAL_TIMELINE);
  const [agentMessages, setAgentMessages] = useState<AgentMessage[]>([
    {
      id: "initial-agent",
      step: 0,
      title: "Démo prête",
      body: "Le parcours VINCI Energies est prêt. Lancez le scénario ou chargez la version complète.",
      gain: STEP_GAINS[0],
    },
  ]);
  const [activeStage, setActiveStage] = useState(pipelineStages[0]);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [appError, setAppError] = useState<string | null>(null);
  const initialScenarioLoadedRef = useRef(false);

  const account = getAccount("VINCI Energies");
  const financialPotential = getFinancialPotential("VINCI Energies");
  const displayAnalysis = normalizeAccountAnalysis(
    accountAnalysis ?? mockAccountAnalysis("VINCI Energies"),
  );
  const displayLeads = leads.length > 0 ? leads : buildDemoLeads("VINCI Energies");
  const displaySequence =
    sequence ??
    mockSequence(
      "VINCI Energies",
      sequencePersona,
      "obtenir rendez-vous découverte",
      "consultatif",
    );
  const displayReplyAnalysis =
    replyAnalysis ?? mockReplyAnalysis("VINCI Energies", prospectReplies[0].body);
  const displayBrief = discoveryBrief ?? mockDiscoveryBrief("VINCI Energies", "Responsable QHSE");
  const displayFieldNotes = structuredFieldNotes ?? FIELD_STRUCTURED_NOTES;
  const displayProposal = proposal ?? mockProposal("VINCI Energies");
  const targetPersonas = useMemo(
    () => buyingPersonas.filter((persona) => REQUIRED_PERSONAS.includes(persona.title)),
    [],
  );
  const aiModeLabel = aiMode === "mock" ? "Mode démo local" : "OpenAI connecté";

  function upsertEvent(event: CrmEvent) {
    setTimeline((current) => [event, ...current.filter((item) => item.id !== event.id)]);
  }

  function upsertAgentMessage(message: AgentMessage) {
    setAgentMessages((current) => [
      message,
      ...current.filter((item) => item.id !== message.id),
    ]);
  }

  function setAgentStep(step: number, title: string, body: string) {
    upsertAgentMessage({
      id: `step-${step}`,
      step,
      title,
      body,
      gain: STEP_GAINS[step],
    });
  }

  function recordStepMessage(stepIndex: number) {
    const step = WIZARD_STEPS[stepIndex];
    setAgentMessages((current) => [
      {
        id: `active-step-${stepIndex}`,
        step: stepIndex,
        title: `Étape ${stepIndex + 1} — ${step.title}`,
        body: NEXT_ACTION_BY_STEP[stepIndex],
        gain: STEP_GAINS[stepIndex],
      },
      ...current.filter((message) => message.id !== `active-step-${stepIndex}`),
    ]);
  }

  function goToStep(stepIndex: number) {
    const nextStep = Math.max(0, Math.min(WIZARD_STEPS.length - 1, stepIndex));
    setCurrentStep(nextStep);
    recordStepMessage(nextStep);
  }

  function handleSequencePersonaChange(persona: string) {
    setSequencePersona(persona);
    setSequence(
      mockSequence(
        "VINCI Energies",
        persona,
        "obtenir rendez-vous découverte",
        "consultatif",
      ),
    );
    setAgentStep(
      3,
      `Séquence adaptée pour ${persona.replace("Responsable ", "")}`,
      "L’agent ajuste l’angle commercial et la formulation sans déclencher d’envoi réel.",
    );
  }

  function resetDemo() {
    setCurrentStep(0);
    setPresentationMode(initialPresentationMode);
    setAccountAnalysis(null);
    setLeads([]);
    setSequencePersona("Responsable QHSE");
    setSequence(null);
    setReplyText(prospectReplies[0].body);
    setReplyAnalysis(null);
    setSelectedSalesRep("Clara");
    setSelectedSlot("Mercredi 14h00");
    setMeetingCreated(false);
    setDiscoveryBrief(null);
    setFieldNotes(FIELD_NOTES_SEED);
    setStructuredFieldNotes(null);
    setProposalNotes(PROPOSAL_SEED);
    setProposal(null);
    setTimeline(INITIAL_TIMELINE);
    setActiveStage(pipelineStages[0]);
    setAppError(null);
    setAgentMessages([
      {
        id: "initial-agent",
        step: 0,
        title: "Démo réinitialisée",
        body: "Le parcours VINCI Energies est prêt à être relancé sans état vide.",
        gain: STEP_GAINS[0],
      },
    ]);
  }

  async function analyzeAccount() {
    setLoadingAction("account");
    setAppError(null);

    try {
      const result = await postAi<AccountAnalysis>("/api/ai/account-analysis", {
        accountName: account.name,
        sector: account.sector,
        estimatedSize: account.estimatedSize,
        fieldTeams: account.fieldTeams,
        probableNeed: account.probableNeed,
        potential: account.potential,
      });
      const normalized = normalizeAccountAnalysis(result.data);
      setAiMode(result.mode);
      setAccountAnalysis(normalized);
      setActiveStage("Cible identifiée");
      upsertEvent(
        buildEvent(
          "account-analysis",
          "Compte analysé",
          "VINCI Energies scoré 91/100. Priorité Très haute.",
          "agent",
        ),
      );
      setAgentStep(
        1,
        "Compte scoré",
        "VINCI Energies ressort comme cible très prioritaire : équipes terrain exposées, logique multi-sites et potentiel contrat cadre.",
      );
    } catch {
      setAppError("Impossible d’analyser le compte. Le scénario mock reste disponible.");
      const fallback = normalizeAccountAnalysis(mockAccountAnalysis("VINCI Energies"));
      setAccountAnalysis(fallback);
    } finally {
      setLoadingAction(null);
    }
  }

  function createLeads() {
    const nextLeads = buildDemoLeads("VINCI Energies");
    setLeads(nextLeads);
    setActiveStage("Contact enrichi");
    upsertEvent(
      buildEvent(
        "contacts-added",
        "Contacts ajoutés",
        "7 contacts fictifs démo ajoutés : QHSE, Achats, RH, Opérations, Dotation et Prévention.",
        "crm",
      ),
    );
    upsertEvent(
      buildEvent(
        "deal-created",
        "Deal créé",
        "Deal pilote terrain ouvert dans CRM Pipeline simulé.",
        "crm",
      ),
    );
    setAgentStep(
      2,
      "Buying committee structuré",
      "L’agent transforme le compte en comité d’achat exploitable et prépare une lead list fictive sans donnée privée réelle.",
    );
  }

  async function generateSequence() {
    setLoadingAction("sequence");
    setAppError(null);

    try {
      const result = await postAi<Sequence>("/api/ai/sequence", {
        accountName: "VINCI Energies",
        persona: sequencePersona,
        objective: "obtenir rendez-vous découverte",
        tone: "consultatif",
      });
      setAiMode(result.mode);
      setSequence(result.data);
      setActiveStage("Séquence lancée");
      upsertEvent(
        buildEvent(
          "sequence-prepared",
          "Séquence préparée",
          `Séquence ${sequencePersona} générée avec 6 étapes multicanales.`,
          "outbound",
        ),
      );
      setAgentStep(
        3,
        "Séquence outbound prête",
        "La séquence relie sécurité, visibilité, confort météo et pilote 40 collaborateurs.",
      );
    } catch {
      setAppError("Impossible de générer la séquence. Le scénario mock reste disponible.");
      setSequence(
        mockSequence(
          "VINCI Energies",
          sequencePersona,
          "obtenir rendez-vous découverte",
          "consultatif",
        ),
      );
    } finally {
      setLoadingAction(null);
    }
  }

  function simulateOutboundSend() {
    setActiveStage("Séquence lancée");
    upsertEvent(
      buildEvent(
        "outbound-simulated",
        "Envoi outbound simulé",
        "Séquence prête dans l’outil outbound simulé. Aucun message réel envoyé.",
        "outbound",
      ),
    );
    setAgentStep(
      3,
      "Séquence simulée",
      "L’agent prépare l’envoi mais ne déclenche aucun canal réel en V1.",
    );
  }

  async function analyzeReply() {
    setLoadingAction("reply");
    setAppError(null);
    setReplyText(prospectReplies[0].body);

    try {
      const result = await postAi<ReplyAnalysis>("/api/ai/reply-analysis", {
        accountName: "VINCI Energies",
        reply: prospectReplies[0].body,
      });
      setAiMode(result.mode);
      setReplyAnalysis(result.data);
      setActiveStage("Réponse reçue");
      upsertEvent(
        buildEvent(
          "reply-hot",
          "Réponse chaude détectée",
          "Le prospect signale un renouvellement de dotation et demande plus d’informations.",
          "outbound",
        ),
      );
      setAgentStep(
        4,
        "Réponse qualifiée",
        "La réponse est chaude : l’agent recommande de proposer un rendez-vous découverte et de créer l’activité CRM.",
      );
    } catch {
      setAppError("Impossible d’analyser la réponse. Le scénario mock reste disponible.");
      setReplyAnalysis(mockReplyAnalysis("VINCI Energies", prospectReplies[0].body));
    } finally {
      setLoadingAction(null);
    }
  }

  function createMeeting() {
    setSelectedSalesRep("Clara");
    setSelectedSlot("Mercredi 14h00");
    setMeetingCreated(true);
    setActiveStage("RDV découverte");
    upsertEvent(
      buildEvent(
        "meeting-created",
        "RDV créé",
        "RDV créé — Clara — Mercredi 14h00. Invitation envoyée en simulation.",
        "calendar",
      ),
    );
    upsertEvent(
      buildEvent(
        "crm-activity-meeting",
        "Activité CRM ajoutée",
        "Activité RDV découverte ajoutée au CRM simulé.",
        "crm",
      ),
    );
    setAgentStep(
      5,
      "RDV découverte créé",
      "Clara est sélectionnée par défaut pour son focus infrastructure / comptes terrain.",
    );
  }

  async function generateBrief() {
    setLoadingAction("brief");
    setAppError(null);

    try {
      const result = await postAi<DiscoveryBrief>("/api/ai/discovery-brief", {
        accountName: "VINCI Energies",
        persona: "Responsable QHSE",
        context:
          "Réponse chaude sur un chantier de renouvellement de dotation terrain. Objectif : qualifier périmètre, météo, sécurité, visibilité, personnalisation, calendrier achat et pilote.",
        notes: fieldNotes,
      });
      setAiMode(result.mode);
      setDiscoveryBrief(result.data);
      setStructuredFieldNotes(FIELD_STRUCTURED_NOTES);
      setActiveStage("RDV découverte");
      upsertEvent(
        buildEvent(
          "brief-generated",
          "Brief découverte généré",
          "Questions, informations à capturer, risques et signaux d’achat structurés.",
          "agent",
        ),
      );
      setAgentStep(
        6,
        "Brief et visite terrain prêts",
        "Le commercial et l’expert terrain disposent d’une trame commune pour qualifier le pilote.",
      );
    } catch {
      setAppError("Impossible de générer le brief. Le scénario mock reste disponible.");
      setDiscoveryBrief(mockDiscoveryBrief("VINCI Energies", "Responsable QHSE"));
      setStructuredFieldNotes(FIELD_STRUCTURED_NOTES);
    } finally {
      setLoadingAction(null);
    }
  }

  async function generateProposal() {
    setLoadingAction("proposal");
    setAppError(null);

    try {
      const result = await postAi<Proposal>("/api/ai/proposal", {
        accountName: "VINCI Energies",
        notes: proposalNotes,
      });
      setAiMode(result.mode);
      setProposal(result.data);
      setActiveStage("Proposition envoyée");
      upsertEvent(
        buildEvent(
          "proposal-prepared",
          "Proposition pilote préparée",
          "Pilote 40 collaborateurs, extension 350 collaborateurs et relances J+3/J+7/J+14 prêts.",
          "agent",
        ),
      );
      setAgentStep(
        7,
        "Business case généré",
        "L’opportunité est synthétisée avec potentiel financier, risque achat et prochaine action.",
      );
    } catch {
      setAppError("Impossible de préparer la proposition. Le scénario mock reste disponible.");
      setProposal(mockProposal("VINCI Energies"));
    } finally {
      setLoadingAction(null);
    }
  }

  function loadFullVinciScenario() {
    const fullAnalysis = normalizeAccountAnalysis(mockAccountAnalysis("VINCI Energies"));
    const fullLeads = buildDemoLeads("VINCI Energies");
    const fullSequence = mockSequence(
      "VINCI Energies",
      "Responsable QHSE",
      "obtenir rendez-vous découverte",
      "consultatif",
    );
    const fullReply = mockReplyAnalysis("VINCI Energies", prospectReplies[0].body);
    const fullBrief = mockDiscoveryBrief("VINCI Energies", "Responsable QHSE");
    const fullProposal = mockProposal("VINCI Energies");

    setAccountAnalysis(fullAnalysis);
    setLeads(fullLeads);
    setSequencePersona("Responsable QHSE");
    setSequence(fullSequence);
    setReplyText(prospectReplies[0].body);
    setReplyAnalysis(fullReply);
    setSelectedSalesRep("Clara");
    setSelectedSlot("Mercredi 14h00");
    setMeetingCreated(true);
    setDiscoveryBrief(fullBrief);
    setStructuredFieldNotes(FIELD_STRUCTURED_NOTES);
    setProposal(fullProposal);
    setActiveStage("Proposition envoyée");
    setCurrentStep(0);
    setTimeline([
      buildEvent("proposal-prepared", "Proposition pilote préparée", "Pilote 40 collaborateurs et extension 350 techniciens structurés.", "agent"),
      buildEvent("brief-generated", "Brief découverte généré", "Questions, risques et signaux d’achat prêts.", "agent"),
      buildEvent("crm-activity-meeting", "Activité CRM ajoutée", "RDV découverte et relance ajoutés au CRM simulé.", "crm"),
      buildEvent("meeting-created", "RDV créé", "RDV créé — Clara — Mercredi 14h00. Invitation envoyée en simulation.", "calendar"),
      buildEvent("reply-hot", "Réponse chaude détectée", "Renouvellement de dotation identifié dans la réponse prospect.", "outbound"),
      buildEvent("sequence-prepared", "Séquence préparée", "Séquence Responsable QHSE générée avec 6 étapes.", "outbound"),
      buildEvent("deal-created", "Deal créé", "Deal pilote terrain ouvert dans CRM Pipeline simulé.", "crm"),
      buildEvent("contacts-added", "Contacts ajoutés", "7 contacts fictifs démo ajoutés.", "crm"),
      buildEvent("account-analysis", "Compte analysé", "VINCI Energies scoré 91/100. Priorité Très haute.", "agent"),
      INITIAL_TIMELINE[0],
    ]);
    setAgentMessages(
      WIZARD_STEPS.map((step, index) => ({
        id: `loaded-${index}`,
        step: index,
        title: step.title,
        body:
          index === 0
            ? "Scénario complet VINCI Energies chargé pour une présentation sans état vide."
            : "Étape préremplie avec données démo cohérentes et intégrations simulées.",
        gain: STEP_GAINS[index],
      })).reverse(),
    );
  }

  async function runPrimaryAction() {
    if (currentStep === 0) {
      loadFullVinciScenario();
      await analyzeAccount();
      goToStep(1);
      return;
    }

    if (currentStep === 1) {
      await analyzeAccount();
    } else if (currentStep === 2) {
      createLeads();
    } else if (currentStep === 3) {
      await generateSequence();
    } else if (currentStep === 4) {
      await analyzeReply();
    } else if (currentStep === 5) {
      createMeeting();
    } else if (currentStep === 6) {
      await generateBrief();
    } else if (currentStep === 7) {
      await generateProposal();
    }
  }

  function goNext() {
    goToStep(currentStep + 1);
  }

  function goPrevious() {
    goToStep(currentStep - 1);
  }

  useEffect(() => {
    if (!initialLoadFullScenario || initialScenarioLoadedRef.current) {
      return;
    }

    initialScenarioLoadedRef.current = true;
    loadFullVinciScenario();
  }, [initialLoadFullScenario]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-100 text-slate-950">
      <TopBar
        aiModeLabel={aiModeLabel}
        presentationMode={presentationMode}
        onTogglePresentation={() => setPresentationMode((value) => !value)}
      />

      <MobileStepper currentStep={currentStep} onStepChange={goToStep} />

      <div className="mx-auto grid max-w-[1680px] gap-6 px-4 pb-32 pt-5 sm:px-6 lg:grid-cols-[230px_minmax(0,1fr)] lg:pt-6 xl:grid-cols-[230px_minmax(0,1fr)_340px]">
        <DesktopStepper currentStep={currentStep} onStepChange={goToStep} />

        <main className="min-w-0">
          {appError ? (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-950">
              {appError}
            </div>
          ) : null}

          <StepFrame currentStep={currentStep} presentationMode={presentationMode}>
            {currentStep === 0 ? (
              <IntroStep onStart={runPrimaryAction} presentationMode={presentationMode} />
            ) : null}
            {currentStep === 1 ? (
              <AccountStep
                analysis={displayAnalysis}
                financialPotential={financialPotential}
                accountNeed={account.probableNeed}
              />
            ) : null}
            {currentStep === 2 ? (
              <CommitteeLeadsStep
                personas={targetPersonas}
                leads={displayLeads}
                selectedSalesRep={selectedSalesRep}
                onSalesRepChange={setSelectedSalesRep}
                onCreateLeads={createLeads}
              />
            ) : null}
            {currentStep === 3 ? (
              <SequenceStep
                sequence={displaySequence}
                persona={sequencePersona}
                onPersonaChange={handleSequencePersonaChange}
                onGenerate={generateSequence}
                onSimulateSend={simulateOutboundSend}
              />
            ) : null}
            {currentStep === 4 ? (
              <ReplyStep
                replyText={replyText}
                analysis={displayReplyAnalysis}
                onReplyChange={setReplyText}
                onAnalyze={analyzeReply}
                onProposeMeeting={() => setCurrentStep(5)}
              />
            ) : null}
            {currentStep === 5 ? (
              <MeetingStep
                selectedSalesRep={selectedSalesRep}
                selectedSlot={selectedSlot}
                meetingCreated={meetingCreated}
                onSalesRepChange={setSelectedSalesRep}
                onSlotChange={setSelectedSlot}
                onCreateMeeting={createMeeting}
              />
            ) : null}
            {currentStep === 6 ? (
              <BriefFieldStep
                brief={displayBrief}
                fieldNotes={fieldNotes}
                structuredNotes={displayFieldNotes}
                onFieldNotesChange={setFieldNotes}
                onGenerateBrief={generateBrief}
                onPrepareProposal={() => setCurrentStep(7)}
              />
            ) : null}
            {currentStep === 7 ? (
              <ProposalBusinessStep
                proposal={displayProposal}
                notes={proposalNotes}
                onNotesChange={setProposalNotes}
                onGenerateProposal={generateProposal}
              />
            ) : null}
          </StepFrame>

          <MobileInsightPanel
            messages={agentMessages}
            timeline={timeline}
            nextAction={NEXT_ACTION_BY_STEP[currentStep]}
          />
        </main>

        <RightPanel
          messages={agentMessages}
          timeline={timeline}
          nextAction={NEXT_ACTION_BY_STEP[currentStep]}
          activeStage={activeStage}
        />
      </div>

      <BottomActionBar
        currentStep={currentStep}
        totalSteps={WIZARD_STEPS.length}
        loading={Boolean(loadingAction)}
        primaryLabel={ACTION_BY_STEP[currentStep]}
        onPrevious={goPrevious}
        onNext={goNext}
        onPrimary={runPrimaryAction}
        onReset={resetDemo}
        onLoadScenario={loadFullVinciScenario}
      />
    </div>
  );
}

function TopBar({
  aiModeLabel,
  presentationMode,
  onTogglePresentation,
}: {
  aiModeLabel: string;
  presentationMode: boolean;
  onTogglePresentation: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1680px] items-center justify-between gap-4 px-4 sm:px-6">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-950">
            Urban Circus — Agent IA B2B Grands Comptes
          </p>
          <p className="hidden text-xs text-slate-500 sm:block">
            Démo guidée VINCI Energies, intégrations CRM / outbound / calendrier simulées.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-800">
            {aiModeLabel}
          </Badge>
          <Button
            variant={presentationMode ? "default" : "outline"}
            size="sm"
            onClick={onTogglePresentation}
            className={presentationMode ? "bg-slate-950 text-white hover:bg-slate-800" : ""}
          >
            <MonitorUp />
            <span className="hidden sm:inline">Mode présentation</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

function DesktopStepper({
  currentStep,
  onStepChange,
}: {
  currentStep: number;
  onStepChange: (step: number) => void;
}) {
  return (
    <aside className="sticky top-20 hidden h-[calc(100vh-6rem)] min-h-0 rounded-md border border-slate-200 bg-white p-3 shadow-sm lg:block">
      <p className="px-2 text-xs font-semibold uppercase text-slate-500">Parcours guidé</p>
      <div className="mt-3 space-y-1">
        {WIZARD_STEPS.map((step, index) => (
          <StepperButton
            key={step.title}
            index={index}
            title={step.title}
            icon={step.icon}
            active={index === currentStep}
            done={index < currentStep}
            onClick={() => onStepChange(index)}
          />
        ))}
      </div>
    </aside>
  );
}

function MobileStepper({
  currentStep,
  onStepChange,
}: {
  currentStep: number;
  onStepChange: (step: number) => void;
}) {
  return (
    <div className="sticky top-16 z-30 border-b border-slate-200 bg-slate-100/95 px-4 py-3 backdrop-blur lg:hidden">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {WIZARD_STEPS.map((step, index) => (
          <button
            key={step.title}
            type="button"
            onClick={() => onStepChange(index)}
            className={`flex shrink-0 items-center gap-2 rounded-md border px-3 py-2 text-sm ${
              index === currentStep
                ? "border-orange-300 bg-orange-50 text-orange-950"
                : "border-slate-200 bg-white text-slate-600"
            }`}
          >
            <span>{index + 1}</span>
            <span className="max-w-40 truncate">{step.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function StepperButton({
  index,
  title,
  icon: Icon,
  active,
  done,
  onClick,
}: {
  index: number;
  title: string;
  icon: LucideIcon;
  active: boolean;
  done: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition ${
        active
          ? "bg-slate-950 text-white"
          : done
            ? "bg-emerald-50 text-emerald-950 hover:bg-emerald-100"
            : "text-slate-600 hover:bg-slate-50"
      }`}
    >
      <span
        className={`flex size-7 shrink-0 items-center justify-center rounded-md ${
          active ? "bg-white/15" : done ? "bg-emerald-100" : "bg-slate-100"
        }`}
      >
        {done ? <Check className="size-4" /> : <Icon className="size-4" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs opacity-70">Étape {index + 1}</span>
        <span className="block leading-5">{title}</span>
      </span>
    </button>
  );
}

function StepFrame({
  currentStep,
  presentationMode,
  children,
}: {
  currentStep: number;
  presentationMode: boolean;
  children: ReactNode;
}) {
  const step = WIZARD_STEPS[currentStep];

  return (
    <section className="min-w-0">
      <div className="mb-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-orange-600">
              Étape {currentStep + 1}/{WIZARD_STEPS.length}
            </p>
            <h1 className={`${presentationMode ? "text-3xl" : "text-2xl"} mt-1 font-semibold text-slate-950`}>
              {step.title}
            </h1>
          </div>
          <div className="min-w-48">
            <Progress value={((currentStep + 1) / WIZARD_STEPS.length) * 100} />
          </div>
        </div>
        <div className="mt-4 rounded-md border border-orange-100 bg-orange-50 px-3 py-2 text-sm leading-6 text-orange-950">
          <span className="font-semibold">Ce que l’équipe gagne : </span>
          {STEP_GAINS[currentStep]}
        </div>
      </div>
      {children}
    </section>
  );
}

function IntroStep({
  onStart,
  presentationMode,
}: {
  onStart: () => void;
  presentationMode: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
        <Badge className="bg-slate-950 text-white">Scénario VINCI Energies</Badge>
        <h2 className={`${presentationMode ? "text-4xl" : "text-3xl"} mt-4 max-w-3xl font-semibold text-slate-950`}>
          Urban Circus — Agent IA B2B Grands Comptes
        </h2>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          Une couche IA au-dessus de Pipedrive, Lemlist et Google Calendar pour qualifier,
          personnaliser, relancer et garder le CRM propre.
        </p>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
          À chaque interaction, l’agent analyse le contexte, recommande la prochaine action,
          prépare le contenu commercial et crée les activités CRM nécessaires.
        </p>
        <div className="mt-5">
          <Button size="lg" className="bg-slate-950 text-white hover:bg-slate-800" onClick={onStart}>
            <Play />
            Lancer le scénario VINCI Energies
          </Button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <InfoCard
          title="Ce que montre cette démo"
          body="Cette démo montre comment un agent IA peut s’intégrer au workflow commercial existant d’Urban Circus : prospection grands comptes, qualification, séquences outbound, prise de RDV, suivi CRM, préparation des visites et proposition commerciale."
        />
        <Card className="border-emerald-200 bg-emerald-50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Impact business estimé</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {IMPACT_METRICS.map((metric) => (
              <div key={metric.label} className="rounded-md border border-emerald-100 bg-white p-3">
                <p className="text-xl font-semibold text-emerald-950">{metric.value}</p>
                <p className="mt-1 text-xs text-emerald-800">{metric.label}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">
            Ce qui est réel aujourd’hui vs. ce qui sera branché ensuite
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          {REALITY_COLUMNS.map((column) => (
            <div key={column.title} className="rounded-md border border-slate-200 bg-slate-50 p-3">
              <p className="text-sm font-semibold text-slate-950">{column.title}</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {column.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-orange-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function AccountStep({
  analysis,
  financialPotential,
  accountNeed,
}: {
  analysis: AccountAnalysis;
  financialPotential: ReturnType<typeof getFinancialPotential>;
  accountNeed: string;
}) {
  return (
    <div className="space-y-4">
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardContent className="p-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Compte sélectionné</p>
              <h2 className="mt-1 text-3xl font-semibold text-slate-950">VINCI Energies</h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                {accountNeed}
              </p>
            </div>
            <div className="rounded-md border border-orange-200 bg-orange-50 p-5 text-center">
              <p className="text-sm font-medium text-orange-800">Score IA</p>
              <p className="mt-1 text-5xl font-semibold text-orange-950">{analysis.score}/100</p>
              <div className="mt-3 flex justify-center">
                <PriorityBadge value={analysis.priority} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-3">
        <MoneyCard label="Pilote" value={financialPotential.pilot} />
        <MoneyCard label="Déploiement régional" value={financialPotential.regionalRollout} />
        <MoneyCard label="Contrat cadre multi-sites" value={financialPotential.frameworkContract} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <ListCard title="Équipes concernées" items={analysis.teamsConcerned} />
        <ListCard title="Objections probables" items={analysis.likelyObjections} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <InfoCard title="Angle commercial" body={analysis.recommendedAngle} />
        <InfoCard title="Prochaine meilleure action" body={analysis.nextBestAction} />
      </div>
    </div>
  );
}

function CommitteeLeadsStep({
  personas,
  leads,
  selectedSalesRep,
  onSalesRepChange,
  onCreateLeads,
}: {
  personas: BuyingPersona[];
  leads: DemoLead[];
  selectedSalesRep: string;
  onSalesRepChange: (name: string) => void;
  onCreateLeads: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {personas.map((persona) => (
          <Card key={persona.title} className="border-slate-200 bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold text-slate-950">{persona.title}</p>
                <PriorityBadge value={persona.priority} />
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{persona.roleInDecision}</p>
              <Detail label="Angle" value={persona.angle} />
              <Detail label="Objections" value={persona.likelyObjections} />
              <Detail label="Canal" value={persona.recommendedChannel} />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader className="gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base">Lead List — contacts fictifs pour démonstration</CardTitle>
            <p className="mt-1 text-sm text-slate-500">
              Aucune donnée privée réelle. Les contacts restent explicitement marqués “démo”.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <select
              value={selectedSalesRep}
              onChange={(event) => onSalesRepChange(event.target.value)}
              className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm"
            >
              {salesReps.map((rep) => (
                <option key={rep.name} value={rep.name}>
                  {rep.name}
                </option>
              ))}
            </select>
            <Button onClick={onCreateLeads}>
              <Users />
              Créer leads fictifs
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contact</TableHead>
                <TableHead>Persona</TableHead>
                <TableHead>Priorité</TableHead>
                <TableHead>Canal</TableHead>
                <TableHead>Statut CRM simulé</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium text-slate-950">{lead.contact}</TableCell>
                  <TableCell>{lead.persona}</TableCell>
                  <TableCell>
                    <PriorityBadge value={lead.priority} />
                  </TableCell>
                  <TableCell>{lead.recommendedChannel}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-700">
                      {lead.crmStatus}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function SequenceStep({
  sequence,
  persona,
  onPersonaChange,
  onGenerate,
  onSimulateSend,
}: {
  sequence: Sequence;
  persona: string;
  onPersonaChange: (persona: string) => void;
  onGenerate: () => void;
  onSimulateSend: () => void;
}) {
  return (
    <div className="space-y-4">
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardContent className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="font-semibold text-slate-950">{sequence.sequenceName}</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">{sequence.strategicSummary}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {["Responsable QHSE", "Responsable Achats", "Responsable RH"].map((item) => (
              <Button
                key={item}
                variant={persona === item ? "default" : "outline"}
                onClick={() => onPersonaChange(item)}
              >
                Adapter pour {item.replace("Responsable ", "")}
              </Button>
            ))}
            <CopyButton value={sequenceText(sequence)} label="Copier séquence" />
            <Button variant="outline" onClick={onSimulateSend}>
              <SendHorizonal />
              Simuler envoi outbound
            </Button>
            <Button onClick={onGenerate}>
              <WandSparkles />
              Générer séquence
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3">
        {sequence.steps.map((step) => (
          <Card key={`${step.day}-${step.channel}`} className="border-slate-200 bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="bg-slate-950 text-white">{step.day}</Badge>
                    <Badge variant="outline" className="border-orange-200 bg-orange-50 text-orange-800">
                      {step.channel}
                    </Badge>
                    <span className="text-sm font-medium text-slate-950">{step.objective}</span>
                  </div>
                  {step.subject ? (
                    <p className="mt-2 text-sm font-medium text-slate-800">Objet : {step.subject}</p>
                  ) : null}
                </div>
                <CopyButton value={step.message} label="Copier le message" />
              </div>
              <p className="mt-3 whitespace-pre-wrap rounded-md border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-700">
                {step.message}
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-500">{step.commercialLogic}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ReplyStep({
  replyText,
  analysis,
  onReplyChange,
  onAnalyze,
  onProposeMeeting,
}: {
  replyText: string;
  analysis: ReplyAnalysis;
  onReplyChange: (value: string) => void;
  onAnalyze: () => void;
  onProposeMeeting: () => void;
}) {
  return (
    <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Réponse chaude simulée</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={replyText}
            onChange={(event) => onReplyChange(event.target.value)}
            rows={7}
            className="resize-none"
          />
          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={onAnalyze}>
              <Bot />
              Analyser réponse
            </Button>
            <Button variant="outline" onClick={onProposeMeeting}>
              <CalendarCheck />
              Proposer RDV
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader className="gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <TemperatureBadge value={analysis.temperature} />
            <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-700">
              {analysis.recommendedCrmStageChange}
            </Badge>
          </div>
          <CardTitle className="text-base">Analyse IA</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <InfoCard title="Intention" body={analysis.intent} />
          <InfoCard title="Prochaine action" body={analysis.recommendedNextAction} />
          <InfoCard title="Activité à créer" body={analysis.crmActivityToCreate} />
          <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-semibold text-slate-950">Réponse proposée</p>
              <CopyButton value={analysis.proposedReply} label="Copier la réponse" />
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
              {analysis.proposedReply}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MeetingStep({
  selectedSalesRep,
  selectedSlot,
  meetingCreated,
  onSalesRepChange,
  onSlotChange,
  onCreateMeeting,
}: {
  selectedSalesRep: string;
  selectedSlot: string;
  meetingCreated: boolean;
  onSalesRepChange: (name: string) => void;
  onSlotChange: (slot: string) => void;
  onCreateMeeting: () => void;
}) {
  return (
    <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="grid gap-3">
        {salesReps.map((rep) => (
          <SalesRepCard
            key={rep.name}
            rep={rep}
            selected={rep.name === selectedSalesRep}
            onClick={() => onSalesRepChange(rep.name)}
          />
        ))}
      </div>

      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Calendrier commercial simulé</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2">
            {calendarSlots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => onSlotChange(slot)}
                className={`rounded-md border px-4 py-4 text-left text-sm font-medium ${
                  selectedSlot === slot
                    ? "border-emerald-300 bg-emerald-50 text-emerald-950"
                    : "border-slate-200 bg-slate-50 text-slate-700"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
          <Button className="mt-4 w-full bg-slate-950 text-white hover:bg-slate-800" onClick={onCreateMeeting}>
            <CalendarCheck />
            Créer RDV Google Calendar simulé
          </Button>

          {meetingCreated ? (
            <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950">
              <p className="text-base font-semibold">RDV créé — Clara — Mercredi 14h00</p>
              <p className="mt-2">Invitation envoyée — simulation</p>
              <p>Activité CRM ajoutée — simulation</p>
              <p>Brief découverte prêt</p>
            </div>
          ) : (
            <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              Clara et Mercredi 14h00 sont présélectionnés pour accélérer la démo.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function BriefFieldStep({
  brief,
  fieldNotes,
  structuredNotes,
  onFieldNotesChange,
  onGenerateBrief,
  onPrepareProposal,
}: {
  brief: DiscoveryBrief;
  fieldNotes: string;
  structuredNotes: StructuredFieldNotes;
  onFieldNotesChange: (value: string) => void;
  onGenerateBrief: () => void;
  onPrepareProposal: () => void;
}) {
  const checklist = [
    "conditions terrain",
    "contraintes météo",
    "visibilité jour/nuit",
    "contraintes de mouvement",
    "poches / matériaux / résistance",
    "personnalisation logo",
    "lavage / durabilité",
    "tailles et morphologies",
    "contraintes sécurité / QHSE",
  ];

  return (
    <div className="space-y-4">
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader className="gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base">Brief découverte</CardTitle>
            <p className="mt-1 text-sm text-slate-600">{brief.meetingObjective}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={onGenerateBrief}>
              <ClipboardList />
              Générer brief
            </Button>
            <Button variant="outline" onClick={onPrepareProposal}>
              Préparer proposition
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          <ListCard title="Questions à poser" items={brief.questionsToAsk} />
          <ListCard title="Informations à capturer" items={brief.informationToCapture} />
          <ListCard title="Risques à vérifier" items={brief.risksToCheck} />
          <ListCard title="Signaux d’achat" items={brief.buyingSignalsToDetect} />
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Checklist visite terrain expert</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
            {checklist.map((item) => (
              <label key={item} className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                <input type="checkbox" className="size-4 accent-orange-600" defaultChecked />
                {item}
              </label>
            ))}
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Notes terrain structurées</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              value={fieldNotes}
              onChange={(event) => onFieldNotesChange(event.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-sm leading-6 text-slate-600">{structuredNotes.summary}</p>
            <div className="grid gap-3 md:grid-cols-2">
              <ListCard title="Contraintes techniques" items={structuredNotes.technicalConstraints} />
              <ListCard title="Produits recommandés" items={structuredNotes.recommendedProducts} />
              <ListCard title="Risques" items={structuredNotes.risks} />
              <ListCard title="Éléments proposition" items={structuredNotes.proposalInputs} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ProposalBusinessStep({
  proposal,
  notes,
  onNotesChange,
  onGenerateProposal,
}: {
  proposal: Proposal;
  notes: string;
  onNotesChange: (value: string) => void;
  onGenerateProposal: () => void;
}) {
  return (
    <div className="space-y-4">
      <Card className="border-emerald-200 bg-white shadow-sm">
        <CardContent className="p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <Badge className="bg-slate-950 text-white">Business case généré</Badge>
              <h2 className="mt-4 text-2xl font-semibold text-slate-950">
                Synthèse de l’opportunité VINCI Energies
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Opportunité contrat cadre multi-sites, avec pilote terrain recommandé
                pour sécuriser adoption, QHSE et validation achats.
              </p>
            </div>
            <Button onClick={onGenerateProposal}>
              <FileText />
              Préparer proposition
            </Button>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <SummaryItem label="Score" value="91/100" />
            <SummaryItem label="Priorité" value="Très haute" />
            <SummaryItem label="Pilote recommandé" value="40 collaborateurs" />
            <SummaryItem label="Déploiement potentiel" value="350 collaborateurs" />
            <SummaryItem label="Commercial recommandé" value="Clara" />
            <SummaryItem label="Risque principal" value="référencement fournisseur / validation achats" />
            <SummaryItem label="Action recommandée" value="préparer pilote terrain + proposition personnalisée" />
            <SummaryItem label="Opportunité" value="contrat cadre multi-sites" />
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <MoneyCard label="Pilote" value="12 000 € – 18 000 €" />
            <MoneyCard label="Déploiement régional" value="60 000 € – 110 000 €" />
            <MoneyCard label="Contrat cadre multi-sites" value="250 000 €+" />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Input proposition</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={notes}
              onChange={(event) => onNotesChange(event.target.value)}
              rows={7}
              className="resize-none"
            />
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle className="text-base">Email de proposition</CardTitle>
              <p className="mt-1 text-sm text-slate-500">Prêt à copier, aucun envoi réel.</p>
            </div>
            <CopyButton value={proposal.proposalEmail} label="Copier l’email" />
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap rounded-md border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-700">
              {proposal.proposalEmail}
            </p>
            <ListCard title="Plan de relance J+3 / J+7 / J+14" items={proposal.followUpPlan} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function RightPanel({
  messages,
  timeline,
  nextAction,
  activeStage,
}: {
  messages: AgentMessage[];
  timeline: CrmEvent[];
  nextAction: string;
  activeStage: string;
}) {
  return (
    <aside className="sticky top-20 hidden h-[calc(100vh-6rem)] min-h-0 space-y-4 xl:block">
      <PanelCard title="Agent IA — Raisonnement & actions" icon={Bot}>
        <ScrollArea className="h-52 pr-2">
          <div className="space-y-2">
            {messages.slice(0, 5).map((message) => (
              <div key={message.id} className="rounded-md border border-slate-200 bg-slate-50 p-3">
                <p className="text-sm font-medium text-slate-950">{message.title}</p>
                <p className="mt-1 text-sm leading-5 text-slate-600">{message.body}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </PanelCard>

      <PanelCard title="CRM Live Timeline" icon={Route}>
        <Badge variant="outline" className="mb-3 border-emerald-200 bg-emerald-50 text-emerald-800">
          Étape active : {activeStage}
        </Badge>
        <ScrollArea className="h-64 pr-2">
          <TimelineList events={timeline} />
        </ScrollArea>
      </PanelCard>

      <PanelCard title="Action suivante" icon={ArrowRight}>
        <p className="text-sm leading-6 text-slate-700">{nextAction}</p>
      </PanelCard>
    </aside>
  );
}

function MobileInsightPanel({
  messages,
  timeline,
  nextAction,
}: {
  messages: AgentMessage[];
  timeline: CrmEvent[];
  nextAction: string;
}) {
  return (
    <div className="mt-4 space-y-3 xl:hidden">
      <details className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <summary className="cursor-pointer text-sm font-semibold text-slate-950">
          Agent IA & CRM Live
        </summary>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-slate-950">Agent IA</p>
            <div className="mt-2 space-y-2">
              {messages.slice(0, 3).map((message) => (
                <div key={message.id} className="rounded-md bg-slate-50 p-3 text-sm text-slate-600">
                  <span className="font-medium text-slate-950">{message.title} — </span>
                  {message.body}
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-950">CRM Live Timeline</p>
            <div className="mt-2">
              <TimelineList events={timeline.slice(0, 5)} />
            </div>
          </div>
        </div>
        <div className="mt-4 rounded-md border border-orange-200 bg-orange-50 p-3 text-sm text-orange-950">
          {nextAction}
        </div>
      </details>
    </div>
  );
}

function BottomActionBar({
  currentStep,
  totalSteps,
  loading,
  primaryLabel,
  onPrevious,
  onNext,
  onPrimary,
  onReset,
  onLoadScenario,
}: {
  currentStep: number;
  totalSteps: number;
  loading: boolean;
  primaryLabel: string;
  onPrevious: () => void;
  onNext: () => void;
  onPrimary: () => void;
  onReset: () => void;
  onLoadScenario: () => void;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-lg backdrop-blur">
      <div className="mx-auto flex max-w-[1680px] flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span>Étape {currentStep + 1}/{totalSteps}</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">{WIZARD_STEPS[currentStep].title}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-end">
          <Button variant="outline" onClick={onPrevious} disabled={currentStep === 0}>
            <ArrowLeft />
            Précédente
          </Button>
          <Button variant="outline" onClick={onNext} disabled={currentStep === totalSteps - 1}>
            Suivante
            <ArrowRight />
          </Button>
          <Button onClick={onPrimary} disabled={loading} className="bg-slate-950 text-white hover:bg-slate-800">
            {loading ? <Loader2 className="animate-spin" /> : <WandSparkles />}
            {primaryLabel}
          </Button>
          <Button variant="outline" onClick={onLoadScenario}>
            Charger VINCI
          </Button>
          <Button variant="ghost" onClick={onReset}>
            <RefreshCcw />
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}

function SalesRepCard({
  rep,
  selected,
  onClick,
}: {
  rep: SalesRep;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md border bg-white p-4 text-left shadow-sm ${
        selected ? "border-orange-300 ring-4 ring-orange-100" : "border-slate-200"
      }`}
    >
      <p className="font-semibold text-slate-950">{rep.name}</p>
      <p className="mt-1 text-sm text-slate-600">{rep.focus}</p>
      <Badge variant="outline" className="mt-3 border-emerald-200 bg-emerald-50 text-emerald-800">
        Disponible {rep.availability}
      </Badge>
    </button>
  );
}

function TimelineList({ events }: { events: CrmEvent[] }) {
  return (
    <div className="space-y-3">
      {events.map((event) => (
        <div key={event.id} className="flex gap-3">
          <span
            className={`mt-1 size-2.5 shrink-0 rounded-full ${
              event.tone === "agent"
                ? "bg-orange-500"
                : event.tone === "crm"
                  ? "bg-emerald-600"
                  : event.tone === "calendar"
                    ? "bg-blue-600"
                    : "bg-amber-500"
            }`}
          />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-medium text-slate-950">{event.label}</p>
              <span className="text-xs text-slate-500">{event.timestamp}</span>
            </div>
            <p className="text-sm leading-5 text-slate-600">{event.detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function PanelCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Icon className="size-4 text-orange-600" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function InfoCard({ title, body }: { title: string; body: string }) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardContent className="p-4">
        <p className="font-semibold text-slate-950">{title}</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
      </CardContent>
    </Card>
  );
}

function MoneyCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="border-emerald-200 bg-emerald-50 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center gap-2">
          <Euro className="size-4 text-emerald-700" />
          <p className="text-sm font-medium text-emerald-800">{label}</p>
        </div>
        <p className="mt-2 text-xl font-semibold text-emerald-950">{value}</p>
      </CardContent>
    </Card>
  );
}

function ListCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
      <p className="text-sm font-semibold text-slate-950">{title}</p>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-orange-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-3">
      <p className="text-xs font-medium uppercase text-slate-500">{label}</p>
      <p className="mt-1 text-sm leading-5 text-slate-600">{value}</p>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold leading-5 text-slate-950">{value}</p>
    </div>
  );
}
