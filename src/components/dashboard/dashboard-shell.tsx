"use client";

import { AlertCircle } from "lucide-react";
import { useMemo, useState } from "react";

import { AccountIntelligence } from "@/components/dashboard/account-intelligence";
import { BuyingCommittee } from "@/components/dashboard/buying-committee";
import { CommandCenter } from "@/components/dashboard/command-center";
import { CrmPanel } from "@/components/dashboard/crm-panel";
import { DiscoveryBriefSection } from "@/components/dashboard/discovery-brief";
import {
  FieldVisitAssistant,
  type StructuredFieldNotes,
} from "@/components/dashboard/field-visit";
import { LeadListBuilder } from "@/components/dashboard/lead-list-builder";
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

  const selectedAccount = useMemo(
    () => getAccount(selectedAccountName),
    [selectedAccountName],
  );

  const aiModeLabel = aiMode === "mock" ? "Mode démo local" : "OpenAI connecté";
  const guidedActive = guidedStepIndex !== null;
  const guidedLoading = loadingAction === "guided";
  const guidedProgress =
    guidedStepIndex === null ? 0 : Math.min(100, Math.round(((guidedStepIndex + 1) / 8) * 100));
  const guidedStepLabels = [
    "VINCI Energies sélectionné. Analyse compte lancée.",
    "Étape suivante : créer les leads fictifs et logger l’organisation dans le CRM.",
    "Étape suivante : générer une séquence QHSE multicanale.",
    "Étape suivante : analyser une réponse chaude simulée.",
    "Étape suivante : créer le RDV calendrier et générer le brief découverte.",
    "Étape suivante : structurer la visite terrain.",
    "Étape suivante : préparer la proposition pilote.",
    "Démo guidée terminée : le deal est prêt pour suivi commercial.",
  ];

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
        "Réponse détectée",
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
        "Note IA ajoutée",
        `Brief découverte généré pour ${accountName}.`,
        "agent",
      );
    } catch {
      setAppError("Impossible de générer le brief découverte pour le moment.");
    } finally {
      setLoadingAction(null);
    }
  }

  async function createMeeting(accountName = selectedAccountName) {
    setMeetingCreated(true);
    setActiveStage("RDV découverte");
    addEvent("RDV proposé", `${selectedRepLabel()} proposé sur ${selectedSlot}.`, "calendar");
    addEvent("RDV créé", `Invitation calendrier simulée pour ${selectedSlot}.`, "calendar");
    addEvent("Étape pipeline mise à jour", "Pipeline passé à RDV découverte planifié.", "crm");
    await generateDiscoveryBrief(accountName);
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
      addEvent("Proposition à préparer", "Proposition pilote et plan de relance générés.", "agent");
    } catch {
      setAppError("Impossible de préparer la proposition pour le moment.");
    } finally {
      setLoadingAction(null);
    }
  }

  function selectedRepLabel() {
    return `${selectedSalesRep} — ${salesReps.find((rep) => rep.name === selectedSalesRep)?.focus ?? "commercial"}`;
  }

  async function startGuidedDemo() {
    setLoadingAction("guided");
    setTimeline(initialTimeline);
    setSelectedAccountName("VINCI Energies");
    setSequencePersona("Responsable QHSE");
    setSequenceObjective("obtenir rendez-vous découverte");
    setSequenceTone("consultatif");
    setDiscoveryPersona("Responsable QHSE");
    setReplyText(prospectReplies[0].body);
    setMeetingCreated(false);
    setProposal(null);
    setStructuredFieldNotes(null);
    setGuidedStepIndex(0);
    addEvent("Démo guidée démarrée", "VINCI Energies sélectionné pour le parcours commercial.", "agent");
    setLoadingAction(null);
    await analyzeAccount("VINCI Energies");
    setGuidedStepIndex(1);
  }

  async function nextGuidedStep() {
    if (guidedStepIndex === null) {
      return;
    }

    setLoadingAction("guided");

    if (guidedStepIndex === 1) {
      createLeads("VINCI Energies");
      createInCrm("VINCI Energies");
      setGuidedStepIndex(2);
    } else if (guidedStepIndex === 2) {
      setSequencePersona("Responsable QHSE");
      await generateSequence({
        accountName: "VINCI Energies",
        persona: "Responsable QHSE",
        objective: "obtenir rendez-vous découverte",
        tone: "consultatif",
      });
      setGuidedStepIndex(3);
    } else if (guidedStepIndex === 3) {
      const warmReply = prospectReplies[0].body;
      setReplyText(warmReply);
      await analyzeReply(warmReply, "VINCI Energies");
      setGuidedStepIndex(4);
    } else if (guidedStepIndex === 4) {
      setSelectedSalesRep("Clara");
      setSelectedSlot("Mercredi 14h00");
      await createMeeting("VINCI Energies");
      setGuidedStepIndex(5);
    } else if (guidedStepIndex === 5) {
      structureFieldNotes();
      setGuidedStepIndex(6);
    } else if (guidedStepIndex === 6) {
      await generateProposal("VINCI Energies");
      setGuidedStepIndex(7);
    } else {
      setGuidedStepIndex(null);
    }

    setLoadingAction(null);
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <MobileNav aiModeLabel={aiModeLabel} />
      <div className="flex">
        <Sidebar aiModeLabel={aiModeLabel} />
        <main className="min-w-0 flex-1">
          <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-6 sm:px-6 lg:px-8">
            <CommandCenter
              aiModeLabel={aiModeLabel}
              guidedActive={guidedActive}
              guidedLoading={guidedLoading}
              guidedProgress={guidedProgress}
              guidedStepLabel={
                guidedStepIndex === null ? "" : guidedStepLabels[guidedStepIndex]
              }
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

            <AccountIntelligence
              accounts={demoAccounts}
              selectedAccount={selectedAccount}
              selectedAccountName={selectedAccountName}
              analysis={accountAnalysis}
              loading={loadingAction === "account"}
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
              onSelectRep={setSelectedSalesRep}
              onSelectSlot={setSelectedSlot}
              onCreateMeeting={() => createMeeting()}
            />

            <CrmPanel timeline={timeline} stages={pipelineStages} activeStage={activeStage} />

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

            <FieldVisitAssistant
              notes={fieldNotes}
              structuredNotes={structuredFieldNotes}
              onNotesChange={setFieldNotes}
              onStructureNotes={structureFieldNotes}
            />

            <ProposalAssistant
              accountName={selectedAccountName}
              notes={proposalNotes}
              proposal={proposal}
              loading={loadingAction === "proposal"}
              onNotesChange={setProposalNotes}
              onGenerate={() => generateProposal()}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
