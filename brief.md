# Brief — Urban Circus Agent IA B2B Grands Comptes

## Contexte Urban Circus

Urban Circus vend des vêtements techniques personnalisés pour entreprises et grands comptes : dotations collaborateurs terrain, visibilité renforcée, sécurité, protection pluie, confort thermique, personnalisation logo, packs pilotes, contrats cadres et déploiements multi-sites.

Les cibles prioritaires sont les grandes entreprises d’infrastructure et organisations avec équipes terrain : VINCI, Enedis, Eiffage, Bouygues Construction, SNCF Réseau, RATP, Keolis, Colas, Veolia, Suez, Engie.

## Problème métier

Le cycle commercial grands comptes est complexe : plusieurs décideurs, besoins terrain hétérogènes, process achat longs, contraintes QHSE, validation pilote, calendrier budgétaire et suivi CRM exigeant.

Les commerciaux doivent personnaliser fortement l’approche sans perdre de temps sur la préparation, les relances et la saisie CRM.

## Workflow B2B actuel

1. Identifier les comptes à potentiel
2. Comprendre le besoin probable
3. Identifier les personas cibles
4. Créer ou enrichir les leads
5. Préparer une séquence de prospection
6. Analyser les réponses
7. Proposer un rendez-vous
8. Préparer la découverte
9. Réaliser une visite terrain
10. Construire une proposition pilote
11. Suivre le deal jusqu’à signature

## Valeur de l’agent IA

L’agent ne remplace pas les commerciaux. Il agit comme couche intelligente au-dessus du CRM :

- Priorisation des comptes
- Angles commerciaux par persona
- Génération de séquences multicanales
- Analyse des réponses prospects
- Recommandation d’étapes CRM
- Préparation de brief découverte
- Structuration de notes terrain
- Préparation de proposition pilote
- Maintien d’un journal CRM propre

## Architecture V1

- Next.js App Router
- UI one-page cockpit avec navigation latérale
- État local React
- Routes API server-side pour l’IA
- Validation Zod des entrées et sorties
- OpenAI Node SDK côté serveur
- Fallback mock si clé absente
- Simulations visuelles pour CRM Pipeline, outbound tool et calendrier commercial

## Architecture V2

- Authentification utilisateurs
- Persistance des comptes, leads, séquences et deals
- Connexion Pipedrive API
- Connexion Lemlist API ou outil outbound équivalent
- Connexion Google Calendar API
- Gestion des rôles commerciaux
- Historique des recommandations IA par compte
- Mesure de conversion et performance des séquences
- Gouvernance des prompts et revue humaine avant envoi

## Cas d’usage couverts

- Account Intelligence
- Buying Committee Mapping
- Lead List Builder
- Sequence Studio
- Reply Intelligence
- Meeting Booker
- CRM Pipeline Timeline
- Discovery Brief
- Field Visit Assistant
- Proposal Assistant
- Guided Demo Mode avec VINCI Energies

## Limites / conformité

- Aucune donnée privée réelle
- Contacts fictifs pour démonstration uniquement
- Aucun scraping
- Aucun envoi réel
- Aucun appel réel à Pipedrive, Lemlist ou Google Calendar
- Pas de promesse technique irréaliste
- Revue commerciale humaine nécessaire avant toute action réelle
