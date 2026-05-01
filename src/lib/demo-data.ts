import type {
  AccountAnalysis,
  DiscoveryBrief,
  Priority,
  Proposal,
  ReplyAnalysis,
  Sequence,
} from "@/lib/ai-schemas";

export type DemoAccount = {
  name: string;
  sector: string;
  estimatedSize: string;
  fieldTeams: string;
  probableNeed: string;
  potential: string;
  signal: string;
};

export type BuyingPersona = {
  title: string;
  roleInDecision: string;
  angle: string;
  likelyObjections: string;
  recommendedChannel: string;
  priority: Priority;
};

export type DemoLead = {
  id: string;
  contact: string;
  persona: string;
  account: string;
  priority: Priority;
  recommendedChannel: string;
  angle: string;
  crmStatus: string;
};

export type SalesRep = {
  name: string;
  focus: string;
  availability: string;
};

export type ProspectReply = {
  id: string;
  label: string;
  body: string;
};

export type CrmEvent = {
  id: string;
  label: string;
  detail: string;
  timestamp: string;
  tone: "agent" | "crm" | "outbound" | "calendar";
};

export type FinancialPotential = {
  pilot: string;
  regionalRollout: string;
  frameworkContract: string;
};

export const demoAccounts: DemoAccount[] = [
  {
    name: "VINCI Energies",
    sector: "Infrastructure, énergie et maintenance multi-sites",
    estimatedSize: "Grand compte, plusieurs milliers de collaborateurs terrain",
    fieldTeams: "Techniciens maintenance, équipes chantier, responsables d’exploitation",
    probableNeed:
      "Dotation technique personnalisée pour équipes exposées à la pluie, au froid et aux interventions visibles.",
    potential: "Très fort potentiel contrat cadre et pilotes régionaux",
    signal: "Multiplicité de sites, métiers terrain et enjeux QHSE.",
  },
  {
    name: "Enedis",
    sector: "Distribution d’électricité",
    estimatedSize: "Très grand compte national",
    fieldTeams: "Techniciens réseau, équipes astreinte, interventions extérieures",
    probableNeed: "Vêtements techniques visibles et confortables pour interventions météo variables.",
    potential: "Contrat cadre national avec exigences sécurité élevées",
    signal: "Forte contrainte de visibilité, sécurité et continuité terrain.",
  },
  {
    name: "Eiffage Route",
    sector: "Construction et entretien routier",
    estimatedSize: "Grand compte avec agences régionales",
    fieldTeams: "Chefs de chantier, équipes travaux, conducteurs d’engins",
    probableNeed: "Vêtements résistants, visibles et personnalisés pour chantiers extérieurs.",
    potential: "Pilotes par agence puis extension multi-sites",
    signal: "Exposition météo et mouvements fréquents sur chantier.",
  },
  {
    name: "Bouygues Construction",
    sector: "Construction et grands projets",
    estimatedSize: "Grand compte international",
    fieldTeams: "Conducteurs travaux, compagnons, encadrement chantier",
    probableNeed: "Dotations chantier premium avec image de marque, sécurité et confort thermique.",
    potential: "Fort potentiel sur lots pilotes et grands chantiers",
    signal: "Image employeur et adoption terrain importantes.",
  },
  {
    name: "SNCF Réseau",
    sector: "Infrastructure ferroviaire",
    estimatedSize: "Très grand compte national",
    fieldTeams: "Maintenance voie, signalisation, interventions nuit",
    probableNeed: "Visibilité jour/nuit, résistance pluie et contraintes sécurité ferroviaire.",
    potential: "Potentiel élevé si pilote QHSE validé",
    signal: "Interventions nocturnes et conditions météo exigeantes.",
  },
  {
    name: "RATP Maintenance",
    sector: "Transport urbain et maintenance",
    estimatedSize: "Grand compte francilien",
    fieldTeams: "Maintenance matériel, infrastructure, équipes atelier et terrain",
    probableNeed: "Vêtements robustes, respirants et personnalisés pour maintenance intensive.",
    potential: "Moyen à fort selon périmètre atelier/terrain",
    signal: "Contraintes de durabilité et lavage récurrent.",
  },
  {
    name: "Keolis",
    sector: "Mobilité et exploitation transport",
    estimatedSize: "Grand compte multi-réseaux",
    fieldTeams: "Contrôleurs, maintenance, exploitation terrain",
    probableNeed: "Équipement visibilité, confort et image de marque pour équipes terrain.",
    potential: "Fort potentiel réseau par réseau",
    signal: "Déploiement multi-sites et saisonnalité hiver.",
  },
  {
    name: "Colas",
    sector: "Routes et matériaux",
    estimatedSize: "Grand compte international",
    fieldTeams: "Équipes travaux routiers, carrières, maintenance",
    probableNeed: "Vêtements haute visibilité, résistants et adaptés aux variations météo.",
    potential: "Fort potentiel sur pilotes régionaux",
    signal: "Sécurité chantier et confort en extérieur.",
  },
  {
    name: "Veolia Eau",
    sector: "Services environnementaux et eau",
    estimatedSize: "Grand compte national",
    fieldTeams: "Techniciens eau, assainissement, interventions urgence",
    probableNeed: "Protection pluie, visibilité, poches métiers et personnalisation groupe.",
    potential: "Fort potentiel multi-sites",
    signal: "Équipes mobiles exposées aux intempéries.",
  },
  {
    name: "Suez",
    sector: "Eau, déchets et environnement",
    estimatedSize: "Grand compte multi-métiers",
    fieldTeams: "Techniciens terrain, exploitation, maintenance",
    probableNeed: "Dotation technique durable, visible et adaptée aux usages métier.",
    potential: "Moyen à fort selon entité métier",
    signal: "Enjeux QHSE et durabilité.",
  },
  {
    name: "Engie",
    sector: "Énergie, services et maintenance",
    estimatedSize: "Très grand compte",
    fieldTeams: "Techniciens énergie, maintenance, équipes intervention",
    probableNeed: "Vêtements personnalisés confort thermique, pluie et mobilité.",
    potential: "Très fort potentiel contrats cadres",
    signal: "Large base terrain et besoins saisonniers.",
  },
];

