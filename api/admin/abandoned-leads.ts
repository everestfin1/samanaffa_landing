import type { VercelRequest, VercelResponse } from '@vercel/node'
import { desc, sql } from 'drizzle-orm'
import { db, formDrafts } from '../_db'
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
    const drafts = await db.select().from(formDrafts).orderBy(desc(formDrafts.lastActivityAt))

    const statsResult = await db
      .select({
        total: sql<number>`count(*)`,
        abandoned: sql<number>`count(*) filter (where ${formDrafts.status} = 'ABANDONED')`,
        contacted: sql<number>`count(*) filter (where ${formDrafts.status} = 'CONTACTED')`,
        converted: sql<number>`count(*) filter (where ${formDrafts.status} = 'CONVERTED')`,
        dismissed: sql<number>`count(*) filter (where ${formDrafts.status} = 'DISMISSED')`,
      })
      .from(formDrafts)

    const stats = {
      total: Number(statsResult[0]?.total || 0),
      abandoned: Number(statsResult[0]?.abandoned || 0),
      contacted: Number(statsResult[0]?.contacted || 0),
      converted: Number(statsResult[0]?.converted || 0),
      dismissed: Number(statsResult[0]?.dismissed || 0),
    }

    return res.status(200).json({ success: true, drafts, stats })
  } catch (error) {
    console.error('Error fetching abandoned leads:', error)
    return res.status(500).json({ success: false, error: 'Erreur lors de la récupération des leads abandonnés' })
  }
}
