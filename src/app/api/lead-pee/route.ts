import { NextResponse } from 'next/server';
import { sendPEELeadEmail } from '@/lib/notifications';
import { db } from '@/lib/db';
import { peeLeads } from '@/lib/db/schema';
import { isLegacyCampaignDeprecated, legacyCampaignGoneResponse } from '@/lib/legacy-campaign-deprecation';

/** @deprecated PEE campaign inactive — route kept for explicit 410 responses. */
export async function POST(req: Request) {
  if (isLegacyCampaignDeprecated()) {
    return legacyCampaignGoneResponse();
  }

  try {
    const body = await req.json();
    const { civilite, prenom, nom, categorie, pays, ville, telephone, email } = body;

    if (!civilite || !prenom || !nom || !categorie || !pays || !ville || !telephone) {
      return NextResponse.json(
        { error: 'Tous les champs obligatoires doivent être remplis' },
        { status: 400 },
      );
    }

    if (telephone.replace(/\D/g, '').length < 8) {
      return NextResponse.json({ error: 'Numéro de téléphone invalide' }, { status: 400 });
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json({ error: 'Adresse email invalide' }, { status: 400 });
      }
    }

    const referenceNumber = `PEE-LEGACY-${Date.now()}`;

    const [newLead] = await db
      .insert(peeLeads)
      .values({
        referenceNumber,
        civilite,
        prenom,
        nom,
        categorie,
        pays,
        ville,
        telephone,
        email: email || null,
        montantCfa: '0',
        status: 'PENDING',
        crmStatus: 'NEW',
      })
      .returning();

    await sendPEELeadEmail({
      civilite,
      prenom,
      nom,
      categorie,
      pays,
      ville,
      telephone,
      email,
    });

    return NextResponse.json({
      success: true,
      message: 'Demande envoyée avec succès',
      leadId: newLead.id,
    });
  } catch (error) {
    console.error('Error submitting PEE lead:', error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de l'envoi de votre demande." },
      { status: 500 },
    );
  }
}