export const urbanCircusCapabilities = [
  "Vêtement technique personnalisé",
  "Veste visibilité renforcée",
  "Couche thermique",
  "Protection pluie",
  "Dotation collaborateurs terrain",
  "Personnalisation logo",
  "Pack pilote terrain",
  "Contrat cadre multi-sites",
  "Équipement mobilité / sécurité",
  "Kit saison hiver",
];

export const salesReps: SalesRep[] = [
  { name: "Quentin", focus: "grands comptes", availability: "Mardi 10h30" },
  { name: "Clara", focus: "infrastructure / comptes terrain", availability: "Mercredi 14h00" },
  { name: "Paul", focus: "partenariats et offres personnalisées", availability: "Jeudi 11h00" },
];

export const calendarSlots = ["Mardi 10h30", "Mercredi 14h00", "Jeudi 11h00", "Vendredi 09h30"];

export const pipelineStages = [
  "Cible identifiée",
  "Contact enrichi",
  "Séquence lancée",
  "Réponse reçue",
  "RDV découverte",
  "Visite terrain",
  "Proposition envoyée",
  "Négociation",
  "Contrat signé",
];

export const prospectReplies: ProspectReply[] = [
  {
    id: "chaud",
    label: "Réponse chaude",
    body: "Bonjour, sujet intéressant. Nous avons justement un chantier de renouvellement de dotation pour certaines équipes terrain. Vous pouvez me transmettre plus d’informations ?",
  },
  {
    id: "budget",
    label: "Objection budget",
    body: "Merci, mais nous avons déjà un fournisseur référencé et peu de budget cette année.",
  },
  {
    id: "interlocuteur",
    label: "Mauvais interlocuteur",
    body: "Bonjour, ce sujet est plutôt géré par notre direction achats / QHSE.",
  },
  {
    id: "timing",
    label: "Timing futur",
    body: "Le sujet pourrait nous intéresser pour la prochaine saison hiver, mais pas avant septembre.",
  },
];

