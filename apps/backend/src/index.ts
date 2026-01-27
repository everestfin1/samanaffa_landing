import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

import adminAuth from './routes/admin/auth.js'
import adminDashboard from './routes/admin/dashboard.js'
import adminUsers from './routes/admin/users.js'
import adminTransactions from './routes/admin/transactions.js'
import adminLeads from './routes/admin/leads.js'
import adminApeSubscriptions from './routes/admin/ape-subscriptions.js'
import adminKyc from './routes/admin/kyc.js'
import adminSponsorCodes from './routes/admin/sponsor-codes.js'
import adminPeeLeads from './routes/admin/pee-leads.js'
import adminAbandonedLeads from './routes/admin/abandoned-leads.js'
import adminAccounts from './routes/admin/accounts.js'
import adminSettings from './routes/admin/settings.js'
import adminReconciliation from './routes/admin/reconciliation.js'
import telemetry from './routes/telemetry.js'
import paymentsIntouch from './routes/payments/intouch.js'

const app = new Hono()

// Middleware
app.use('*', logger())
app.use(
  '*',
  cors({
    origin: (origin) => {
      // Allow requests without Origin header (e.g., favicon.ico, same-origin requests)
      if (!origin) return '*'

      const allowed = new Set<string>([
        'http://localhost:3000',
        process.env.FRONTEND_URL,
      ].filter(Boolean) as string[])

      if (allowed.has(origin)) return origin

      try {
        const url = new URL(origin)
        if (url.hostname.endsWith('.vercel.app')) return origin
      } catch {
        // Invalid URL, reject
        return null
      }

      // Origin not in allowed list, reject
      return null
    },
    credentials: true,
  }),
)

// Health check
app.get('/', (c) => c.json({ status: 'ok', service: 'samanaffa-backend' }))
app.get('/health', (c) => c.json({ status: 'healthy', timestamp: new Date().toISOString() }))

// Admin routes (dual prefix for compatibility)
app.route('/admin/auth', adminAuth)
app.route('/admin/dashboard', adminDashboard)
app.route('/admin/users', adminUsers)
app.route('/admin/transactions', adminTransactions)
app.route('/admin/leads', adminLeads)
app.route('/admin/kyc', adminKyc)
app.route('/admin/ape-subscriptions', adminApeSubscriptions)
app.route('/admin/sponsor-codes', adminSponsorCodes)
app.route('/admin/pee-leads', adminPeeLeads)
app.route('/admin/abandoned-leads', adminAbandonedLeads)
app.route('/admin/reconciliation', adminReconciliation)
app.route('/admin/accounts', adminAccounts)
app.route('/admin/settings', adminSettings)
app.route('/api/telemetry', telemetry)

// API prefixed admin routes (for frontend proxy)
app.route('/api/admin/auth', adminAuth)
app.route('/api/admin/dashboard', adminDashboard)
app.route('/api/admin/users', adminUsers)
app.route('/api/admin/transactions', adminTransactions)
app.route('/api/admin/leads', adminLeads)
app.route('/api/admin/kyc', adminKyc)
app.route('/api/admin/ape-subscriptions', adminApeSubscriptions)
app.route('/api/admin/sponsor-codes', adminSponsorCodes)
app.route('/api/admin/pee-leads', adminPeeLeads)
app.route('/api/admin/abandoned-leads', adminAbandonedLeads)
app.route('/api/admin/reconciliation', adminReconciliation)
app.route('/api/admin/accounts', adminAccounts)
app.route('/api/admin/settings', adminSettings)

// Payment callbacks
app.route('/payments/intouch', paymentsIntouch)
app.route('/api/payments/intouch', paymentsIntouch)

export default app
