# Meta‑prompt — Landing Page PEE (Plan Épargne Éducation) — EVEREST Finance

## Rôle
Tu es un **senior full‑stack / designer front** qui doit **reproduire fidèlement** une landing page marketing pour le service **Plan Épargne Éducation (PEE)** d’EVEREST Finance.

La page sera publiée sur **`https://everestfin.com/pee`**.

Tu dois produire une implémentation **Next.js (App Router)** cohérente avec les conventions du repo (comme la landing APE):
- `export const metadata` (title + icons)
- page route `src/app/pee/page.tsx` qui rend un composant (ex: `src/components/PEE/PEE.tsx`)
- composants découpés par sections
- styles Tailwind (en s’alignant avec la charte déjà utilisée)

## Sources de vérité (à utiliser et citer implicitement)
Utilise exclusivement ces ressources locales:
- Design global et contenus (copy/structure) :
  - `project_docs/pee_docs/Landing page-PEE.png`
  - `project_docs/pee_docs/Banniere PEE_1.png`
- Spécifications techniques :
  - `project_docs/pee_docs/Document_Technique_–_Landing_Page_Plan_Épargne_Éducation_(pee).docx`

## Objectif produit
- **Informer** et **convertir** des parents / prospects qui veulent préparer les études (scolaires/universitaires) de leurs enfants.
- **Collecter des leads** via un formulaire de contact.

## Contraintes non‑négociables
- **Langue**: Français (inclure la touche Wolof du hero “Wadial sa ëllëgou Ndaw”).
- **Fidélité visuelle**: reproduire la hiérarchie et les blocs visibles sur les screenshots.
- **Accessibilité**: labels, focus states, contrast raisonnable.
- **Performance**: images optimisées (Next `Image`), lazy‑loading hors hero.
- **SEO/partage**: meta title/description + OpenGraph.
- **Tracking**: event GA4 `lead_submit_pee` au succès (voir Tracking).

## Architecture attendue (composants)
Reproduis la structure recommandée dans le doc technique:
- `<Header />`
- `<HeroSection />`
- `<WhyPEE />`
- `<AdvantagesPEE />`
- `<LeadForm />`
- `<Footer />`
- `<WhatsAppButton />`

Notes d’alignement repo:
- APE a son propre footer; la page PEE peut utiliser un footer dédié (comme APE) OU réutiliser `src/components/Footer.tsx` si cohérent.
- Le bouton WhatsApp existe déjà dans le repo (`src/components/WhatsAppButton.tsx`) : réutiliser si possible.

## IA/Design system — directives UI
### Palette & style (d’après screenshots)
- **Fond principal section contenu**: violet foncé / aubergine.
- **Hero**: grand bandeau blanc + vague violette à droite, enfant au centre, badge doré.
- **Accents**: doré (badge / boutons / liens), violet clair pour dégradés.

### Header (ancré)
- Logo EVEREST Finance (gauche)
- Navigation (droite) en ancres:
  - Accueil
  - Pourquoi un (PEE) ?
  - Avantages du (PEE)
  - Contact

Comportements:
- Scroll vers ancres
- Sticky optionnel

### HeroSection (bandeau)
Doit reprendre les éléments suivants (ordre & emphasis):
- Titre: **“Éduc’ épargne”** (mise en forme typographique proche)
- Sous‑titre: **“Wadial sa ëllëgou Ndaw”**
- Texte: **“Préparez dès aujourd’hui son avenir scolaire ou universitaire en toute sérénité.”**
- Zone “Suivez‑nous sur” + icônes réseaux (factice si non branché)
- Badge doré: **“Épargnez dès 30 000 FCFA / mois”**
- Mention bas‑droite: **“Bénéficiez de taux attractifs à partir de 4,5 %”**

CTA:
- Un bouton/interaction “scroll to form” (même si non visible sur le screenshot, il est requis par le doc technique).

### WhyPEE (section “Pourquoi un Plan Épargne Éducation ?”)
Structure visible:
- Fond aubergine.
- Bloc image à gauche (photo parent/enfant).
- Bloc texte à droite:
  - Titre: **“Pourquoi un Plan Épargne Éducation ?”**
  - Corps (reprendre exactement):
    - “Parce que l’éducation a un coût et que l’anticipation fait la différence. Le Plan Épargne Éducation vous permet de constituer progressivement un capital dédié aux études de votre enfant, en toute sérénité, pour lui offrir la liberté de choisir son avenir.”

### AdvantagesPEE (section “Avantages du PEE”)
Structure visible:
- Liste à gauche sur fond aubergine.
- À droite, une image (personne heureuse) dans un cadre clair.

