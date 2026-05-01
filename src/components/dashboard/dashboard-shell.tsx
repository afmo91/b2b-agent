"use client";

import { AlertCircle } from "lucide-react";
import { useMemo, useState } from "react";

import { AccountIntelligence } from "@/components/dashboard/account-intelligence";
import type { AgentMessage } from "@/components/dashboard/agent-reasoning-panel";
import { BeforeAfterSection } from "@/components/dashboard/before-after";
import { BusinessCaseCard } from "@/components/dashboard/business-case-card";
import { BuyingCommittee } from "@/components/dashboard/buying-committee";
import { CommandCenter } from "@/components/dashboard/command-center";
import { CrmPanel } from "@/components/dashboard/crm-panel";
import { DiscoveryBriefSection } from "@/components/dashboard/discovery-brief";
import {
  FieldVisitAssistant,
  type StructuredFieldNotes,
} from "@/components/dashboard/field-visit";
import { LeadListBuilder } from "@/components/dashboard/lead-list-builder";
import { LiveTimeline } from "@/components/dashboard/live-timeline";
import { MeetingBooker } from "@/components/dashboard/meeting-booker";
import { MobileNav, Sidebar } from "@/components/dashboard/sidebar";
import { ProposalAssistant } from "@/components/dashboard/proposal-assistant";
import { ReplyIntelligence } from "@/components/dashboard/reply-intelligence";
import { SequenceStudio } from "@/components/dashboard/sequence-studio";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
  demoAccounts,
  getAccount,
  mockAccountAnalysis,
  mockDiscoveryBrief,
  mockProposal,
  mockReplyAnalysis,
  mockSequence,
  pipelineStages,
  prospectReplies,
  salesReps,
  type CrmEvent,
  type DemoLead,
} from "@/lib/demo-data";

const initialTimeline: CrmEvent[] = [
  {
    id: "initial",
    label: "Cockpit IA prêt",
    detail: "Démo V1 chargée : OpenAI côté serveur si clé disponible, intégrations simulées.",
    timestamp: "09:00",
    tone: "agent",
  },
];

const proposalSeed =
  "350 techniciens, interventions extérieures, besoin visibilité nuit + pluie, confort thermique, logo entreprise, décision achats en septembre, test pilote possible sur 40 personnes.";

const fieldSeed =
  "Équipes terrain exposées pluie et nuit. Besoin de poches accessibles, liberté de mouvement, logo visible mais sobre, lavage fréquent, tailles variées et validation QHSE avant extension.";

const guidedSteps = [
  "Analyse VINCI Energies",
  "Score et potentiel contrat cadre",
  "Mapping décideurs QHSE / Achats / Opérations",
  "Création leads fictifs démo",
  "Génération séquence Responsable QHSE",
  "Simulation réponse chaude",
  "Analyse de réponse",
  "Proposition RDV avec Clara",
  "Création RDV Google Calendar simulé",
  "Mise à jour CRM simulée",
  "Génération brief découverte",
  "Préparation proposition pilote 40 collaborateurs",
];

const guidedStepGains = [
  "Le commercial part d’un compte priorisé, pas d’une page blanche.",
  "Le potentiel financier est cadré en quelques secondes pour décider où investir l’effort.",
  "Le comité d’achat est lisible : QHSE, Achats et Opérations ont chacun un angle.",
  "La liste de leads est prête avec contacts fictifs démo et angles par persona.",
  "La séquence QHSE est personnalisée sans repartir d’un template générique.",
  "L’équipe voit immédiatement quel signal mérite une action commerciale.",
  "La réponse est qualifiée, routée et transformée en prochaine action CRM.",
  "Le bon commercial et le bon créneau sont proposés sans aller-retour interne.",
  "Le rendez-vous et l’activité CRM sont simulés proprement, sans API réelle.",
  "Pipedrive reste propre : organisation, deal, notes et relances sont alignés.",
  "Le commercial arrive en découverte avec questions, risques et signaux d’achat.",
  "La proposition pilote est structurée pour passer du rendez-vous au business case.",
];

