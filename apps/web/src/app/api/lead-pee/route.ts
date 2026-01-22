import { NextResponse } from 'next/server';
import { sendPEELeadEmail } from '@/lib/notifications';
import { db } from '@/lib/db';
import { peeLeads } from '@/lib/db/schema';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { civilite, prenom, nom, categorie, pays, ville, telephone, email } = body;

    // Validation
    if (!civilite || !prenom || !nom || !categorie || !pays || !ville || !telephone) {
      return NextResponse.json(
        { error: 'Tous les champs obligatoires doivent être remplis' },
        { status: 400 }
      );
    }

    // Phone validation (basic check)
    // Regex allows optional + at start, followed by digits, spaces, dashes
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im;
    // We'll be lenient with phone validation as formats vary, but check it's not empty and has digits
    if (telephone.replace(/\D/g, '').length < 8) {
       return NextResponse.json(
        { error: 'Numéro de téléphone invalide' },
        { status: 400 }
      );
    }

    // Email validation if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: 'Adresse email invalide' },
          { status: 400 }
        );
      }
    }

    // Save to database
    const [newLead] = await db.insert(peeLeads).values({
      civilite,
      prenom,
      nom,
      categorie,
      pays,
      ville,
      telephone,
      email: email || null,
      status: 'NEW',
    }).returning();

    // Send Email notification
    await sendPEELeadEmail({
      civilite,
      prenom,
      nom,
      categorie,
      pays,
      ville,
      telephone,
      email
    });

    return NextResponse.json({ success: true, message: 'Demande envoyée avec succès', leadId: newLead.id });
  } catch (error) {
    console.error('Error submitting PEE lead:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de l\'envoi de votre demande.' },
      { status: 500 }
    );
  }
}
