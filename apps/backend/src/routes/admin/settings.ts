import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { requireAdmin } from '../../middleware/auth.js'

const app = new Hono()

// Apply admin authentication middleware to all routes
app.use('*', requireAdmin)

// Schema for notification settings
const notificationSettingsSchema = z.object({
  enableEmailNotifications: z.boolean().default(true),
  enableSMSNotifications: z.boolean().default(false),
  enableKYCApprovalSMS: z.boolean().default(false),
  enableKYCRejectionSMS: z.boolean().default(true),
  enableKYCUnderReviewSMS: z.boolean().default(false),
  enableTransactionSMS: z.boolean().default(false),
  smsOnlyForCritical: z.boolean().default(true),
  emailTemplate: z.string().default('default'),
  smsTemplate: z.string().default('default')
})

// In-memory storage for settings (in production, this should be in a database)
let notificationSettings: z.infer<typeof notificationSettingsSchema> = {
  enableEmailNotifications: true,
  enableSMSNotifications: false,
  enableKYCApprovalSMS: false,
  enableKYCRejectionSMS: true,
  enableKYCUnderReviewSMS: false,
  enableTransactionSMS: false,
  smsOnlyForCritical: true,
  emailTemplate: 'default',
  smsTemplate: 'default'
}

// GET /api/admin/settings/notifications
app.get('/notifications', async (c) => {
  try {
    return c.json({
      success: true,
      settings: notificationSettings
    })
  } catch (error) {
    console.error('Error fetching notification settings:', error)
    return c.json({
      success: false,
      error: 'Failed to fetch notification settings'
    }, 500)
  }
})

// PUT /api/admin/settings/notifications
app.put('/notifications', zValidator('json', notificationSettingsSchema), async (c) => {
  try {
    const settings = c.req.valid('json')
    
    // Update settings (in production, save to database)
    notificationSettings = settings
    
    return c.json({
      success: true,
      message: 'Notification settings updated successfully',
      settings: notificationSettings
    })
  } catch (error) {
    console.error('Error updating notification settings:', error)
    return c.json({
      success: false,
      error: 'Failed to update notification settings'
    }, 500)
  }
})

export default app