export const buyingPersonas: BuyingPersona[] = [
  {
    title: "Responsable Achats",
    roleInDecision: "Cadre la consultation, les fournisseurs référencés et les conditions contractuelles.",
    angle: "Réduire le risque fournisseur avec un pilote mesurable puis une extension multi-sites.",
    likelyObjections: "Référencement existant, prix unitaire, calendrier achat.",
    recommendedChannel: "Email court + appel",
    priority: "Très haute",
  },
  {
    title: "Responsable QHSE",
    roleInDecision: "Évalue sécurité, visibilité, conformité terrain et adoption par les équipes.",
    angle: "Visibilité renforcée, confort météo et réduction des irritants terrain.",
    likelyObjections: "Normes internes, validation terrain, preuves d’usage.",
    recommendedChannel: "Email personnalisé + LinkedIn",
    priority: "Très haute",
  },
  {
    title: "Responsable RH",
    roleInDecision: "Porte l’expérience collaborateur, les dotations et l’image employeur.",
    angle: "Améliorer l’adoption des dotations et la perception de qualité par les équipes.",
    likelyObjections: "Tailles, renouvellement, logistique de distribution.",
    recommendedChannel: "Email consultatif",
    priority: "Haute",
  },
  {
    title: "Directeur Opérationnel",
    roleInDecision: "Arbitre l’impact terrain, les sites pilotes et les contraintes d’exploitation.",
    angle: "Pilote rapide sur équipes exposées pour valider confort, résistance et visibilité.",
    likelyObjections: "Disponibilité équipes, changement d’habitudes, complexité multi-sites.",
    recommendedChannel: "Appel après signal chaud",
    priority: "Haute",
  },
  {
    title: "Responsable RSE",
    roleInDecision: "Challenge durabilité, cycle de vie, cohérence marque et achats responsables.",
    angle: "Dotation durable, meilleure adoption et réduction du gaspillage lié aux vêtements peu portés.",
    likelyObjections: "Traçabilité, durabilité prouvée, compromis coût/impact.",
    recommendedChannel: "Email ciblé",
    priority: "Moyenne",
  },
  {
    title: "Responsable Dotation / Équipements",
    roleInDecision: "Gère tailles, distribution, renouvellement et retours d’usage.",
    angle: "Simplifier le déploiement pilote, capturer les tailles et préparer l’extension.",
    likelyObjections: "Gestion des tailles, stocks, retours terrain.",
    recommendedChannel: "Email + appel opérationnel",
    priority: "Haute",
  },
  {
    title: "Responsable Prévention / Sécurité",
    roleInDecision: "Influence les critères sécurité, visibilité et contraintes QHSE.",
    angle: "Sécuriser les interventions extérieures avec visibilité jour/nuit et protection météo.",
    likelyObjections: "Homologations internes, résistance, lavage industriel.",
    recommendedChannel: "LinkedIn + email preuve d’usage",
    priority: "Haute",
  },
];

const demoNames = [
  "Claire Martin",
  "Julien Moreau",
  "Sophie Bernard",
  "Nadia Lefevre",
  "Marc Dubois",
  "Camille Petit",
  "Thomas Leroy",
];

export function buildDemoLeads(accountName: string): DemoLead[] {
  return buyingPersonas.slice(0, 7).map((persona, index) => ({
    id: `${accountName}-${index}`,
    contact: `${demoNames[index]} — contact fictif démo`,
    persona: persona.title,
    account: accountName,
    priority: persona.priority,
    recommendedChannel: persona.recommendedChannel,
    angle: persona.angle,
    crmStatus: index < 3 ? "Prêt à créer" : "À valider",
  }));
}

