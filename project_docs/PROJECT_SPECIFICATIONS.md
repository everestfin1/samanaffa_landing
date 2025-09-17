
# Sama Naffa Platform - Project Specifications (Updated)

## 1. Introduction

Ce document détaille l'architecture et les spécifications techniques de la plateforme web Sama Naffa. Suite à la refactorisation, la plateforme adopte une navigation traditionnelle avec des pages dédiées et un portail client sécurisé. L'objectif principal reste de faciliter l'ouverture d'un compte d'épargne ou la souscription à un produit d'investissement APE de manière simple, sécurisée et rapide.

## 2. Architecture de Navigation

### 2.1 Structure Principale
- **Accueil**: Page d'accueil avec présentation générale
- **Offres/Produits/Services**: Menu déroulant avec:
  - Sama Naffa (Banque digitale et épargne)
  - APE Sénégal (Investissements et obligations)
- **FAQ**: Questions fréquemment posées
- **Contact**: Informations de contact et formulaire
- **Se connecter**: Accès au portail client existant
- **Commencer**: Inscription de nouveaux clients

### 2.2 Parcours Utilisateur

#### Nouveaux Clients (Bouton "Commencer")
1. **Inscription Multi-étapes**:
   - Étape 1: Informations personnelles
   - Étape 2: Adresse et identité
   - Étape 3: Préférences de compte
   - Étape 4: Sécurité et validation
2. **Redirection automatique** vers le portail client

#### Clients Existants (Bouton "Se connecter")
1. **Connexion sécurisée** avec email/téléphone et mot de passe
2. **Accès direct** au portail client

## 3. Portail Client et Vérification KYC

### 3.1 Flux KYC pour Nouveaux Clients
1. **Vérification d'identité**: Confirmation des informations personnelles
2. **Documents requis**:
   - Pièce d'identité (recto/verso)
   - Justificatif de domicile
3. **Photo de vérification**: Selfie avec pièce d'identité
4. **Examen en cours**: Révision par l'équipe (24-48h)
5. **Activation complète**: Accès à tous les services

### 3.2 Statuts KYC
- **En attente**: Vérification non commencée
- **En cours**: Processus de vérification actif
- **Documents requis**: Documents manquants
- **Sous examen**: Révision par l'équipe
- **Approuvé**: Compte entièrement activé
- **Rejeté**: Vérification échouée

## 4. Objectifs Clés (Mis à jour)

- **UX/UI Foundation**: Interface utilisateur moderne et intuitive
- **Navigation Intuitive**: Structure de navigation claire et logique
- **Mobile-First**: Conception optimisée pour les appareils mobiles
- **Sécurité**: Processus KYC robuste et sécurisé
- **Accessibilité**: Accès facile pour nouveaux et anciens clients
- **Évolutivité**: Architecture préparée pour les futures fonctionnalités
