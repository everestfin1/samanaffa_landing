import { Hono } from 'hono'
import { db, sql, gte, and, eq } from '../../lib/db.js'
import { users, transactionIntents, kycDocuments } from '../../lib/schema.js'
import { requireAdmin } from '../../middleware/auth.js'

const app = new Hono()

app.use('*', requireAdmin)

app.get('/stats', async (c) => {
  try {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - 7)

    // Get total users and this month's users
    const [totalUsersResult, thisMonthUsersResult, lastMonthUsersResult] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(users),
      db.select({ count: sql<number>`count(*)` }).from(users).where(gte(users.createdAt, startOfMonth)),
      db.select({ count: sql<number>`count(*)` }).from(users).where(
        and(gte(users.createdAt, startOfLastMonth), sql`${users.createdAt} < ${startOfMonth}`)
      ),
    ])

    // Get transaction stats
    const [totalTxResult, thisMonthTxResult, lastMonthTxResult, volumeResult, lastMonthVolumeResult] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(transactionIntents),
      db.select({ count: sql<number>`count(*)` }).from(transactionIntents).where(gte(transactionIntents.createdAt, startOfMonth)),
      db.select({ count: sql<number>`count(*)` }).from(transactionIntents).where(
        and(gte(transactionIntents.createdAt, startOfLastMonth), sql`${transactionIntents.createdAt} < ${startOfMonth}`)
      ),
      db.select({ total: sql<string>`COALESCE(SUM(amount), 0)` }).from(transactionIntents).where(eq(transactionIntents.status, 'COMPLETED')),
      db.select({ total: sql<string>`COALESCE(SUM(amount), 0)` }).from(transactionIntents).where(
        and(
          eq(transactionIntents.status, 'COMPLETED'),
          gte(transactionIntents.createdAt, startOfLastMonth),
          sql`${transactionIntents.createdAt} < ${startOfMonth}`
        )
      ),
    ])

    // Get pending KYC count
    const [pendingKycResult, lastWeekPendingKycResult] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(users).where(eq(users.kycStatus, 'PENDING')),
      db.select({ count: sql<number>`count(*)` }).from(users).where(
        and(eq(users.kycStatus, 'PENDING'), gte(users.createdAt, startOfWeek))
      ),
    ])

    // Get recent activity (last 10 events)
    const [recentUsers, recentTransactions, recentKyc] = await Promise.all([
      db.select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        createdAt: users.createdAt,
      }).from(users).orderBy(sql`${users.createdAt} DESC`).limit(5),
      db.select({
        id: transactionIntents.id,
        userId: transactionIntents.userId,
        amount: transactionIntents.amount,
        status: transactionIntents.status,
        intentType: transactionIntents.intentType,
        createdAt: transactionIntents.createdAt,
      }).from(transactionIntents).orderBy(sql`${transactionIntents.createdAt} DESC`).limit(5),
      db.select({
        id: kycDocuments.id,
        userId: kycDocuments.userId,
        documentType: kycDocuments.documentType,
        verificationStatus: kycDocuments.verificationStatus,
        uploadDate: kycDocuments.uploadDate,
      }).from(kycDocuments).orderBy(sql`${kycDocuments.uploadDate} DESC`).limit(5),
    ])

    // Calculate trends
    const totalUsers = Number(totalUsersResult[0].count)
    const thisMonthUsers = Number(thisMonthUsersResult[0].count)
    const lastMonthUsers = Number(lastMonthUsersResult[0].count)
    const usersTrend = lastMonthUsers > 0 ? Math.round(((thisMonthUsers - lastMonthUsers) / lastMonthUsers) * 100) : 0

    const totalTransactions = Number(totalTxResult[0].count)
    const thisMonthTx = Number(thisMonthTxResult[0].count)
    const lastMonthTx = Number(lastMonthTxResult[0].count)
    const txTrend = lastMonthTx > 0 ? Math.round(((thisMonthTx - lastMonthTx) / lastMonthTx) * 100) : 0

    const totalVolume = parseFloat(volumeResult[0].total) || 0
    const lastMonthVolume = parseFloat(lastMonthVolumeResult[0].total) || 0
    const thisMonthVolume = totalVolume - lastMonthVolume
    const volumeTrend = lastMonthVolume > 0 ? Math.round(((thisMonthVolume - lastMonthVolume) / lastMonthVolume) * 100) : 0

    const pendingKyc = Number(pendingKycResult[0].count)
    const lastWeekPendingKyc = Number(lastWeekPendingKycResult[0].count)
    const kycTrend = pendingKyc - lastWeekPendingKyc

    // Build recent activity list
    const recentActivity = [
      ...recentUsers.map(u => ({
        type: 'user_registration',
        action: 'Nouvelle inscription',
        user: `${u.firstName} ${u.lastName?.charAt(0)}.`,
        timestamp: u.createdAt,
      })),
      ...recentTransactions.filter(t => t.status === 'COMPLETED').map(t => ({
        type: 'transaction_completed',
        action: 'Transaction validée',
        user: t.userId.substring(0, 8) + '...',
        amount: t.amount,
        timestamp: t.createdAt,
      })),
      ...recentKyc.filter(k => k.verificationStatus === 'APPROVED').map(k => ({
        type: 'kyc_approved',
        action: 'KYC approuvé',
        user: k.userId.substring(0, 8) + '...',
        timestamp: k.uploadDate,
      })),
      ...recentTransactions.filter(t => t.intentType === 'DEPOSIT' && t.status === 'COMPLETED').map(t => ({
        type: 'deposit_received',
        action: 'Dépôt reçu',
        user: t.userId.substring(0, 8) + '...',
        amount: t.amount,
        timestamp: t.createdAt,
      })),
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10)

    return c.json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          trend: usersTrend,
          trendLabel: 'vs mois dernier',
        },
        transactions: {
          total: totalTransactions,
          trend: txTrend,
          trendLabel: 'vs mois dernier',
        },
        volume: {
          total: totalVolume,
          trend: volumeTrend,
          trendLabel: 'vs mois dernier',
        },
        pendingKyc: {
          total: pendingKyc,
          trend: kycTrend,
          trendLabel: 'vs semaine dernière',
        },
      },
      recentActivity,
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return c.json({ success: false, error: 'Internal server error' }, 500)
  }
})

export default app