export function getAccount(accountName: string) {
  return demoAccounts.find((account) => account.name === accountName) ?? demoAccounts[0];
}

export function getFinancialPotential(accountName: string): FinancialPotential {
  const highPotential: FinancialPotential = {
    pilot: "12 000 € – 18 000 €",
    regionalRollout: "60 000 € – 110 000 €",
    frameworkContract: "250 000 €+",
  };

  const nationalPotential: FinancialPotential = {
    pilot: "15 000 € – 25 000 €",
    regionalRollout: "80 000 € – 140 000 €",
    frameworkContract: "300 000 €+",
  };

  const standardPotential: FinancialPotential = {
    pilot: "8 000 € – 15 000 €",
    regionalRollout: "40 000 € – 80 000 €",
    frameworkContract: "150 000 €+",
  };

  if (["VINCI Energies", "Bouygues Construction", "Colas"].includes(accountName)) {
    return highPotential;
  }

  if (["Enedis", "SNCF Réseau", "Engie"].includes(accountName)) {
    return nationalPotential;
  }

  return standardPotential;
}

export function mockAccountAnalysis(accountName: string): AccountAnalysis {
  const account = getAccount(accountName);

  return {
    score: account.name === "VINCI Energies" ? 91 : 84,
    priority: account.name === "VINCI Energies" ? "Très haute" : "Haute",
    commercialPotential:
      "Potentiel élevé pour un pilote terrain puis un contrat cadre multi-sites, surtout si le besoin est porté par QHSE et Achats.",
    probableNeed: account.probableNeed,
    teamsConcerned: [
      "Techniciens terrain exposés aux intempéries",
      "Équipes maintenance et intervention",
      "Managers opérationnels multi-sites",
      "Référents QHSE et prévention",
    ],
    recommendedAngle:
      "Positionner Urban Circus comme partenaire de dotation technique personnalisée : visibilité, sécurité, confort thermique et adoption par les collaborateurs terrain.",
    likelyDecisionMakers: [
      "Responsable QHSE",
      "Responsable Achats",
      "Directeur Opérationnel",
      "Responsable Dotation / Équipements",
    ],
    likelyObjections: [
      "Fournisseur déjà référencé",
      "Besoin de preuves terrain avant extension",
      "Contraintes de budget et calendrier achat",
      "Gestion des tailles et déploiement multi-sites",
    ],
    nextBestAction:
      "Créer une liste de leads fictifs QHSE/Achats, générer une séquence consultative et proposer un pilote 40 collaborateurs.",
    suggestedCrmActivity:
      "Créer organisation, deal pilote terrain, note IA de fit Urban Circus et activité de relance J+3.",
  };
}