const guidedStepSections = [
  "account",
  "account",
  "committee",
  "leads",
  "sequence",
  "reply",
  "reply",
  "meeting",
  "meeting",
  "crm",
  "discovery",
  "proposal",
];

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

export function DashboardShell({ initialAiMode }: { initialAiMode: AiMode }) {
  const [aiMode, setAiMode] = useState<AiMode>(initialAiMode);
  const [selectedAccountName, setSelectedAccountName] = useState("VINCI Energies");
  const [accountAnalysis, setAccountAnalysis] = useState<AccountAnalysis | null>(null);
  const [leads, setLeads] = useState<DemoLead[]>([]);
  const [sequencePersona, setSequencePersona] = useState("Responsable QHSE");
  const [sequenceObjective, setSequenceObjective] = useState("obtenir rendez-vous découverte");
  const [sequenceTone, setSequenceTone] = useState("consultatif");
  const [sequence, setSequence] = useState<Sequence | null>(null);
  const [replyText, setReplyText] = useState(prospectReplies[0].body);
  const [replyAnalysis, setReplyAnalysis] = useState<ReplyAnalysis | null>(null);
  const [selectedSalesRep, setSelectedSalesRep] = useState("Clara");
  const [selectedSlot, setSelectedSlot] = useState("Mercredi 14h00");
  const [meetingCreated, setMeetingCreated] = useState(false);
  const [timeline, setTimeline] = useState<CrmEvent[]>(initialTimeline);
  const [activeStage, setActiveStage] = useState(pipelineStages[0]);
  const [discoveryPersona, setDiscoveryPersona] = useState("Responsable QHSE");
  const [discoveryContext, setDiscoveryContext] = useState(
    "Réponse chaude sur un chantier de renouvellement de dotation terrain. Objectif : qualifier périmètre, météo, sécurité, visibilité, personnalisation, calendrier achat et pilote.",
  );
  const [discoveryNotes, setDiscoveryNotes] = useState("");
  const [discoveryBrief, setDiscoveryBrief] = useState<DiscoveryBrief | null>(null);
  const [fieldNotes, setFieldNotes] = useState(fieldSeed);
  const [structuredFieldNotes, setStructuredFieldNotes] =
    useState<StructuredFieldNotes | null>(null);
  const [proposalNotes, setProposalNotes] = useState(proposalSeed);
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [appError, setAppError] = useState<string | null>(null);
  const [guidedStepIndex, setGuidedStepIndex] = useState<number | null>(null);
  const [agentMessages, setAgentMessages] = useState<AgentMessage[]>([]);
  const [presentationMode, setPresentationMode] = useState(false);
  const [businessCaseVisible, setBusinessCaseVisible] = useState(false);

  const selectedAccount = useMemo(
    () => getAccount(selectedAccountName),
    [selectedAccountName],
  );

  const aiModeLabel = aiMode === "mock" ? "Mode démo local" : "OpenAI connecté";
  const guidedActive = guidedStepIndex !== null;
  const guidedLoading = loadingAction !== null;
  const guidedProgress =
    guidedStepIndex === null
      ? 0
      : Math.min(100, Math.round(((guidedStepIndex + 1) / guidedSteps.length) * 100));

  function addEvent(label: string, detail: string, tone: CrmEvent["tone"] = "agent") {
    setTimeline((current) => [
      {
        id: `${Date.now()}-${Math.random()}`,
        label,
        detail,
        timestamp: nowLabel(),
        tone,
      },
      ...current,
    ]);
  }

  function addAgentMessage(step: number, title: string, body: string) {
    setAgentMessages((current) => [
      ...current,
      {
        id: `${Date.now()}-${Math.random()}`,
        step,
        title,
        body,
        gain: guidedStepGains[step],
      },
    ]);
  }

  function scrollToGuidedStep(step: number) {
    window.setTimeout(() => {
      document
        .getElementById(guidedStepSections[step] ?? "command")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  }

  function handleSelectAccount(accountName: string) {
    setSelectedAccountName(accountName);
    setAccountAnalysis(null);
    setLeads([]);
    setSequence(null);
    setReplyAnalysis(null);
    setMeetingCreated(false);
    setDiscoveryBrief(null);
    setProposal(null);
    setActiveStage(pipelineStages[0]);
    setAgentMessages([]);
    setGuidedStepIndex(null);
    setBusinessCaseVisible(false);
  }

  async function analyzeAccount(accountName = selectedAccountName) {
    const account = getAccount(accountName);
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

      setAiMode(result.mode);
      setAccountAnalysis(result.data);
      setActiveStage("Cible identifiée");
      addEvent(
        "Compte analysé",
        `${account.name} scoré ${result.data.score}/100. Priorité ${result.data.priority}.`,
        "agent",
      );
    } catch {
      setAppError("Impossible d’analyser le compte pour le moment.");
    } finally {
      setLoadingAction(null);
    }
  }

  function createLeads(accountName = selectedAccountName) {
    const nextLeads = buildDemoLeads(accountName);
    setLeads(nextLeads);
    setActiveStage("Contact enrichi");
    addEvent(
      "Contacts ajoutés",
      `${nextLeads.length} contacts fictifs démo créés pour ${accountName}.`,
      "crm",
    );
  }

  function createInCrm(accountName = selectedAccountName) {
    setActiveStage("Contact enrichi");
    addEvent("Organisation créée", `${accountName} créé dans CRM Pipeline simulé.`, "crm");
    addEvent("Deal créé", `Deal pilote terrain ouvert pour ${accountName}.`, "crm");
    addEvent("Note IA ajoutée", "Fit Urban Circus, angles QHSE/Achats et objections probables loggés.", "agent");
    addEvent("Activité de relance créée", "Relance J+3 ajoutée dans le CRM simulé.", "crm");
  }

  function assignSalesRep() {
    addEvent(
      "Commercial assigné",
      `${selectedSalesRep} assigné au deal ${selectedAccountName}.`,
      "crm",
    );
  }

  async function generateSequence({
    accountName = selectedAccountName,
    persona = sequencePersona,
    objective = sequenceObjective,
    tone = sequenceTone,
  } = {}) {
    setLoadingAction("sequence");
    setAppError(null);

    try {
      const result = await postAi<Sequence>("/api/ai/sequence", {
        accountName,
        persona,
        objective,
        tone,
      });

      setAiMode(result.mode);
      setSequence(result.data);
      setActiveStage("Séquence lancée");
      addEvent(
        "Séquence préparée",
        `${result.data.sequenceName} générée pour ${persona}.`,
        "outbound",
      );
    } catch {
      setAppError("Impossible de générer la séquence pour le moment.");
    } finally {
      setLoadingAction(null);
    }
  }

  function simulateOutboundSend() {
    setActiveStage("Séquence lancée");
    addEvent("Email envoyé", "Simulation d’envoi vers outbound tool, aucun message réel envoyé.", "outbound");
  }

  async function analyzeReply(reply = replyText, accountName = selectedAccountName) {
    setLoadingAction("reply");
    setAppError(null);

    try {
      const result = await postAi<ReplyAnalysis>("/api/ai/reply-analysis", {
        accountName,
        reply,
      });

      setAiMode(result.mode);
      setReplyAnalysis(result.data);
      setActiveStage("Réponse reçue");
      addEvent(
        result.data.temperature === "Chaud" ? "Réponse chaude détectée" : "Réponse détectée",
        `Température ${result.data.temperature}. Action recommandée : ${result.data.recommendedNextAction}`,
        "agent",
      );
    } catch {
      setAppError("Impossible d’analyser la réponse prospect pour le moment.");
    } finally {
      setLoadingAction(null);
    }
  }

  async function generateDiscoveryBrief(accountName = selectedAccountName) {
    setLoadingAction("discovery");
    setAppError(null);

    try {
      const result = await postAi<DiscoveryBrief>("/api/ai/discovery-brief", {
        accountName,
        persona: discoveryPersona,
        context: discoveryContext,
        notes: discoveryNotes,
      });

      setAiMode(result.mode);
      setDiscoveryBrief(result.data);
      addEvent(
        "Brief découverte généré",
        `Brief découverte généré pour ${accountName}.`,
        "agent",
      );
    } catch {
      setAppError("Impossible de générer le brief découverte pour le moment.");
    } finally {
      setLoadingAction(null);
    }
  }

  async function createMeeting(accountName = selectedAccountName, autoBrief = true) {
    setMeetingCreated(true);
    setActiveStage("RDV découverte");
    addEvent("RDV proposé", `${selectedRepLabel()} proposé sur ${selectedSlot}.`, "calendar");
    addEvent("RDV créé", `Invitation calendrier simulée pour ${selectedSlot}.`, "calendar");
    addEvent("Étape pipeline mise à jour", "Pipeline passé à RDV découverte planifié.", "crm");
    if (autoBrief) {
      await generateDiscoveryBrief(accountName);
    }
  }

  function structureFieldNotes() {
    setStructuredFieldNotes({
      summary:
        "La visite terrain confirme un besoin de dotation technique personnalisée pour équipes exposées à la pluie, aux interventions nocturnes et aux mouvements répétés.",
      technicalConstraints: [
        "Visibilité jour/nuit prioritaire",
        "Protection pluie et confort thermique",
        "Poches accessibles sans gêner les gestes métier",
        "Logo client visible avec sobriété",
        "Durabilité au lavage fréquent",
      ],
      recommendedProducts: [
        "Veste visibilité renforcée",
        "Protection pluie",
        "Couche thermique",
        "Pack pilote terrain",
      ],
      risks: [
        "Adoption faible si coupe ou tailles mal calibrées",
        "Validation QHSE nécessaire avant extension",
        "Déploiement multi-sites à séquencer",
      ],
      proposalInputs: [
        "Pilote 40 collaborateurs",
        "Extension cible 350 collaborateurs",
        "Retours terrain structurés",
        "Préparation contrat cadre multi-sites",
      ],
    });
    setActiveStage("Visite terrain");
    addEvent("Note IA ajoutée", "Notes terrain structurées pour préparer la proposition.", "agent");
  }

  async function generateProposal(accountName = selectedAccountName) {
    setLoadingAction("proposal");
    setAppError(null);

    try {
      const result = await postAi<Proposal>("/api/ai/proposal", {
        accountName,
        notes: proposalNotes,
      });

      setAiMode(result.mode);
      setProposal(result.data);
      setActiveStage("Proposition envoyée");
      addEvent("Proposition pilote préparée", "Proposition pilote et plan de relance générés.", "agent");
    } catch {
      setAppError("Impossible de préparer la proposition pour le moment.");
    } finally {
      setLoadingAction(null);
    }
  }

  function selectedRepLabel() {
    return `${selectedSalesRep} — ${salesReps.find((rep) => rep.name === selectedSalesRep)?.focus ?? "commercial"}`;
  }

  function resetVinciScenario() {
    setTimeline(initialTimeline);
    setSelectedAccountName("VINCI Energies");
    setAccountAnalysis(null);
    setLeads([]);
    setSequence(null);
    setReplyAnalysis(null);
    setSequencePersona("Responsable QHSE");
    setSequenceObjective("obtenir rendez-vous découverte");
    setSequenceTone("consultatif");
    setDiscoveryPersona("Responsable QHSE");
    setReplyText(prospectReplies[0].body);
    setMeetingCreated(false);
    setDiscoveryBrief(null);
    setProposal(null);
    setStructuredFieldNotes(null);
    setActiveStage(pipelineStages[0]);
    setAgentMessages([]);
    setGuidedStepIndex(null);
    setBusinessCaseVisible(false);
  }

  function resetDemo() {
    resetVinciScenario();
    window.setTimeout(() => {
      document
        .getElementById("command")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  }

  async function executeGuidedStep(step: number) {
    setAppError(null);

    if (step === 0) {
      setActiveStage("Cible identifiée");
      addAgentMessage(
        step,
        guidedSteps[step],
        "L’agent sélectionne VINCI Energies et lance l’analyse de fit Urban Circus : équipes terrain, météo, sécurité, visibilité et potentiel multi-sites.",
      );
      addEvent("Démo guidée démarrée", "VINCI Energies sélectionné pour le parcours commercial.", "agent");
      await analyzeAccount("VINCI Energies");
    } else if (step === 1) {
      const analysis = accountAnalysis ?? mockAccountAnalysis("VINCI Energies");
      setAccountAnalysis(analysis);
      setActiveStage("Cible identifiée");
      addAgentMessage(
        step,
        guidedSteps[step],
        "Score 91/100 : le potentiel est porté par les équipes terrain exposées, la répétition multi-sites et une trajectoire pilote → contrat cadre.",
      );
      addEvent(
        "Score et potentiel contrat cadre",
        "Potentiel estimé : pilote 12–18 k€, régional 60–110 k€, contrat cadre 250 k€+.",
        "agent",
      );
    } else if (step === 2) {
      setActiveStage("Contact enrichi");
      addAgentMessage(
        step,
        guidedSteps[step],
        "L’agent priorise le binôme QHSE / Achats, puis ajoute Opérations comme sponsor terrain pour sécuriser le pilote.",
      );
      addEvent(
        "Décideurs mappés",
        "QHSE, Achats, Opérations et Dotation identifiés comme comité d’achat prioritaire.",
        "agent",
      );
    } else if (step === 3) {
      createLeads("VINCI Energies");
      addAgentMessage(
        step,
        guidedSteps[step],
        "La liste de leads fictifs démo est créée avec angles d’approche par persona. Aucun vrai contact privé n’est généré.",
      );
    } else if (step === 4) {
      setSequencePersona("Responsable QHSE");
      setActiveStage("Séquence lancée");
      addAgentMessage(
        step,
        guidedSteps[step],
        "La séquence QHSE met en avant visibilité, sécurité, confort météo et pilote 40 collaborateurs avant déploiement.",
      );
      await generateSequence({
        accountName: "VINCI Energies",
        persona: "Responsable QHSE",
        objective: "obtenir rendez-vous découverte",
        tone: "consultatif",
      });
    } else if (step === 5) {
      const warmReply = prospectReplies[0].body;
      setReplyText(warmReply);
      setActiveStage("Réponse reçue");
      addAgentMessage(
        step,
        guidedSteps[step],
        "Une réponse chaude est simulée : le prospect mentionne un renouvellement de dotation et demande plus d’informations.",
      );
      addEvent("Réponse chaude détectée", "Le prospect signale un chantier de renouvellement de dotation.", "outbound");
    } else if (step === 6) {
      setActiveStage("Réponse reçue");
      addAgentMessage(
        step,
        guidedSteps[step],
        "L’agent classe l’intention comme chaude et prépare une réponse orientée rendez-vous découverte, sans envoi réel.",
      );
      await analyzeReply(prospectReplies[0].body, "VINCI Energies");
    } else if (step === 7) {
      setSelectedSalesRep("Clara");
      setSelectedSlot("Mercredi 14h00");
      setActiveStage("Réponse reçue");
      addAgentMessage(
        step,
        guidedSteps[step],
        "Clara est recommandée pour son focus infrastructure / comptes terrain. Le créneau Mercredi 14h00 est proposé.",
      );
      addEvent("RDV proposé", "Clara — Mercredi 14h00 proposé au prospect en simulation.", "calendar");
    } else if (step === 8) {
      setSelectedSalesRep("Clara");
      setSelectedSlot("Mercredi 14h00");
      setActiveStage("RDV découverte");
      addAgentMessage(
        step,
        guidedSteps[step],
        "Le rendez-vous est créé dans le calendrier simulé. Invitation et activité CRM sont préparées, sans appel Google Calendar réel.",
      );
      await createMeeting("VINCI Energies", false);
    } else if (step === 9) {
      addAgentMessage(
        step,
        guidedSteps[step],
        "L’organisation, le deal, les notes IA et les prochaines activités sont loggés dans le CRM simulé pour garder Pipedrive propre.",
      );
      createInCrm("VINCI Energies");
      setActiveStage("RDV découverte");
    } else if (step === 10) {
      setActiveStage("RDV découverte");
      addAgentMessage(
        step,
        guidedSteps[step],
        "Le brief découverte prépare les questions sur volumes, météo, visibilité, tailles, sites, budget, calendrier achat et décisionnaires.",
      );
      await generateDiscoveryBrief("VINCI Energies");
    } else if (step === 11) {
      setActiveStage("Proposition envoyée");
      addAgentMessage(
        step,
        guidedSteps[step],
        "La proposition pilote est structurée autour de 40 collaborateurs, avec extension vers 350 techniciens et trajectoire contrat cadre.",
      );
      await generateProposal("VINCI Energies");
      setBusinessCaseVisible(true);
    }

    setGuidedStepIndex(step);
    scrollToGuidedStep(step);
  }

  async function startGuidedDemo() {
    resetVinciScenario();
    setGuidedStepIndex(null);
    await executeGuidedStep(0);
  }

  async function nextGuidedStep() {
    const nextStep = guidedStepIndex === null ? 0 : guidedStepIndex + 1;

    if (nextStep >= guidedSteps.length) {
      addAgentMessage(
        guidedSteps.length,
        "Démo guidée terminée",
        "Le scénario VINCI Energies est prêt pour discussion : fit, leads, séquence, réponse chaude, RDV, CRM, brief et proposition pilote.",
      );
      setGuidedStepIndex(null);
      setBusinessCaseVisible(true);
      window.setTimeout(() => {
        document
          .getElementById("business-case")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
      return;
    }

    await executeGuidedStep(nextStep);
  }

  function loadFullVinciScenario() {
    const analysis = mockAccountAnalysis("VINCI Energies");
    const nextLeads = buildDemoLeads("VINCI Energies");
    const nextSequence = mockSequence(
      "VINCI Energies",
      "Responsable QHSE",
      "obtenir rendez-vous découverte",
      "consultatif",
    );
    const nextReplyAnalysis = mockReplyAnalysis("VINCI Energies", prospectReplies[0].body);
    const nextBrief = mockDiscoveryBrief("VINCI Energies", "Responsable QHSE");
    const nextProposal = mockProposal("VINCI Energies");

    setSelectedAccountName("VINCI Energies");
    setAccountAnalysis(analysis);
    setLeads(nextLeads);
    setSequencePersona("Responsable QHSE");
    setSequenceObjective("obtenir rendez-vous découverte");
    setSequenceTone("consultatif");
    setSequence(nextSequence);
    setReplyText(prospectReplies[0].body);
    setReplyAnalysis(nextReplyAnalysis);
    setSelectedSalesRep("Clara");
    setSelectedSlot("Mercredi 14h00");
    setMeetingCreated(true);
    setDiscoveryPersona("Responsable QHSE");
    setDiscoveryBrief(nextBrief);
    setProposal(nextProposal);
    setStructuredFieldNotes({
      summary:
        "La visite terrain confirme un besoin pilote sur techniciens exposés pluie/nuit avant extension multi-sites.",
      technicalConstraints: [
        "Visibilité jour/nuit",
        "Protection pluie et confort thermique",
        "Personnalisation logo",
        "Tailles et morphologies variées",
      ],
      recommendedProducts: [
        "Veste visibilité renforcée",
        "Protection pluie",
        "Couche thermique",
        "Pack pilote terrain",
      ],
      risks: ["Validation QHSE", "Référencement fournisseur", "Déploiement multi-sites"],
      proposalInputs: ["Pilote 40 collaborateurs", "Extension 350 collaborateurs", "Contrat cadre multi-sites"],
    });
    setActiveStage("Proposition envoyée");
    setGuidedStepIndex(guidedSteps.length - 1);
    setBusinessCaseVisible(true);
    setAgentMessages(
      guidedSteps.map((step, index) => ({
        id: `loaded-${index}`,
        step: index,
        title: step,
        body:
          index === 0
            ? "Analyse VINCI Energies chargée avec score, besoin probable et prochaine action."
            : index === 11
              ? "Proposition pilote 40 collaborateurs prête, avec extension 350 collaborateurs et relances."
              : "Étape du scénario VINCI Energies préremplie pour une démo fluide.",
        gain: guidedStepGains[index],
      })),
    );
    setTimeline([
      {
        id: "loaded-proposal",
        label: "Proposition pilote préparée",
        detail: "Pilote 40 collaborateurs et extension 350 techniciens structurés.",
        timestamp: nowLabel(),
        tone: "agent",
      },
      {
        id: "loaded-brief",
        label: "Brief découverte généré",
        detail: "Questions, risques, signaux d’achat et handoff expert terrain prêts.",
        timestamp: nowLabel(),
        tone: "agent",
      },
      {
        id: "loaded-note",
        label: "Note IA ajoutée",
        detail: "Fit Urban Circus, objections et prochaine action loggés.",
        timestamp: nowLabel(),
        tone: "agent",
      },
      {
        id: "loaded-meeting",
        label: "RDV créé",
        detail: "Clara — Mercredi 14h00. Invitation calendrier simulée.",
        timestamp: nowLabel(),
        tone: "calendar",
      },
      {
        id: "loaded-reply",
        label: "Réponse chaude détectée",
        detail: "Renouvellement de dotation identifié dans la réponse prospect.",
        timestamp: nowLabel(),
        tone: "outbound",
      },
      {
        id: "loaded-sequence",
        label: "Séquence préparée",
        detail: "Séquence Responsable QHSE générée avec 6 étapes multicanales.",
        timestamp: nowLabel(),
        tone: "outbound",
      },
      {
        id: "loaded-deal",
        label: "Deal créé",
        detail: "Deal pilote terrain ouvert dans CRM Pipeline simulé.",
        timestamp: nowLabel(),
        tone: "crm",
      },
      {
        id: "loaded-contacts",
        label: "Contacts ajoutés",
        detail: "7 contacts fictifs démo créés et marqués comme tels.",
        timestamp: nowLabel(),
        tone: "crm",
      },
      {
        id: "loaded-org",
        label: "Organisation créée",
        detail: "VINCI Energies créé dans le CRM simulé.",
        timestamp: nowLabel(),
        tone: "crm",
      },
      {
        id: "loaded-account",
        label: "Compte analysé",
        detail: "VINCI Energies scoré 91/100, priorité Très haute.",
        timestamp: nowLabel(),
        tone: "agent",
      },
      initialTimeline[0],
    ]);
    window.setTimeout(() => {
      document
        .getElementById("command")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <MobileNav aiModeLabel={aiModeLabel} />
      <div className="flex">
        <Sidebar aiModeLabel={aiModeLabel} />
        <main className="min-w-0 flex-1">
          <div className="mx-auto grid max-w-[1680px] gap-6 px-4 py-6 sm:px-6 lg:px-8 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className={`flex min-w-0 flex-col ${presentationMode ? "gap-8" : "gap-10"}`}>
              <CommandCenter
                aiModeLabel={aiModeLabel}
                guidedActive={guidedActive}
                guidedLoading={guidedLoading}
                guidedProgress={guidedProgress}
                guidedStep={guidedStepIndex}
                guidedStepTotal={guidedSteps.length}
                guidedGain={
                  guidedStepIndex === null
                    ? "Une démonstration prête à dérouler sans état vide."
                    : guidedStepGains[guidedStepIndex]
                }
                guidedStepLabel={
                  guidedStepIndex === null ? "Scénario guidé prêt" : guidedSteps[guidedStepIndex]
                }
                agentMessages={agentMessages}
                presentationMode={presentationMode}
                onTogglePresentation={() => setPresentationMode((current) => !current)}
                onLoadFullScenario={loadFullVinciScenario}
                onResetDemo={resetDemo}
                onStartGuidedDemo={startGuidedDemo}
                onNextGuidedStep={nextGuidedStep}
              />

              {appError ? (
                <Alert className="border-red-200 bg-red-50 text-red-950">
                  <AlertCircle className="text-red-700" />
                  <AlertTitle>Action interrompue</AlertTitle>
                  <AlertDescription>{appError}</AlertDescription>
                </Alert>
              ) : null}

              <BeforeAfterSection presentationMode={presentationMode} />

              <AccountIntelligence
                accounts={demoAccounts}
                selectedAccount={selectedAccount}
                selectedAccountName={selectedAccountName}
                analysis={accountAnalysis}
                loading={loadingAction === "account"}
                presentationMode={presentationMode}
                onSelectAccount={handleSelectAccount}
                onAnalyze={() => analyzeAccount()}
              />

              <BuyingCommittee
                accountName={selectedAccountName}
                personas={buyingPersonas}
                leads={leads}
                onCreateLeads={() => createLeads()}
              />

              <LeadListBuilder
                leads={leads}
                salesReps={salesReps}
                selectedSalesRep={selectedSalesRep}
                onSelectSalesRep={setSelectedSalesRep}
                onCreateInCrm={() => createInCrm()}
                onPrepareSequence={() => generateSequence()}
                onAssignSalesRep={assignSalesRep}
              />

              <SequenceStudio
                accountName={selectedAccountName}
                persona={sequencePersona}
                objective={sequenceObjective}
                tone={sequenceTone}
                sequence={sequence}
                loading={loadingAction === "sequence"}
                onPersonaChange={setSequencePersona}
                onObjectiveChange={setSequenceObjective}
                onToneChange={setSequenceTone}
                onGenerate={() => generateSequence()}
                onSimulateSend={simulateOutboundSend}
              />

              <ReplyIntelligence
                replies={prospectReplies}
                replyText={replyText}
                analysis={replyAnalysis}
                loading={loadingAction === "reply"}
                onReplyTextChange={setReplyText}
                onSelectReply={setReplyText}
                onAnalyze={() => analyzeReply()}
              />

              <MeetingBooker
                salesReps={salesReps}
                slots={calendarSlots}
                selectedRep={selectedSalesRep}
                selectedSlot={selectedSlot}
                meetingCreated={meetingCreated}
                briefGenerated={Boolean(discoveryBrief)}
                onSelectRep={setSelectedSalesRep}
                onSelectSlot={setSelectedSlot}
                onCreateMeeting={() => createMeeting()}
              />

              {!presentationMode ? (
                <CrmPanel timeline={timeline} stages={pipelineStages} activeStage={activeStage} />
              ) : null}

              <DiscoveryBriefSection
                accountName={selectedAccountName}
                persona={discoveryPersona}
                context={discoveryContext}
                notes={discoveryNotes}
                brief={discoveryBrief}
                loading={loadingAction === "discovery"}
                onPersonaChange={setDiscoveryPersona}
                onContextChange={setDiscoveryContext}
                onNotesChange={setDiscoveryNotes}
                onGenerate={() => generateDiscoveryBrief()}
              />

              {!presentationMode ? (
                <FieldVisitAssistant
                  notes={fieldNotes}
                  structuredNotes={structuredFieldNotes}
                  onNotesChange={setFieldNotes}
                  onStructureNotes={structureFieldNotes}
                />
              ) : null}

              <ProposalAssistant
                accountName={selectedAccountName}
                notes={proposalNotes}
                proposal={proposal}
                loading={loadingAction === "proposal"}
                onNotesChange={setProposalNotes}
                onGenerate={() => generateProposal()}
              />

              <BusinessCaseCard visible={businessCaseVisible} />
            </div>

            <div className="hidden xl:block">
              <div className="sticky top-6">
                <LiveTimeline events={timeline} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
