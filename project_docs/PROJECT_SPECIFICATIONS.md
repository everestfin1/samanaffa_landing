
# Sama Naffa Mini-Site - Project Specifications

## 1. Introduction

Ce document détaille la proposition d'organisation, les spécifications techniques et les parcours utilisateurs pour le mini-site web mobile-first de Sama Naffa. L'objectif principal est de faciliter l'ouverture d'un compte d'épargne ou la souscription à un produit d'investissement APE de manière simple, sécurisée et rapide, avec une confirmation immédiate.

## 2. Objectifs Clés

- **Facilité d'accès**: Deux portes d'entrée claires et distinctes (Épargne Persona et Souscription APE) dès la page d'accueil.
- **Rapidité**: Parcours utilisateur en 3 clics maximum jusqu'au dépôt initial.
- **Mobile-First**: Conception et développement optimisés pour les appareils mobiles.
- **Confiance**: Preuves de confiance immédiates (conformité BCEAO, confirmations WhatsApp, attestation PDF).
- **Tracking**: Intégration d'outils de monitoring pour suivre les performances et les KPIs.

## 3. Architecture de l'Information (IA) & Navigation

### Header (Minimaliste)
- **Logo Sama Naffa**: Lien vers la page d'accueil.
- **Liens de navigation simplifiés**: "Pourquoi Sama Naffa", "FAQ", "Assistance".
- **CTA Principal**: "Ouvrir mon Naffa" (bouton en surbrillance).

### Page d'Accueil (`/`)
- **Section Hero**: Message fort ("Épargner pour vos projets, facilement et en toute sécurité").
- **CTAs d'accès directs**: Deux cartes principales pour les deux parcours clés:
    - "Épargner selon mon profil" (mène vers la liste des personas).
    - "Souscrire à l'APE" (mène vers la page APE).
- **Section "Pourquoi Sama Naffa?"**: Valeurs clés, chiffres et impact attendu.
- **Simulateur d'épargne universel**: Curseur montant/durée, résultat projeté, CTA "Ouvrir un compte".
- **Témoignages & communauté**: Vidéos courtes, success stories.
- **FAQ succincte**: Quelques questions fréquentes avec lien vers la page FAQ complète.
- **Footer**: Mentions légales, conformité BCEAO, liens réseaux sociaux, contact WhatsApp direct.

### Navigation Secondaire (Mobile - optionnel)
- Des ancres ou une navigation sticky peuvent être envisagées pour accéder rapidement aux sections clés (Simulateur, Témoignages, FAQ).

## 4. Sitemap et Routes (Next.js App Router)

