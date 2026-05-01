# Urban Circus — Agent IA B2B Grands Comptes

Démo SaaS premium en français pour présenter un cockpit commercial IA destiné à l’équipe B2B Urban Circus.

L’application montre comment un agent IA peut aider à identifier des comptes grands comptes, mapper les interlocuteurs, créer des leads fictifs, préparer une séquence outbound, analyser les réponses prospects, proposer un rendez-vous, logger les actions dans un CRM simulé, préparer la visite découverte, structurer une visite terrain et préparer une proposition commerciale.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React
- Framer Motion
- Zod
- OpenAI Node SDK
- ESLint

## Installation

```bash
npm install
```

## Variables d’environnement

Copier `.env.example` vers `.env.local` et renseigner la clé si disponible :

```bash
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
```

Aucune clé réelle n’est incluse dans le code.

## Lancement local

```bash
npm run dev
```

Puis ouvrir `http://localhost:3000`.

## Mode OpenAI

Si `OPENAI_API_KEY` est présente, les routes API server-side appellent OpenAI avec des sorties structurées validées par Zod.

Routes IA :

- `/api/ai/account-analysis`
- `/api/ai/sequence`
- `/api/ai/reply-analysis`
- `/api/ai/discovery-brief`
- `/api/ai/proposal`

## Mode fallback mock

Si aucune clé OpenAI n’est disponible, la démo fonctionne quand même avec des réponses mockées réalistes. L’interface affiche un badge discret “Mode démo local”.

## Limites V1

- Pas de base de données
- Pas de scraping réel
- Pas d’envoi email, SMS, WhatsApp ou LinkedIn réel
- Pas d’appel réel à Pipedrive, Lemlist ou Google Calendar
- Contacts fictifs uniquement, explicitement marqués “démo”
- État local React uniquement

## Intégrations V2 possibles

- Pipedrive API : organisations, personnes, deals, activités, notes
- Lemlist API ou outil outbound équivalent : création de campagnes, étapes, statuts
- Google Calendar API : disponibilité réelle, création d’événements, invitations
- Enrichissement comptes depuis sources autorisées
- Authentification commerciale et rôles
- Historique persistant par compte et deal
- Mesure de performance outbound et pipeline
