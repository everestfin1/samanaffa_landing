import * as nodemailer from 'nodemailer'
import { isMockOtpEnabled } from '@/lib/mock-otp'

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

// BulkSMS.com configuration
const BULKSMS_TOKEN = process.env.BULKSMS_TOKEN
const BULKSMS_USERNAME = process.env.BULKSMS_USERNAME
const BULKSMS_PASSWORD = process.env.BULKSMS_PASSWORD
const BULKSMS_API_URL = 'https://api.bulksms.com/v1/messages'

export async function sendEmailOTP(email: string, otp: string): Promise<void> {
  // Suppress emails to placeholder addresses from onboarding flow
  if (email.includes('@onboarding.samanaffa.tmp')) {
    console.log(`📧 [SKIPPED] Email to placeholder address ${email} - not sending`);
    return;
  }

  if (isMockOtpEnabled()) {
    console.log(`📧 [MOCK OTP] Email to ${email}: ${otp}`)
    return
  }
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
  if (isMockOtpEnabled()) {
    console.log(`📱 [MOCK OTP] SMS to ${phone}: ${otp}`)
    return
  }
  try {
    console.log('🔍 BulkSMS Debug Info:')
    console.log('- Token:', BULKSMS_TOKEN ? 'Set' : 'Missing')
    console.log('- Username:', BULKSMS_USERNAME ? 'Set' : 'Missing')
    console.log('- Password:', BULKSMS_PASSWORD ? 'Set' : 'Missing')
    console.log('- Phone:', phone)
    console.log('- API URL:', BULKSMS_API_URL)
    
    // Determine authentication method
    let authHeader = ''
    if (BULKSMS_USERNAME && BULKSMS_PASSWORD) {
      // Username/Password authentication
      const credentials = Buffer.from(`${BULKSMS_USERNAME}:${BULKSMS_PASSWORD}`).toString('base64')
      authHeader = `${credentials}`
      console.log('- Using Username/Password authentication')
    } else {
      throw new Error('No BulkSMS authentication credentials provided. Set either BULKSMS_TOKEN or BULKSMS_USERNAME/BULKSMS_PASSWORD')
    }
    
    const requestBody = {
      to: phone,
      body: `Votre code Sama Naffa: ${otp}. Expire dans 5min.`,
    }
    
    console.log('- Request body:', JSON.stringify(requestBody, null, 2))
    
    const response = await fetch(BULKSMS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + authHeader,
      },
      body: JSON.stringify(requestBody),
    })

    console.log('- Response status:', response.status)
    console.log('- Response headers:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      let errorData
      try {
        errorData = await response.json()
        console.log('- Error response body:', JSON.stringify(errorData, null, 2))
      } catch (parseError) {
        const textResponse = await response.text()
        console.log('- Error response text:', textResponse)
        errorData = { message: textResponse || 'Unknown error' }
      }
      
      throw new Error(`BulkSMS API error (${response.status}): ${JSON.stringify(errorData)}`)
    }

    const result = await response.json()
    console.log('✅ SMS sent successfully via BulkSMS:', result)
  } catch (error) {
    console.error('❌ Error sending SMS via BulkSMS:', error)
    throw error
  }
}

