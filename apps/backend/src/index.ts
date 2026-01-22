import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

import adminAuth from './routes/admin/auth.js'
import adminUsers from './routes/admin/users.js'
import adminTransactions from './routes/admin/transactions.js'
import adminLeads from './routes/admin/leads.js'
import adminApeSubscriptions from './routes/admin/ape-subscriptions.js'
import paymentsIntouch from './routes/payments/intouch.js'

const app = new Hono()

// Middleware
app.use('*', logger())
app.use('*', cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}))

// Health check
app.get('/', (c) => c.json({ status: 'ok', service: 'samanaffa-backend' }))
app.get('/health', (c) => c.json({ status: 'healthy', timestamp: new Date().toISOString() }))

// Admin routes
app.route('/admin/auth', adminAuth)
app.route('/admin/users', adminUsers)
app.route('/admin/transactions', adminTransactions)
app.route('/admin/leads', adminLeads)
app.route('/admin/ape-subscriptions', adminApeSubscriptions)

// Payment callbacks
app.route('/payments/intouch', paymentsIntouch)

export default app
