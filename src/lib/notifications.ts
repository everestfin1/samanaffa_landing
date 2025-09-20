import * as nodemailer from 'nodemailer'
// eslint-disable-next-line @typescript-eslint/no-require-imports
const twilio = require('twilio')

// Email configuration
const emailTransporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

// Twilio configuration
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
)

export async function sendEmailOTP(email: string, otp: string): Promise<void> {
  const mailOptions = {
    from: process.env.EMAIL_SENDER,
    to: email,
    subject: 'Votre code de vérification Sama Naffa',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Sama Naffa</h2>
        <p>Bonjour,</p>
        <p>Votre code de vérification est :</p>
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="color: #2563eb; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
        </div>
        <p>Ce code expire dans 5 minutes.</p>
        <p>Si vous n'avez pas demandé ce code, ignorez cet email.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">L'équipe Sama Naffa</p>
      </div>
    `,
  }

  await emailTransporter.sendMail(mailOptions)
}

export async function sendSMSOTP(phone: string, otp: string): Promise<void> {
  await twilioClient.messages.create({
    body: `Votre code Sama Naffa: ${otp}. Expire dans 5min.`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phone,
  })
}

export async function sendTransactionIntentEmail(
  email: string,
  userName: string,
  transactionData: {
    type: 'deposit' | 'investment' | 'withdrawal'
    amount: number
    paymentMethod: string
    referenceNumber: string
    accountType: 'sama_naffa' | 'ape_investment'
    investmentTranche?: string
    investmentTerm?: number
    userNotes?: string
  }
): Promise<void> {
  const { type, amount, paymentMethod, referenceNumber, accountType, investmentTranche, investmentTerm, userNotes } = transactionData
  
  const accountTypeLabel = accountType === 'sama_naffa' ? 'Sama Naffa' : 'APE Investment'
  const typeLabel = type === 'deposit' ? 'Dépôt' : type === 'investment' ? 'Investissement' : 'Retrait'
  
  let investmentDetails = ''
  if (type === 'investment' && investmentTranche && investmentTerm) {
    investmentDetails = `
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 15px 0;">
        <h4 style="color: #374151; margin: 0 0 10px 0;">Détails de l'investissement</h4>
        <p style="margin: 5px 0;"><strong>Tranche:</strong> ${investmentTranche}</p>
        <p style="margin: 5px 0;"><strong>Durée:</strong> ${investmentTerm} ans</p>
      </div>
    `
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Confirmation de votre ${typeLabel} - ${accountTypeLabel}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Sama Naffa</h2>
        <p>Bonjour ${userName},</p>
        <p>Nous avons bien reçu votre demande de <strong>${typeLabel}</strong> sur votre compte <strong>${accountTypeLabel}</strong>.</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin: 0 0 15px 0;">Détails de la transaction</h3>
          <p style="margin: 8px 0;"><strong>Numéro de référence:</strong> ${referenceNumber}</p>
          <p style="margin: 8px 0;"><strong>Type:</strong> ${typeLabel}</p>
          <p style="margin: 8px 0;"><strong>Montant:</strong> ${amount.toLocaleString()} FCFA</p>
          <p style="margin: 8px 0;"><strong>Méthode de paiement:</strong> ${paymentMethod}</p>
          <p style="margin: 8px 0;"><strong>Compte:</strong> ${accountTypeLabel}</p>
          ${userNotes ? `<p style="margin: 8px 0;"><strong>Notes:</strong> ${userNotes}</p>` : ''}
        </div>
        
        ${investmentDetails}
        
        <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #92400e;"><strong>Prochaines étapes:</strong></p>
          <p style="margin: 5px 0; color: #92400e;">Notre équipe va traiter votre demande dans les plus brefs délais. Vous recevrez une notification une fois la transaction finalisée.</p>
        </div>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">L'équipe Sama Naffa</p>
      </div>
    `,
  }

  await emailTransporter.sendMail(mailOptions)
}

export async function sendAdminNotificationEmail(
  adminEmail: string,
  transactionData: {
    userName: string
    userEmail: string
    userPhone: string
    type: 'deposit' | 'investment' | 'withdrawal'
    amount: number
    paymentMethod: string
    referenceNumber: string
    accountType: 'sama_naffa' | 'ape_investment'
    investmentTranche?: string
    investmentTerm?: number
    userNotes?: string
  }
): Promise<void> {
  const { userName, userEmail, userPhone, type, amount, paymentMethod, referenceNumber, accountType, investmentTranche, investmentTerm, userNotes } = transactionData
  
  const accountTypeLabel = accountType === 'sama_naffa' ? 'Sama Naffa' : 'APE Investment'
  const typeLabel = type === 'deposit' ? 'Dépôt' : type === 'investment' ? 'Investissement' : 'Retrait'
  
  let investmentDetails = ''
  if (type === 'investment' && investmentTranche && investmentTerm) {
    investmentDetails = `
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 15px 0;">
        <h4 style="color: #374151; margin: 0 0 10px 0;">Détails de l'investissement</h4>
        <p style="margin: 5px 0;"><strong>Tranche:</strong> ${investmentTranche}</p>
        <p style="margin: 5px 0;"><strong>Durée:</strong> ${investmentTerm} ans</p>
      </div>
    `
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: adminEmail,
    subject: `Nouvelle demande de ${typeLabel} - ${referenceNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Notification Admin - Sama Naffa</h2>
        <p>Une nouvelle demande de <strong>${typeLabel}</strong> nécessite votre attention.</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin: 0 0 15px 0;">Informations client</h3>
          <p style="margin: 8px 0;"><strong>Nom:</strong> ${userName}</p>
          <p style="margin: 8px 0;"><strong>Email:</strong> ${userEmail}</p>
          <p style="margin: 8px 0;"><strong>Téléphone:</strong> ${userPhone}</p>
        </div>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin: 0 0 15px 0;">Détails de la transaction</h3>
          <p style="margin: 8px 0;"><strong>Numéro de référence:</strong> ${referenceNumber}</p>
          <p style="margin: 8px 0;"><strong>Type:</strong> ${typeLabel}</p>
          <p style="margin: 8px 0;"><strong>Montant:</strong> ${amount.toLocaleString()} FCFA</p>
          <p style="margin: 8px 0;"><strong>Méthode de paiement:</strong> ${paymentMethod}</p>
          <p style="margin: 8px 0;"><strong>Compte:</strong> ${accountTypeLabel}</p>
          ${userNotes ? `<p style="margin: 8px 0;"><strong>Notes client:</strong> ${userNotes}</p>` : ''}
        </div>
        
        ${investmentDetails}
        
        <div style="background-color: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #1e40af;"><strong>Action requise:</strong></p>
          <p style="margin: 5px 0; color: #1e40af;">Veuillez traiter cette demande dans le portail d'administration.</p>
        </div>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">Système de notification Sama Naffa</p>
      </div>
    `,
  }

  await emailTransporter.sendMail(mailOptions)
}
