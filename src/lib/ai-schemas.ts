import { z } from "zod";

export const prioritySchema = z.enum(["Faible", "Moyenne", "Haute", "Très haute"]);
export const temperatureSchema = z.enum(["Froid", "Tiède", "Chaud"]);
export const channelSchema = z.enum(["Email", "LinkedIn", "Appel", "SMS", "WhatsApp"]);

export const accountAnalysisInputSchema = z.object({
  accountName: z.string().min(1),
  sector: z.string().min(1),
  estimatedSize: z.string().min(1),
  fieldTeams: z.string().min(1),
  probableNeed: z.string().min(1),
  potential: z.string().min(1),
});

export const accountAnalysisOutputSchema = z.object({
  score: z.number().min(0).max(100),
  priority: prioritySchema,
  commercialPotential: z.string(),
  probableNeed: z.string(),
  teamsConcerned: z.array(z.string()),
  recommendedAngle: z.string(),
  likelyDecisionMakers: z.array(z.string()),
  likelyObjections: z.array(z.string()),
  nextBestAction: z.string(),
  suggestedCrmActivity: z.string(),
});

export const sequenceInputSchema = z.object({
  accountName: z.string().min(1),
  persona: z.string().min(1),
  objective: z.string().min(1),
  tone: z.string().min(1),
});

export const sequenceStepSchema = z.object({
  day: z.string(),
  channel: channelSchema,
  objective: z.string(),
  subject: z.string(),
  message: z.string(),
  commercialLogic: z.string(),
});

export const sequenceOutputSchema = z.object({
  sequenceName: z.string(),
  strategicSummary: z.string(),
  steps: z.array(sequenceStepSchema).min(5).max(6),
});

export const replyAnalysisInputSchema = z.object({
  accountName: z.string().min(1),
  reply: z.string().min(1),
});

export const replyAnalysisOutputSchema = z.object({
  intent: z.string(),
  temperature: temperatureSchema,
  recommendedNextAction: z.string(),
  proposedReply: z.string(),
  recommendedCrmStageChange: z.string(),
  crmActivityToCreate: z.string(),
  followUpToSchedule: z.string(),
  recommendedSalesRep: z.string(),
});

export const discoveryBriefInputSchema = z.object({
  accountName: z.string().min(1),
  persona: z.string().min(1),
  context: z.string().min(1),
  notes: z.string(),
});

export const discoveryBriefOutputSchema = z.object({
  meetingObjective: z.string(),
  questionsToAsk: z.array(z.string()),
  informationToCapture: z.array(z.string()),
  risksToCheck: z.array(z.string()),
  buyingSignalsToDetect: z.array(z.string()),
  nextActions: z.array(z.string()),
  handoffToFieldExpert: z.array(z.string()),
});

export const proposalInputSchema = z.object({
  accountName: z.string().min(1),
  notes: z.string().min(1),
});

export const proposalOutputSchema = z.object({
  needSummary: z.string(),
  recommendedOffer: z.string(),
  pilotProposal: z.string(),
  rolloutPlan: z.array(z.string()),
  commercialArguments: z.array(z.string()),
  risksAndObjections: z.array(z.string()),
  proposalEmail: z.string(),
  followUpPlan: z.array(z.string()),
});

export type Priority = z.infer<typeof prioritySchema>;
export type Temperature = z.infer<typeof temperatureSchema>;
export type Channel = z.infer<typeof channelSchema>;
export type AccountAnalysis = z.infer<typeof accountAnalysisOutputSchema>;
export type Sequence = z.infer<typeof sequenceOutputSchema>;
export type SequenceStep = z.infer<typeof sequenceStepSchema>;
export type ReplyAnalysis = z.infer<typeof replyAnalysisOutputSchema>;
export type DiscoveryBrief = z.infer<typeof discoveryBriefOutputSchema>;
export type Proposal = z.infer<typeof proposalOutputSchema>;
export type AiMode = "openai" | "mock";

export type ApiEnvelope<T> = {
  data: T;
  mode: AiMode;
  warning?: string;
};