Liste (reprendre exactement):
- “Anticipez les frais d’études sans stress”
- “Épargne simple, progressive et sécurisée”
- “Rendement supérieur à l’épargne classique”
- “Capital sécurisé + intérêts”
- “Discipline d’épargne sur le long terme”
- “Sérénité pour les parents, avenir assuré pour l’enfant”

### LeadForm (section formulaire)
Titre section (exact):
- **“Épargne sécurisée et rentable, simplifiez-vous”**
Sous‑titre:
- “Remplissez le formulaire de contact”

UI:
- Carte formulaire centrée, fond clair, bords arrondis.
- Bouton submit doré (ex: “Envoyer”).

#### Spécifications champs (doc technique)
Champs / types / obligatoire:
- Civilité: radio (Oui) — `Mr`, `Mme`
- Prénom: text (Oui)
- Nom: text (Oui)
- Catégorie socio‑professionnelle: select (Oui)
- Pays de résidence: select (Oui)
- Ville: text (Oui)
- Numéro de téléphone: tel (Oui)
- Adresse email: email (Non)

Validation front:
- Required fields
- Téléphone: regex + indicatif
- Email: format standard
- Désactiver le bouton si invalide

Soumission:
- `POST` vers **`/api/lead-pee`**
- JSON payload (exemple conforme):
```json
{
  "civilite": "Mme",
  "prenom": "Awa",
  "nom": "Diop",
  "categorie": "Salarié",
  "pays": "Sénégal",
  "ville": "Dakar",
  "telephone": "+221771234567",
  "email": "awa@email.com"
}
```
Réponses:
- `200` succès
- `400` validation
- `500` serveur

Anti‑spam:
- Honeypot OU captcha invisible (préférer honeypot léger)

Emails:
- Email interne à `contact@everestfin.com` avec récap + date/heure + source: “Landing Page PEE”.
- Email user optionnel: confirmation institutionnelle.

### Footer
Le screenshot montre un footer simple avec:
- Adresse
- Contact
- Copyright
- Bouton WhatsApp flottant

Contenu footer (d’après screenshot):
- **Adresse**: “18 Boulevard de la République, Dakar, Sénégal BP : 11659-13000”
- **Contact**:
  - “Envoyez un courriel à contact@everestfin.com”
  - “221 33 822 87 00”
- Copyright: “© 2025 EVEREST Finance. All Rights Reserved” (ou année dynamique)

## Assets / images
- Le hero doit utiliser l’image fournie `Banniere PEE_1.png` (ou l’équivalent intégré).
- Les sections “Pourquoi…” et “Avantages…” utilisent des photos (si pas disponibles en assets séparés):
  - autoriser des placeholders temporaires en attendant assets finaux, **mais** conserver dimensions / ratios / mise en page.
- Convertir en WebP si pipeline existant, sinon utiliser PNG et `next/image`.

## SEO & Metadata (Next.js)
Définir `export const metadata` avec:
- `title`: “EVEREST Finance | PEE” (ou “Plan Épargne Éducation (PEE) | EVEREST Finance”)
- `description`: axée sur l’épargne progressive pour études + rendement à partir de 4,5% + dès 30 000 FCFA/mois.
- icons: aligner avec APE (logo Everst en `/logo-everest.png`).
- Open Graph: titre + description + image (hero).

## Tracking & Analytics
- GA4: envoyer un événement `lead_submit_pee` au succès de soumission.
  - inclure `page_location`, `device`, `country` si possible.
- Meta Pixel optionnel: event `Lead` (prévoir un hook optionnel, mais ne pas bloquer).

## Sécurité
- HTTPS obligatoire (implicite)
- Protection XSS/CSRF côté API
- Pas de données sensibles
- Logs minimalistes et sécurisés

## Critères d’acceptation (checklist)
- Navigation par ancres fonctionne (header)
- Hero correspond au screenshot (typo, badge, mention 4,5%)
- Sections “Pourquoi…” et “Avantages…” respectent copy et structure
- Formulaire:
  - champs requis + validations
  - payload conforme
  - bouton désactivé si invalide
  - succès/erreur UX propre
- Event GA4 `lead_submit_pee` déclenché uniquement en cas de succès
- Responsive:
  - mobile: hero stack correctement, form lisible
  - desktop: layout identique au screenshot
- Performance: images optimisées

## Sortie attendue (ce que tu dois produire)
Produis:
- Une proposition d’arborescence fichiers
- Les composants React/Next nécessaires
- Les styles Tailwind nécessaires
- Le handler API `/api/lead-pee` (serverless) conforme au doc

**Important**: l’implémentation doit rester simple, robuste et alignée avec les patterns existants dans ce repo (cf. APE).
