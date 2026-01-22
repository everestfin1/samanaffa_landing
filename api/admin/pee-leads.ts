import type { VercelRequest, VercelResponse } from '@vercel/node'
import { desc, sql } from 'drizzle-orm'
import { db, peeLeads } from '../_db'
import { requireAdmin } from './_requireAdmin'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const admin = await requireAdmin(req)
  if (!admin) {
    return res.status(401).json({ success: false, error: 'Unauthorized' })
  }

  try {
    const leads = await db.select().from(peeLeads).orderBy(desc(peeLeads.createdAt))

    const statsResult = await db
      .select({
        total: sql<number>`count(*)`,
        new: sql<number>`count(*) filter (where ${peeLeads.status} = 'NEW')`,
        contacted: sql<number>`count(*) filter (where ${peeLeads.status} = 'CONTACTED')`,
        converted: sql<number>`count(*) filter (where ${peeLeads.status} = 'CONVERTED')`,
      })
      .from(peeLeads)

    const stats = {
      total: Number(statsResult[0]?.total || 0),
      new: Number(statsResult[0]?.new || 0),
      contacted: Number(statsResult[0]?.contacted || 0),
      converted: Number(statsResult[0]?.converted || 0),
    }

    return res.status(200).json({ success: true, leads, stats })
  } catch (error) {
    console.error('Error fetching PEE leads:', error)
    return res.status(500).json({ success: false, error: 'Erreur lors de la récupération des leads' })
  }
}