export function mockSequence(accountName: string, persona: string, objective: string, tone: string): Sequence {
  const qhse = persona.toLowerCase().includes("qhse");

  return {
    sequenceName: `${accountName} — pilote dotation terrain ${persona}`,
    strategicSummary: `Séquence ${tone} orientée ${objective}. L’angle principal relie sécurité, visibilité et confort des équipes terrain, avec une proposition de pilote limité avant extension multi-sites.`,
    steps: [
      {
        day: "J1",
        channel: "Email",
        objective: "Créer une accroche métier crédible",
        subject: qhse
          ? "Pilote visibilité + confort terrain pour vos équipes exposées"
          : "Pilote dotation technique personnalisée pour équipes terrain",
        message: `Bonjour,\n\nJe vous contacte dans un cadre démo Urban Circus : nous aidons les organisations avec équipes terrain à tester des vêtements techniques personnalisés avant déploiement plus large.\n\nPour ${accountName}, l’enjeu semble être de combiner visibilité, sécurité, confort météo et adoption par les collaborateurs.\n\nSeriez-vous ouvert à un échange de 20 minutes pour cadrer un pilote sur une population terrain exposée ?\n\nBien à vous,`,
        commercialLogic:
          "Rester concret, ne pas promettre d’intégration réelle, et introduire le pilote comme risque maîtrisé.",
      },
      {
        day: "J3",
        channel: "LinkedIn",
        objective: "Renforcer la mémorisation",
        subject: "",
        message:
          "Bonjour, je vous ai envoyé une courte note sur un pilote de dotation technique personnalisée pour équipes terrain. L’idée : tester visibilité, pluie/froid et confort avant tout déploiement. Ouvert à un échange rapide ?",
        commercialLogic: "Message court, sans pièce jointe, centré sur l’usage terrain.",
      },
      {
        day: "J5",
        channel: "Email",
        objective: "Donner un cas d’usage opérationnel",
        subject: "Cas d’usage : dotation météo + visibilité sans friction terrain",
        message: `Bonjour,\n\nUn cas fréquent chez les grands comptes terrain : la dotation est conforme sur le papier mais peu portée car inconfortable, mal adaptée à la météo ou insuffisamment personnalisée.\n\nUrban Circus peut cadrer un pack pilote : protection pluie, couche thermique, visibilité renforcée et logo client, avec retours structurés des équipes.\n\nLe bon point d’entrée serait-il QHSE, Achats ou Dotation chez ${accountName} ?`,
        commercialLogic: "Transformer le sujet vêtement en sujet adoption, sécurité et qualité d’exécution.",
      },
      {
        day: "J7",
        channel: "Appel",
        objective: "Qualifier le circuit de décision",
        subject: "",
        message:
          "Script : vérifier le périmètre équipe terrain, la saison concernée, le fournisseur actuel, le calendrier de renouvellement, les critères QHSE, puis proposer un rendez-vous découverte.",
        commercialLogic: "L’appel vise la qualification, pas la vente complète.",
      },
      {
        day: "J10",
        channel: "Email",
        objective: "Proposer un pilote borné",
        subject: "Pilote 40 collaborateurs avant extension multi-sites",
        message:
          "Bonjour,\n\nPour avancer sans mobiliser tout le process achat, nous pouvons cadrer un pilote sur 40 collaborateurs : usages terrain, contraintes météo, visibilité, personnalisation et retours utilisateurs.\n\nSi le sujet est pertinent, je vous propose deux créneaux pour cadrer le besoin et les critères de succès.",
        commercialLogic: "Réduire le risque perçu et préparer le rendez-vous.",
      },
      {
        day: "J14",
        channel: "Email",
        objective: "Clore proprement ou obtenir redirection",
        subject: "Je clos le sujet ou je l’adresse au bon interlocuteur ?",
        message:
          "Bonjour,\n\nJe ne veux pas vous relancer inutilement. Dois-je clore le sujet pour le moment, ou existe-t-il un interlocuteur QHSE/Achats/Dotation plus adapté pour évaluer un pilote terrain Urban Circus ?\n\nMerci,",
        commercialLogic: "Obtenir une redirection ou sortir proprement de la séquence.",
      },
    ],
  };
}

