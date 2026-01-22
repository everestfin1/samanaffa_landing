// Shared validators for Sama Naffa platform

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidPhone(phone: string): boolean {
  // Basic phone validation - accepts international format
  const phoneRegex = /^\+?[1-9]\d{6,14}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

export function isValidAmount(amount: string | number): boolean {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  return !isNaN(num) && num > 0 && isFinite(num)
}

export function sanitizeString(str: string): string {
  return str.trim().replace(/[<>]/g, '')
}

export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

// APE subscription validation
export interface ApeSubscriptionInput {
  nom: string
  prenom: string
  telephone: string
  email?: string
  nombreTitres: number
  modePaiement: string
}

export function validateApeSubscription(input: ApeSubscriptionInput): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!input.nom || input.nom.trim().length < 2) {
    errors.push('Nom invalide')
  }
  if (!input.prenom || input.prenom.trim().length < 2) {
    errors.push('Prénom invalide')
  }
  if (!input.telephone || !isValidPhone(input.telephone)) {
    errors.push('Numéro de téléphone invalide')
  }
  if (input.email && !isValidEmail(input.email)) {
    errors.push('Email invalide')
  }
  if (!input.nombreTitres || input.nombreTitres < 1) {
    errors.push('Nombre de titres invalide')
  }
  if (!input.modePaiement) {
    errors.push('Mode de paiement requis')
  }

  return { valid: errors.length === 0, errors }
}

// Admin login validation
export interface AdminLoginInput {
  email: string
  password: string
}

export function validateAdminLogin(input: AdminLoginInput): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!input.email || !isValidEmail(input.email)) {
    errors.push('Email invalide')
  }
  if (!input.password || input.password.length < 6) {
    errors.push('Mot de passe requis (min 6 caractères)')
  }

  return { valid: errors.length === 0, errors }
}