export async function sendTransactionIntentEmail(
  email: string,
  userName: string,
  transactionData: {
    type: 'deposit' | 'investment' | 'withdrawal'
    amount: number
    paymentMethod: string
    referenceNumber: string
    accountType: 'sama_naffa' | 'ape_investment' | 'ape_togo_investment'
    investmentTranche?: string
    investmentTerm?: number
    userNotes?: string
  }
): Promise<void> {
  const { type, amount, paymentMethod, referenceNumber, accountType, investmentTranche, investmentTerm, userNotes } = transactionData
  
  const accountTypeLabel = accountType === 'sama_naffa' ? 'Sama Naffa' : accountType === 'ape_togo_investment' ? 'APE Togo' : 'APE Investment'
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
    accountType: 'sama_naffa' | 'ape_investment' | 'ape_togo_investment'
    investmentTranche?: string
    investmentTerm?: number
    userNotes?: string
  }
): Promise<void> {
  const { userName, userEmail, userPhone, type, amount, paymentMethod, referenceNumber, accountType, investmentTranche, investmentTerm, userNotes } = transactionData
  
  const accountTypeLabel = accountType === 'sama_naffa' ? 'Sama Naffa' : accountType === 'ape_togo_investment' ? 'APE Togo' : 'APE Investment'
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

// KYC Status Notification Functions
export async function sendKYCStatusEmail(
  userEmail: string,
  userName: string,
  kycStatus: 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW',
  rejectionReasons?: string[]
): Promise<void> {
  let subject = ''
  let statusMessage = ''
  let statusColor = ''
  let actionMessage = ''

  switch (kycStatus) {
    case 'APPROVED':
      subject = 'Félicitations ! Votre KYC a été approuvé'
      statusMessage = 'Votre dossier KYC a été approuvé avec succès'
      statusColor = '#10b981'
      actionMessage = 'Vous pouvez maintenant accéder à tous les services de Sama Naffa.'
      break
    case 'REJECTED':
      subject = 'Mise à jour de votre dossier KYC'
      statusMessage = 'Votre dossier KYC nécessite des corrections'
      statusColor = '#ef4444'
      actionMessage = 'Veuillez consulter les détails ci-dessous et soumettre les documents manquants ou corrigés.'
      break
    case 'UNDER_REVIEW':
      subject = 'Votre dossier KYC est en cours de traitement'
      statusMessage = 'Votre dossier KYC est actuellement en cours de révision'
      statusColor = '#f59e0b'
      actionMessage = 'Nous vous informerons dès que la révision sera terminée.'
      break
  }

  let rejectionDetails = ''
  if (kycStatus === 'REJECTED' && rejectionReasons && rejectionReasons.length > 0) {
    rejectionDetails = `
      <div style="background-color: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h4 style="color: #dc2626; margin: 0 0 10px 0;">Raisons du rejet :</h4>
        <ul style="margin: 0; padding-left: 20px; color: #dc2626;">
          ${rejectionReasons.map(reason => `<li style="margin: 5px 0;">${reason}</li>`).join('')}
        </ul>
      </div>
    `
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Sama Naffa</h2>
        <p>Bonjour ${userName},</p>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${statusColor};">
          <h3 style="color: ${statusColor}; margin: 0 0 10px 0;">${statusMessage}</h3>
          <p style="margin: 0; color: #374151;">${actionMessage}</p>
        </div>
        
        ${rejectionDetails}
        
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #374151;"><strong>Prochaines étapes :</strong></p>
          ${kycStatus === 'APPROVED' 
            ? '<p style="margin: 5px 0; color: #374151;">Vous pouvez maintenant effectuer des transactions et accéder à tous nos services.</p>'
            : kycStatus === 'REJECTED'
            ? '<p style="margin: 5px 0; color: #374151;">Connectez-vous à votre portail client pour soumettre les documents corrigés.</p>'
            : '<p style="margin: 5px 0; color: #374151;">Nous vous contacterons dès que possible avec les résultats de la révision.</p>'
          }
        </div>
        
        <div style="background-color: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #1e40af;"><strong>Besoin d'aide ?</strong></p>
          <p style="margin: 5px 0; color: #1e40af;">Notre équipe support est disponible pour vous accompagner. Contactez-nous si vous avez des questions.</p>
        </div>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">L'équipe Sama Naffa</p>
      </div>
    `,
  }

  await emailTransporter.sendMail(mailOptions)
}

export async function sendKYCStatusSMS(
  userPhone: string,
  kycStatus: 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW'
): Promise<void> {
  let message = ''
  
  switch (kycStatus) {
    case 'APPROVED':
      message = 'Félicitations ! Votre KYC Sama Naffa a été approuvé. Vous pouvez maintenant accéder à tous nos services.'
      break
    case 'REJECTED':
      message = 'Votre dossier KYC nécessite des corrections. Consultez votre portail client pour plus de détails.'
      break
    case 'UNDER_REVIEW':
      message = 'Votre dossier KYC est en cours de révision. Nous vous informerons dès que possible.'
      break
  }

  try {
    const authHeader = Buffer.from(`${BULKSMS_USERNAME}:${BULKSMS_PASSWORD}`).toString('base64')
    
    const requestBody = {
      to: userPhone,
      body: message,
    }
    
    const response = await fetch(BULKSMS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + authHeader,
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`BulkSMS API error (${response.status}): ${JSON.stringify(errorData)}`)
    }

    console.log('✅ KYC status SMS sent successfully:', await response.json())
  } catch (error) {
    console.error('❌ Error sending KYC status SMS:', error)
    throw error
  }
}

export async function sendPEELeadEmail(
  data: {
    civilite: string
    prenom: string
    nom: string
    categorie: string
    pays: string
    ville: string
    telephone: string
    email?: string
  }
): Promise<void> {
  const { civilite, prenom, nom, categorie, pays, ville, telephone, email } = data
  const date = new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Dakar' })

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'contact@everestfin.com',
    subject: `Nouveau Lead PEE - ${prenom} ${nom}`,
    replyTo: email || undefined,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Nouveau Lead PEE (Plan Épargne Éducation)</h2>
        <p><strong>Date:</strong> ${date}</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin: 0 0 15px 0;">Informations du prospect</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Civilité:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${civilite}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Prénom:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${prenom}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Nom:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${nom}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Catégorie:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${categorie}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Pays:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${pays}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Ville:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${ville}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Téléphone:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${telephone}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Email:</strong></td>
              <td style="padding: 8px 0;">${email || 'Non renseigné'}</td>
            </tr>
          </table>
        </div>
        
        <p style="color: #6b7280; font-size: 14px;">Source: Landing Page PEE</p>
      </div>
    `,
  }

  await emailTransporter.sendMail(mailOptions)
}
