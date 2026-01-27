import nodemailer from 'nodemailer';
// @ts-ignore - twilio types resolution issue
import twilio from 'twilio';

// Email configuration
const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Twilio configuration
const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  try {
    if (!process.env.SMTP_HOST) {
      console.warn('SMTP_HOST not configured, skipping email');
      return;
    }
    await emailTransporter.sendMail({
      from: process.env.SMTP_FROM || '"Sama Naffa" <noreply@samanaffa.com>',
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}

export async function sendSms({ to, body }: { to: string; body: string }) {
  try {
    if (!twilioClient) {
      console.warn('Twilio not configured, skipping SMS');
      return;
    }
    await twilioClient.messages.create({
      body,
      from: process.env.TWILIO_FROM_NUMBER,
      to,
    });
  } catch (error) {
    console.error('Failed to send SMS:', error);
  }
}

export async function notifyKycStatusChange(user: { email: string; phone: string; firstName: string; lastName: string }, status: string) {
  const statusLabels: Record<string, string> = {
    APPROVED: 'Approuvé',
    REJECTED: 'Rejeté',
    UNDER_REVIEW: 'En cours de révision',
    PENDING: 'En attente',
  };

  const label = statusLabels[status] || status;
  const subject = `Mise à jour de votre statut KYC - Sama Naffa`;
  
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #059669;">Bonjour ${user.firstName},</h2>
      <p style="font-size: 16px; color: #475569;">
        La vérification de vos documents (KYC) a été mise à jour.
      </p>
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <p style="margin: 0; font-weight: bold; color: #1e293b;">Nouveau statut : ${label}</p>
      </div>
      <p style="font-size: 14px; color: #64748b;">
        Si vous avez des questions, n'hésitez pas à nous contacter.
      </p>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="font-size: 12px; color: #94a3b8; text-align: center;">
        L'équipe Sama Naffa
      </p>
    </div>
  `;

  await sendEmail({ to: user.email, subject, html });

  if (status === 'APPROVED' || status === 'REJECTED') {
    const smsBody = `Sama Naffa: Votre statut de vérification est maintenant : ${label}.`;
    await sendSms({ to: user.phone, body: smsBody });
  }
}
