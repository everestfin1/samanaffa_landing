export interface NotificationSettings {
  enableEmailNotifications: boolean
  enableSMSNotifications: boolean
  enableKYCApprovalSMS: boolean
  enableKYCRejectionSMS: boolean
  enableKYCUnderReviewSMS: boolean
  enableTransactionSMS: boolean
  smsOnlyForCritical: boolean
  emailTemplate: string
  smsTemplate: string
}

// Default notification settings
const DEFAULT_SETTINGS: NotificationSettings = {
  enableEmailNotifications: true,
  enableSMSNotifications: false,
  enableKYCApprovalSMS: false,
  enableKYCRejectionSMS: true, // Only critical rejections by default
  enableKYCUnderReviewSMS: false,
  enableTransactionSMS: false,
  smsOnlyForCritical: true,
  emailTemplate: 'default',
  smsTemplate: 'default'
}

// Get current notification settings
export async function getNotificationSettings(): Promise<NotificationSettings> {
  try {
    // Try to fetch from API
    const response = await fetch('/api/admin/settings/notifications', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      return data.settings || DEFAULT_SETTINGS
    }
  } catch (error) {
    console.log('Using default notification settings due to error:', error)
  }
  
  return DEFAULT_SETTINGS
}

// Server-side function to get settings
export function getServerSideNotificationSettings(): NotificationSettings {
  // Return stored settings or defaults
  return (global as any).notificationSettings || DEFAULT_SETTINGS
}

// Check if SMS should be sent for a specific KYC status
export function shouldSendKYCSMS(
  kycStatus: 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW',
  settings: NotificationSettings
): boolean {
  // Individual KYC SMS settings are now independent of the master SMS switch
  // This allows admins to configure specific KYC SMS settings even when general SMS is off
  
  switch (kycStatus) {
    case 'APPROVED':
      return settings.enableKYCApprovalSMS
    case 'REJECTED':
      return settings.enableKYCRejectionSMS
    case 'UNDER_REVIEW':
      return settings.enableKYCUnderReviewSMS
    default:
      return false
  }
}

// Check if email should be sent (usually always true for KYC)
export function shouldSendKYCEmail(
  kycStatus: 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW',
  settings: NotificationSettings
): boolean {
  return settings.enableEmailNotifications
}

// Check if SMS should be sent for transactions
export function shouldSendTransactionSMS(settings: NotificationSettings): boolean {
  // Transaction SMS is now independent of the master SMS switch
  return settings.enableTransactionSMS
}
