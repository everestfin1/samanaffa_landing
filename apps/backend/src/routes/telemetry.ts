import { Hono } from 'hono'
import { db, sql } from '../lib/db.js'
import { formDrafts } from '../lib/schema.js'

const app = new Hono()

// POST /api/telemetry/events - Placeholder for event ingestion
app.post('/events', async (c) => {
  try {
    const { events } = await c.req.json()
    // For now, we just acknowledge receipt
    // Future: batch insert into events table for advanced analytics
    return c.json({ success: true, processed: events?.length || 0 })
  } catch (error) {
    console.error('Error processing telemetry events:', error)
    return c.json({ success: false, error: 'Failed to process events' }, 500)
  }
})

// POST /api/telemetry/draft - Save or update a form draft
app.post('/draft', async (c) => {
  try {
    const payload = await c.req.json()
    const { 
      anonymousId, 
      formType, 
      draftData, 
      email, 
      phone, 
      stepReached, 
      fieldsCompleted, 
      totalFields, 
      source, 
      deviceInfo 
    } = payload

    if (!anonymousId || !formType) {
      return c.json({ success: false, error: 'Missing required fields' }, 400)
    }

    // Calculate engagement score (0-100)
    const score = totalFields ? Math.round((fieldsCompleted / totalFields) * 100) : 0

    // Upsert draft based on anonymousId and formType
    const [existing] = await db.select().from(formDrafts)
      .where(sql`${formDrafts.anonymousId} = ${anonymousId} AND ${formDrafts.formType} = ${formType}`)
      .limit(1)

    if (existing) {
      await db.update(formDrafts)
        .set({
          draftData,
          email: email || existing.email,
          phone: phone || existing.phone,
          stepReached,
          fieldsCompleted,
          totalFields,
          score,
          lastActivityAt: new Date(),
        })
        .where(sql`${formDrafts.id} = ${existing.id}`)
    } else {
      await db.insert(formDrafts).values({
        id: crypto.randomUUID(),
        anonymousId,
        formType,
        draftData,
        email,
        phone,
        stepReached,
        fieldsCompleted,
        totalFields,
        score,
        source,
        deviceInfo,
        status: 'ABANDONED',
        firstSeenAt: new Date(),
        lastActivityAt: new Date(),
      })
    }

    return c.json({ success: true })
  } catch (error) {
    console.error('Error saving form draft:', error)
    return c.json({ success: false, error: 'Failed to save draft' }, 500)
  }
})

export default app