export function mockReplyAnalysis(accountName: string, reply: string): ReplyAnalysis {
  const lowerReply = reply.toLowerCase();
  const isHot = lowerReply.includes("intéressant") || lowerReply.includes("informations") || lowerReply.includes("renouvellement");
  const isBudget = lowerReply.includes("budget") || lowerReply.includes("fournisseur");
  const isTiming = lowerReply.includes("septembre") || lowerReply.includes("hiver");

  if (isHot) {
    return {
      intent: "Intérêt actif avec chantier de renouvellement identifié.",
      temperature: "Chaud",
      recommendedNextAction: "Répondre avec une proposition de rendez-vous découverte et demander le périmètre équipe concerné.",
      proposedReply: `Bonjour,\n\nMerci pour votre retour. Le sujet semble effectivement pertinent si un renouvellement de dotation est en cours.\n\nJe vous propose un échange de 20 minutes pour cadrer le périmètre : équipes concernées, conditions terrain, visibilité, météo, personnalisation et calendrier achat. Nous pourrons ensuite voir si un pilote 40 collaborateurs est adapté.\n\nQuel créneau vous conviendrait cette semaine ?`,
      recommendedCrmStageChange: "Réponse reçue",
      crmActivityToCreate: `Créer activité RDV découverte pour ${accountName}`,
      followUpToSchedule: "Relance J+2 si aucun créneau confirmé",
      recommendedSalesRep: "Clara",
    };
  }

  if (isBudget) {
    return {
      intent: "Objection fournisseur référencé et contrainte budgétaire.",
      temperature: "Tiède",
      recommendedNextAction: "Ne pas pousser la vente. Proposer un benchmark pilote à faible risque pour le prochain cycle achat.",
      proposedReply:
        "Bonjour,\n\nMerci pour votre transparence. L’objectif n’est pas de remplacer un fournisseur en place sans raison, mais d’identifier les cas où un pilote terrain peut améliorer visibilité, confort ou adoption des dotations.\n\nSouhaitez-vous que je vous recontacte avant le prochain cycle budgétaire avec une approche pilote très cadrée ?",
      recommendedCrmStageChange: "Nurturing",
      crmActivityToCreate: "Créer relance pré-budget",
      followUpToSchedule: "Relance dans 90 jours",
      recommendedSalesRep: "Quentin",
    };
  }

  if (isTiming) {
    return {
      intent: "Intérêt futur lié à la saison hiver.",
      temperature: "Tiède",
      recommendedNextAction: "Programmer une relance avant septembre avec angle kit saison hiver.",
      proposedReply:
        "Bonjour,\n\nMerci, c’est noté pour la prochaine saison hiver. Le bon timing serait de cadrer le besoin quelques semaines avant septembre afin de prévoir tailles, sites, météo, personnalisation et pilote éventuel.\n\nJe vous propose de reprendre contact fin août avec une trame de cadrage dédiée.",
      recommendedCrmStageChange: "Relance programmée",
      crmActivityToCreate: "Créer relance saison hiver",
      followUpToSchedule: "Fin août",
      recommendedSalesRep: "Paul",
    };
  }

  return {
    intent: "Redirection probable vers un meilleur interlocuteur.",
    temperature: "Froid",
    recommendedNextAction: "Demander une introduction ou le bon binôme Achats/QHSE.",
    proposedReply:
      "Bonjour,\n\nMerci pour votre retour. Pour éviter de solliciter la mauvaise personne, pouvez-vous m’indiquer l’interlocuteur Achats ou QHSE qui pilote les sujets de dotation technique terrain ?\n\nJe lui écrirai avec un contexte très court et clairement identifié comme demande de qualification.",
    recommendedCrmStageChange: "Contact à enrichir",
    crmActivityToCreate: "Créer tâche recherche interlocuteur QHSE/Achats",
    followUpToSchedule: "Relance J+5",
    recommendedSalesRep: "Clara",
  };
}

