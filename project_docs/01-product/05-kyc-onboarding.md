# Mobile KYC Onboarding Flow - Page Structure Analysis

**Version:** 1.0  
**Date:** 2025-01-27  
**Scope:** Mobile-first KYC (Know Your Customer) onboarding process for Sama Naffa & APE Senegal platform

## Overview

This document provides a detailed structural analysis of the mobile KYC onboarding flow based on the design mockups. The flow consists of 8 distinct screens that guide users through a comprehensive registration and identity verification process.

## Flow Architecture

The KYC onboarding process follows a progressive disclosure pattern with 5 main registration steps, plus supporting screens for password creation and validation confirmation.

## Page Structure Analysis

### 1. Inscription - Etape 1 (Registration - Step 1)
**Purpose:** Initial user information collection  
**Key Elements:**
- Header with platform branding/logo
- Progress indicator (Step 1 of 5)
- Form fields:
  - Civilité (Title): Mr, Mme, Mlle
  - First name (Prénom)
  - Last name (Nom)
  - Phone number (Numéro de téléphone)
  - Email address (Adresse email)
  - Profession (Profession)
  - Field of activity (Domaine d'activité)
- Input validation indicators
- "Continuer" (Continue) button
- Back navigation option
- Mobile-optimized form layout

**UX Considerations:**
- Clear visual hierarchy
- Touch-friendly input fields
- Real-time validation feedback
- Consistent spacing and typography

### 2. Inscription - Etape 2 (Registration - Step 2)
**Purpose:** Address and identity verification details  
**Key Elements:**
- Progress indicator (Step 2 of 5)
- Nationality: Sénégal
- Type of document: Carte Nationale d'Identité / Passeport
- Identification number
- Date of issue
- Date of expiry
- Date of birth
- Place of birth
- Gender: Masculin / Féminin
- Address information fields:
  - Street address (Adresse)
  - City (Ville)
  - Postal code (Code postal)
  - Country/Region (Pays/Région)
- "Continuer" (Continue) button
- Back navigation

**UX Considerations:**
- Dropdown menus for standardized inputs
- Date picker for birth date
- Clear field labeling
- Validation for required fields

### 3. Inscription - Etape 3 (Registration - Step 3)
**Purpose:** Address and referral code input
**Key Elements:**
- Progress indicator (Step 3 of 5)
- Country of residence: Sénégal
- Region: Dakar
- District / Commune: Grand-Dakar / Sicap Liberté
- Address: Villa 6550 Sicap Liberté 6
- Referral code question: "Avez-vous un code de parrainage?" with options "Oui" / "Non" and an input field.
- "Continuer" (Continue) button
- Back navigation

**UX Considerations:**
- Clear input fields for address details
- User-friendly selection for region and commune
- Clear options for referral code
- Accessible input controls

### 4. Inscription - Etape 4 (Registration - Step 4)
**Purpose:** Identity validation (Selfie)
**Key Elements:**
- Screen Title: Validation de votre identité
- Instruction: Appuyez sur l'icône pour prendre une photo
- Visual Element: Circular icon with face outline
- Guidance Text: Chargez une photo récente et conforme à votre apparence actuelle.
- Action Button: Charger une photo
- Navigation: Retour, Suivant

**UX Considerations:**
- Clear instructions for taking a photo
- Visual feedback for the capture process
- Easy access to upload functionality
- User-friendly navigation

### 5. Inscription - Etape 4-OK (Registration - Step 4 Scan ID)
**Purpose:** Scan National Identity Document (Front and Back)
**Key Elements:**
- Screen Title: Pièce d'identité nationale
- Instruction for front: Numérisez le recto de votre pièce identification avec l'appareil photo
- Placeholder for front of ID with camera icon
- Instruction for back: Numérisez le verso de votre pièce identification avec l'appareil photo
- Placeholder for back of ID with camera icon
- Navigation: Retour, Suivant

**UX Considerations:**
- Clear instructions for scanning both sides of the ID
- Visual placeholders for ID scans
- Easy access to camera functionality
- User-friendly navigation

### 6. Inscription - Etape 5 (Registration - Step 5 Terms & Conditions)
**Purpose:** Accept Terms & Conditions and Sign
**Key Elements:**
- Screen Title: Termes & conditions
- Conditions Text: Conditions générales d'ouverture et d'utilisation du service SAMA NAFFFA Mandat de gestion
- Acceptance Checkbox: J'accepte les termes et conditions.
- Signature Area: Signez ci-dessous
- Action Button: Valider

**UX Considerations:**
- Clear display of terms and conditions
- Easy acceptance of terms
- Intuitive signature input
- Clear validation action

### 7. Mdp (PIN Code Setup)
**Purpose:** Set a 6-digit PIN code
**Key Elements:**
- Screen Title: Définir votre code PIN
- Instruction: Renseignez votre code PIN de 6 chiffres et le confirmer
- Input Fields:
    *   Entrez votre code PIN*
    *   Confirmez votre code PIN*
- Action Button: Confirmer

**UX Considerations:**
- Clear instructions for PIN entry
- Input fields for PIN and confirmation
- Visual feedback for valid PIN entry
- Clear confirmation action

### 8. Success Message (Account Creation)
**Purpose:** Confirmation of successful account creation
**Key Elements:**
- Success Message: Votre Naffa a été créé avec succès !
- Visual Element: Green checkmark icon
- Action Button: Accéder à l'écran d'accueil

**UX Considerations:**
- Clear success confirmation
- Prominent call to action
- User-friendly navigation to home screen

## Technical Implementation Considerations

### Mobile-First Design
- Touch targets minimum 44px
- Responsive layout for various screen sizes
- Optimized for portrait orientation
- Smooth scrolling and navigation

### Form Validation
- Real-time validation feedback
- Clear error messaging
- Progressive validation (validate on blur)
- Accessibility-compliant error announcements

### File Upload
- Camera integration for document capture
- File compression and optimization
- Secure file handling
- Upload progress indication

### Security
- Secure form submission
- Data encryption in transit
- Secure file storage
- Session management

### Accessibility
- Screen reader compatibility
- Keyboard navigation support
- High contrast mode support
- Clear focus indicators

## Integration Points

### Backend Integration
- User registration API
- Document upload API
- KYC verification service
- Notification service

### Frontend Integration
- Form state management
- File upload handling
- Progress tracking
- Error handling

### Third-Party Services
- Document verification service
- SMS/Email notification service
- Identity verification provider

## Success Metrics

### User Experience
- Completion rate per step
- Time to complete registration
- Error rate and recovery
- User satisfaction scores

### Technical Performance
- Page load times
- Upload success rates
- Form submission success
- Mobile performance metrics

## Future Enhancements

### Phase 2 Improvements
- Biometric authentication
- Advanced document scanning
- Real-time verification
- Multi-language support (Wolof)

### Phase 3 Features
- Video verification
- Advanced fraud detection
- Automated document processing
- Enhanced user guidance

## Conclusion

The mobile KYC onboarding flow provides a comprehensive, user-friendly process for account creation and identity verification. The progressive disclosure approach ensures users are not overwhelmed while collecting all necessary information for compliance and security. The design prioritizes mobile usability while maintaining security standards required for financial services.

The flow successfully balances regulatory requirements with user experience, providing clear guidance and feedback throughout the process. This structure serves as the foundation for implementing a robust, accessible, and secure onboarding experience for the Sama Naffa & APE Senegal platform.
