# Sama Naffa Platform - Architecture Documentation

## 1. Vue d'ensemble de l'Architecture

La plateforme Sama Naffa a été refactorisée pour adopter une architecture moderne avec navigation traditionnelle, pages dédiées, et un système d'authentification robuste.

## 2. Structure des Composants

### 2.1 Navigation (`/src/components/Navigation.tsx`)
- **Navigation principale** avec menu déroulant pour les services
- **Authentification** : boutons "Se connecter" et "Commencer"
- **Responsive** : menu mobile adaptatif
- **État global** : gestion de l'état d'authentification

### 2.2 Pages Principales (`/src/components/pages/`)

#### 2.2.1 Pages Publiques
- **FAQ.tsx** : Questions fréquemment posées avec système de filtres
- **Contact.tsx** : Informations de contact et formulaire de contact
- **LandingTab.tsx** : Page d'accueil (refactorisée)
- **SamaNaffaTab.tsx** : Détails des services Sama Naffa (réutilisée)
- **APE.tsx** : Détails des services APE Sénégal (réutilisée)

#### 2.2.2 Pages d'Authentification
- **Login.tsx** : Connexion sécurisée avec options multiples
- **Register.tsx** : Inscription multi-étapes (4 étapes)

#### 2.2.3 Portail Client
- **ClientPortal.tsx** : Interface principale du portail avec KYC

## 3. Flux d'Authentification

### 3.1 Nouveaux Utilisateurs
```
Accueil → "Commencer" → Register (4 étapes) → ClientPortal (KYC) → Services complets
```

### 3.2 Utilisateurs Existants
```
Accueil → "Se connecter" → Login → ClientPortal → Services complets
```

## 4. Système KYC (Know Your Customer)

### 4.1 Étapes de Vérification
1. **Vérification d'identité** : Validation des informations personnelles
2. **Upload de documents** : 
   - Pièce d'identité (recto/verso)
   - Justificatif de domicile
3. **Photo de vérification** : Selfie avec pièce d'identité
4. **Examen manuel** : Révision par l'équipe de conformité

### 4.2 États KYC
- `pending` : En attente de démarrage
- `in_progress` : Vérification en cours
- `documents_required` : Documents manquants
- `under_review` : Sous examen
- `approved` : Approuvé et activé
- `rejected` : Rejeté

## 5. Gestion d'État

### 5.1 État Global (`/src/app/page.tsx`)
- **currentPage** : Page actuellement affichée
- **isAuthenticated** : Statut d'authentification
- **Navigation handler** : Gestion centralisée de la navigation

### 5.2 États Locaux
- **Formulaires** : Validation et soumission
- **KYC** : Progression et statut
- **UI** : Menus déroulants, modales, etc.

## 6. Responsive Design

### 6.1 Breakpoints
- **Mobile** : < 768px
- **Tablet** : 768px - 1024px  
- **Desktop** : > 1024px

### 6.2 Adaptations
- **Navigation mobile** : Menu hamburger avec overlay
- **Formulaires** : Colonnes adaptatives
- **Grilles** : Réorganisation automatique

## 7. Sécurité

### 7.1 Authentification
- **Validation côté client** et serveur
- **Hashage des mots de passe**
- **Session management**
- **Protection CSRF**

### 7.2 Upload de Documents
- **Validation des types de fichiers**
- **Limitation de taille**
- **Chiffrement des données**
- **Audit trail**

## 8. Performance

### 8.1 Optimisations
- **Code splitting** par pages
- **Lazy loading** des composants
- **Optimisation des images**
- **Mise en cache intelligente**

### 8.2 Monitoring
- **Temps de chargement**
- **Taux de conversion**
- **Erreurs utilisateur**
- **Performance KYC**

## 9. Accessibilité

### 9.1 Standards
- **WCAG 2.1 AA** compliance
- **Navigation au clavier**
- **Screen readers** support
- **Contraste élevé**

### 9.2 Implémentation
- **Aria labels** appropriés
- **Focus management**
- **Alt text** pour les images
- **Semantic HTML**

## 10. Déploiement et CI/CD

### 10.1 Environnements
- **Développement** : Local avec hot reload
- **Staging** : Pré-production pour tests
- **Production** : Environnement live

### 10.2 Pipeline
- **Linting** : ESLint + Prettier
- **Tests** : Jest + Testing Library
- **Build** : Next.js optimization
- **Déploiement** : Automatisé via CI/CD

## 11. Prochaines Étapes

### 11.1 Phase 1 (Actuelle)
- ✅ Architecture de base
- ✅ Navigation refactorisée  
- ✅ Pages principales
- ✅ Système d'authentification
- ✅ Flux KYC

### 11.2 Phase 2 (À venir)
- 🔄 Intégration API réelle
- 🔄 Système de paiement
- 🔄 Notifications push
- 🔄 Analytics avancées
- 🔄 Tests automatisés

### 11.3 Phase 3 (Future)
- 📋 Application mobile
- 📋 Fonctionnalités avancées
- 📋 Intelligence artificielle
- 📋 Expansion régionale