export function mockDiscoveryBrief(accountName: string, persona: string): DiscoveryBrief {
  return {
    meetingObjective: `Qualifier le besoin de dotation technique chez ${accountName}, confirmer le circuit ${persona}/Achats/QHSE et décider si un pilote 40 collaborateurs est pertinent.`,
    questionsToAsk: [
      "Combien de collaborateurs terrain seraient concernés à court terme et à terme ?",
      "Quelles conditions dominent : pluie, froid, chaleur, nuit, mobilité, chantier ?",
      "Quels irritants les équipes remontent-elles sur les dotations actuelles ?",
      "Quels critères QHSE sont non négociables pour visibilité et sécurité ?",
      "Quel niveau de personnalisation logo / identité client est attendu ?",
      "Quels sites ou métiers seraient les plus adaptés pour un pilote ?",
      "Quel calendrier achat et quel budget indicatif encadrent le sujet ?",
    ],
    informationToCapture: [
      "Volumes par métier et par site",
      "Tailles, morphologies, contraintes de mouvement",
      "Fournisseur actuel et niveau de satisfaction",
      "Contraintes de lavage, durabilité et stockage",
      "Décisionnaires, influenceurs et process achat",
    ],
    risksToCheck: [
      "Référencement fournisseur verrouillé",
      "Pilote sans sponsor opérationnel",
      "Critères sécurité non clarifiés",
      "Déploiement multi-sites sous-estimé",
    ],
    buyingSignalsToDetect: [
      "Renouvellement déjà planifié",
      "Insatisfaction terrain sur confort ou visibilité",
      "Volonté de tester sur population limitée",
      "Sponsor QHSE ou opérationnel disponible",
    ],
    nextActions: [
      "Envoyer synthèse rendez-vous",
      "Proposer atelier terrain avec expert Urban Circus",
      "Cadrer pack pilote 40 collaborateurs",
      "Logger note IA et prochaine activité CRM",
    ],
    handoffToFieldExpert: [
      "Sites et métiers à observer",
      "Conditions météo prioritaires",
      "Contraintes de visibilité jour/nuit",
      "Contraintes logo, tailles, poches et lavage",
    ],
  };
}

export function mockProposal(accountName: string): Proposal {
  return {
    needSummary:
      "350 techniciens interviennent en extérieur avec besoin de visibilité nuit, protection pluie, confort thermique et personnalisation logo. Le calendrier achat vise septembre avec ouverture possible à un pilote 40 personnes.",
    recommendedOffer:
      "Pack vêtement technique personnalisé Urban Circus : veste visibilité renforcée, protection pluie, couche thermique et personnalisation identité client.",
    pilotProposal:
      `Pilote ${accountName} sur 40 collaborateurs terrain pendant une période météo représentative, avec retours structurés QHSE, confort, mobilité, visibilité et adoption.`,
    rolloutPlan: [
      "Semaine 1 : cadrage métiers, tailles, sites et critères QHSE",
      "Semaines 2-4 : pilote 40 collaborateurs et collecte des retours",
      "Semaine 5 : synthèse terrain et ajustements produit/personnalisation",
      "Extension : déploiement progressif vers 350 collaborateurs puis contrat cadre multi-sites",
    ],
    commercialArguments: [
      "Réduit le risque de déploiement grâce à un pilote mesurable",
      "Améliore sécurité et visibilité sans sacrifier confort terrain",
      "Renforce l’image employeur avec une dotation personnalisée et portée",
      "Prépare un contrat cadre sur bases opérationnelles solides",
    ],
    risksAndObjections: [
      "Budget annuel déjà cadré : proposer pilote hors extension globale",
      "Fournisseur référencé : positionner Urban Circus en test complémentaire",
      "Adoption terrain incertaine : mesurer les retours collaborateurs",
      "Complexité multi-sites : séquencer le déploiement",
    ],
    proposalEmail:
      "Bonjour,\n\nSuite à notre échange, voici une proposition de pilote Urban Circus pour 40 collaborateurs terrain : visibilité nuit, protection pluie, confort thermique et personnalisation logo.\n\nL’objectif est de valider l’usage réel avant extension vers les 350 techniciens concernés et, si les retours sont concluants, préparer un cadre de déploiement multi-sites.\n\nJe vous propose de revoir ensemble le périmètre pilote et les critères de succès cette semaine.\n\nBien à vous,",
    followUpPlan: [
      "J+3 : vérifier réception et proposer deux créneaux",
      "J+7 : relancer avec synthèse des bénéfices pilote",
      "J+14 : demander arbitrage ou redirection vers Achats/QHSE",
    ],
  };
}