### Pages Publics (`src/app/(public)/*`)
- `/` (Accueil)
- `/personas` (Listing des 5 personas)
- `/personas/[slug]` (Détail d'un persona: projet prérempli, CTA "Ouvrir mon compte")
- `/simulateur` (Simulateur universel: curseurs, calcul, CTA "Ouvrir un compte")
- `/ape` (Page APE: vidéo explicative, simulateur de rendement, options de souscription, CTA "Souscrire à l'APE")
- `/temoignages` (Page dédiée aux témoignages et success stories)
- `/faq` (Questions fréquentes complètes)
- `/assistance` (Options de contact, lien WhatsApp direct)

### Flows Utilisateurs (`src/app/(flows)/*`)
- `/ouvrir-compte` (Stepper pour le parcours d'épargne persona/simulateur: KYC léger, Paiement)
- `/souscrire-ape` (Stepper pour le parcours APE: options, KYC complet, Paiement, Confirmation/Attestation)
- `/succes` (Page de confirmation générique après un parcours réussi)

### API Endpoints (`src/app/api/*`)
- `/api/intouch/webhook` (Callback pour les paiements Intouch)
- `/api/kyc/upload` (Upload de documents d'identité et selfie)
- `/api/kyc/verify` (Vérification d'identité via OCR/Facial Recognition)
- `/api/whatsapp/notify` (Envoi de notifications transactionnelles WhatsApp)
- `/api/manar/lead` (Création/Mise à jour de leads dans le CRM Manar)

## 5. Structure du Projet (Next.js App Router)

```
src/
  app/
    (public)/                  // Pages accessibles publiquement
      page.tsx                 // Accueil
      personas/
        page.tsx               // Listing des personas
        [slug]/page.tsx        // Page détaillée d'un persona
      simulateur/page.tsx
      ape/page.tsx
      temoignages/page.tsx
      faq/page.tsx
      assistance/page.tsx
    (flows)/                   // Parcours utilisateurs (steppers)
      ouvrir-compte/page.tsx   // Flow Épargne
      souscrire-ape/page.tsx   // Flow APE
      succes/page.tsx          // Page de succès
    api/                       // Endpoints API
      intouch/webhook/route.ts
      kyc/
        upload/route.ts
        verify/route.ts
      whatsapp/notify/route.ts
      manar/lead/route.ts
  components/                  // Composants UI réutilisables
    common/                    // Composants génériques (Header, Footer, Button, Input...)
    hero/Hero.tsx
    cards/PersonaCard.tsx
    simulator/Simulator.tsx
    kyc/KycLightForm.tsx
    kyc/KycFullForm.tsx
    payment/PaymentIntouch.tsx
    payment/PaymentAPE.tsx     // Pour virement/mobile money APE
    feedback/ResultCard.tsx
    forms/                     // Composants de formulaires spécifiques
    flows/FlowLayout.tsx       // Layout pour les steppers
  content/                     // Données de contenu statiques/configurables
    personas.ts                // Configuration des 5 personas
    faq.ts                     // Questions fréquentes
  lib/                         // Fonctions utilitaires et intégrations externes
    intouch.ts                 // Fonctions pour API Intouch
    manar.ts                   // Fonctions pour CRM Manar
    whatsapp.ts                // Fonctions pour WhatsApp Business API
    ocr.ts                     // Fonctions pour OCR/Facial Recognition
    insights.ts                // Fonctions pour Azure Monitor/Application Insights
    rates.ts                   // Logique de calcul des taux d'intérêt
    utils.ts                   // Utilitaires génériques
  styles/                      // Fichiers de styles globaux et modules CSS/Tailwind
    globals.css
    variables.css
```

## 6. Composants Clés

- **`Hero`**: Section d'accueil accrocheuse avec message fort et CTAs principaux.
- **`PersonaCard`**: Carte cliquable pour chaque persona, affichant l'icône, le nom et éventuellement des infos clés.
- **`Simulator`**: Composant client-side interactif avec sliders pour montant et durée, affichant la projection financière. Utilise `lib/rates.ts`.
- **`FlowLayout`**: Layout générique pour les parcours en plusieurs étapes (steppers), avec gestion de l'état des étapes.
- **`KycLightForm`**: Formulaire KYC simplifié pour l'épargne persona (nom, téléphone, email, upload ID + selfie).
- **`KycFullForm`**: Formulaire KYC complet pour l'APE (ID, justificatif de domicile).
- **`PaymentIntouch`**: Intégration de l'API Intouch pour les dépôts mobile money en temps réel.
- **`PaymentAPE`**: Composant pour le paiement APE (mobile money ou virement bancaire avec upload de preuve).
- **`ResultCard`**: Composant affichant la confirmation de succès, avec options de partage et lien de téléchargement (pour APE).

## 7. Parcours Utilisateurs Détaillés

### 7.1. Parcours: Épargne Persona / Simulateur

**Origine**: Page d'accueil (clic sur carte persona ou sur simulateur universel).

1.  **Page d'accueil** (`/`)
    - L'utilisateur clique sur une `PersonaCard` (ex: "Étudiant") ou sur le CTA du `Simulator`.
    - **URL exemple**: `/personas/etudiant` ou `/simulateur?amount=50000&months=12`
2.  **Page Persona / Simulateur** (`/personas/[slug]` ou `/simulateur`)
    - **Persona**: Affichage des paramètres préremplis (montant, durée) spécifiques au persona. Possibilité de les ajuster.
    - **Simulateur**: L'utilisateur ajuste les curseurs montant/durée.
    - **CTA**: "Ouvrir mon compte".
3.  **Formulaire KYC Léger** (`/ouvrir-compte?persona=...` ou `...simulateur=...`)
    - L'utilisateur est redirigé vers le stepper `/ouvrir-compte`.
    - **Étape 1**: Remplir nom, prénom, téléphone, email. Upload d'une pièce d'identité et selfie (via `api/kyc/upload`).
    - **Vérification**: OCR/Facial Recognition (`api/kyc/verify`) en arrière-plan pour valider l'identité.
4.  **Paiement Initial** (`/ouvrir-compte`)
    - **Étape 2**: Sélection du mode de paiement (Intouch Mobile Money).
    - L'utilisateur initie le paiement via `PaymentIntouch` qui interagit avec l'`api/intouch/webhook`.
    - Le paiement est confirmé en temps réel.
5.  **Confirmation** (`/succes`)
    - L'utilisateur est redirigé vers une page de succès (`/succes`).
    - **Notifications**: Envoi immédiat d'une confirmation via WhatsApp (`api/whatsapp/notify`), email et/ou SMS.
    - Enregistrement des données dans CRM Manar (`api/manar/lead`).

### 7.2. Parcours: Souscription APE

**Origine**: Page d'accueil (clic sur carte "Souscrire à l'APE") ou lien direct.

1.  **Page APE** (`/ape`)
    - Vidéo explicative ou infographie sur l'APE.
    - Simulateur de rendement spécifique à l'APE (choix de tranche, choix de recapitalisation des intérêts).
    - **CTA**: "Souscrire à l'APE".
    - **URL exemple**: `/ape?tenor=60&reinvest=true`
2.  **Formulaire KYC Complet** (`/souscrire-ape?tenor=...`)
    - L'utilisateur est redirigé vers le stepper `/souscrire-ape`.
    - **Étape 1**: Remplir informations personnelles détaillées, upload pièce d'identité et justificatif de domicile (via `api/kyc/upload`).
    - **Vérification**: OCR/Facial Recognition (`api/kyc/verify`) en arrière-plan.
3.  **Paiement APE** (`/souscrire-ape`)
    - **Étape 2**: Choix du mode de paiement (Mobile Money via Intouch ou Virement Bancaire).
    - **Mobile Money**: Similaire au parcours épargne.
    - **Virement Bancaire**: Instructions de virement affichées, l'utilisateur upload la preuve de virement.
4.  **Confirmation & Attestation** (`/succes`)
    - L'utilisateur est redirigé vers une page de succès (`/succes`).
    - **Attestation**: Génération et téléchargement d'une attestation PDF directement depuis la page ou envoyée par email.
    - **Notifications**: Confirmation immédiate via WhatsApp (`api/whatsapp/notify`) et email.
    - Enregistrement des données dans CRM Manar (`api/manar/lead`).

## 8. Intégrations Techniques

- **API Intouch**: Pour les dépôts en temps réel via mobile money. `lib/intouch.ts` gérera la création des transactions et la vérification des callbacks (`api/intouch/webhook`).
- **CRM Manar**: Centralisation des données KYC et des leads. `lib/manar.ts` pour l'intégration. Un fallback CSV sera mis en place en cas d'indisponibilité de l'API Manar.
- **WhatsApp Business API**: Envoi de notifications transactionnelles (confirmations, attestations, rappels). `lib/whatsapp.ts` utilisera des modèles pré-approuvés.
- **OCR / Facial Recognition**: Pour la vérification d'identité automatique des documents et selfies. `lib/ocr.ts` encapsulera le service choisi (ex: Azure Face API ou autre).
- **Azure Monitor / Application Insights**: Pour le suivi des performances, des erreurs et des KPIs (taux de conversion, temps de chargement, etc.). `lib/insights.ts` pour l'instrumentation des événements clés.

## 9. Gestion des Données et Contenus

- **`content/personas.ts`**:
  ```typescript
  export const personas = [
    { slug: 'etudiant', name: 'Étudiant', icon: '🎓', defaults: { amount: 25000, months: 12 } },
    { slug: 'entrepreneur', name: 'Entrepreneur', icon: '🚀', defaults: { amount: 100000, months: 18 } },
    { slug: 'diaspora', name: 'Diaspora', icon: '🌍', defaults: { amount: 200000, months: 24 } },
    { slug: 'fonctionnaire', name: 'Fonctionnaire', icon: '🏛️', defaults: { amount: 150000, months: 36 } },
    { slug: 'tontine', name: 'Tontine', icon: '🤝', defaults: { amount: 50000, months: 6 } },
  ];
  ```
- **`lib/rates.ts`**: Logique de calcul des taux d'intérêt en fonction de la durée d'épargne.
  ```typescript
  export function rateForMonths(months: number): number {
    if (months < 12) return 0.03;       // 3%
    if (months < 24) return 0.045;      // 4.5%
    if (months < 60) return 0.055;     // 5.5%
    if (months < 120) return 0.065;    // 6.5%
    return 0.07;                       // 7%
  }

  export function project(amount: number, months: number): number {
    const r = rateForMonths(months); // Taux annuel
    const monthlyRate = r / 12;      // Taux mensuel
    // Calcul d'intérêts composés (simplifié pour projection)
    return amount * Math.pow(1 + monthlyRate, months);
  }
  ```

## 10. Performance et Accessibilité

- **Next.js Server Components**: Utilisation privilégiée des Server Components pour le rendu initial et les pages statiques afin d'optimiser les performances et le SEO. Les composants clients seront utilisés uniquement là où l'interactivité est requise (formulaires, simulateurs).
- **Optimisation des Images**: `next/image` pour le lazy loading, le responsive et les formats modernes (WebP).
- **Accessibilité (A11y)**: Respect des normes WCAG. Labels explicites, gestion du focus, contraste des couleurs, compatibilité clavier.
- **SEO**: Balises `metadata` complètes pour chaque page, schémas JSON-LD (Organization, FinancialProduct) pour une meilleure visibilité dans les moteurs de recherche.

## 11. Sécurité et Fiabilité

- **Validation des données**: Validation client-side (via `react-hook-form` et `zod`) et serveur-side (`zod`) pour toutes les entrées utilisateur.
- **Webhooks sécurisés**: Vérification des signatures des webhooks (ex: Intouch) pour s'assurer de l'authenticité des requêtes.
- **Idempotence**: Implémentation de mécanismes d'idempotence pour les transactions critiques (paiements, souscriptions) afin d'éviter les doublons en cas de retransmission.
- **Gestion des erreurs**: Logique de gestion des erreurs robuste avec des messages clairs pour l'utilisateur et des logs détaillés pour le débogage (via Azure Application Insights).
- **Protection contre les attaques**: Rate limiting sur les endpoints sensibles (upload, vérification KYC) et mesures de protection standard (CSRF, XSS).

## 12. Points d'Interaction et Preuves de Confiance

- **CTAs Clairs**: Boutons "Ouvrir mon Naffa" et "Souscrire à l'APE" bien visibles et explicites à des points stratégiques (Hero, bas de page, pages de détails).
- **Micro-Preuves de Confiance**: Intégration de badges "Conforme BCEAO", logos de partenaires (Intouch), témoignages courts, et un compteur du nombre d'épargnants/membres de la communauté.
- **Confirmation Multicanale**: Confirmation immédiate in-site, par WhatsApp, email et/ou SMS après toute transaction ou souscription réussie.
- **Attestation Téléchargeable**: Pour les souscriptions APE, une attestation PDF sera disponible au téléchargement immédiatement après paiement.

