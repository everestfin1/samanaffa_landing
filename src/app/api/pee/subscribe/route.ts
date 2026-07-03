import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { peeLeads } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { guardLegacyCampaignApi } from '@/lib/legacy-campaign-deprecation';

const MIN_PEE_INVESTMENT_CFA = Number(process.env.PEE_MIN_INVESTMENT_CFA ?? '30000');
const PEE_INVESTMENT_INCREMENT_CFA = Number(process.env.PEE_INVESTMENT_INCREMENT_CFA ?? '5000');

// Generate a unique reference number for PEE subscriptions
function generateReferenceNumber(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 10);
  return `PEE-${timestamp}-${random}`.toUpperCase();
}

// Validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate phone format (basic validation)
function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[0-9]{7,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Parse amount from formatted string (e.g., "30 000" -> 30000)
function parseAmount(amountStr: string): number {
  return parseInt(amountStr.replace(/\s/g, ''), 10);
}

// Validate amount is in valid increments
function isValidIncrement(amount: number): boolean {
  const remainder = (amount - MIN_PEE_INVESTMENT_CFA) % PEE_INVESTMENT_INCREMENT_CFA;
  return remainder === 0;
}

export async function POST(request: NextRequest) {
  const blocked = guardLegacyCampaignApi();
  if (blocked) return blocked;

  try {
    const body = await request.json();

    const {
      civilite,
      prenom,
      nom,
      email,
      telephone,
      pays,
      ville,
      categorie,
      montant_cfa,
    } = body;

    // Validate required fields
    const requiredFields = [
      { field: 'civilite', value: civilite },
      { field: 'prenom', value: prenom },
      { field: 'nom', value: nom },
      { field: 'telephone', value: telephone },
      { field: 'pays', value: pays },
      { field: 'ville', value: ville },
      { field: 'categorie', value: categorie },
      { field: 'montant_cfa', value: montant_cfa },
    ];

    const missingFields = requiredFields.filter(f => !f.value || f.value.trim() === '');
    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Champs requis manquants',
          missingFields: missingFields.map(f => f.field),
        },
        { status: 400 }
      );
    }

    // Validate email if provided
    if (email && !isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Adresse email invalide' },
        { status: 400 }
      );
    }

    // Validate phone
    if (!isValidPhone(telephone)) {
      return NextResponse.json(
        { success: false, error: 'Numéro de téléphone invalide' },
        { status: 400 }
      );
    }

    // Parse and validate amount
    const amount = parseAmount(montant_cfa);
    if (isNaN(amount) || amount < MIN_PEE_INVESTMENT_CFA) {
      return NextResponse.json(
        {
          success: false,
          error: `Le montant minimum est de ${MIN_PEE_INVESTMENT_CFA.toLocaleString('fr-FR')} FCFA`,
        },
        { status: 400 }
      );
    }

    // Validate amount increment
    if (!isValidIncrement(amount)) {
      return NextResponse.json(
        {
          success: false,
          error: `Le montant doit être un multiple de ${PEE_INVESTMENT_INCREMENT_CFA.toLocaleString('fr-FR')} FCFA au-dessus du minimum`,
        },
        { status: 400 }
      );
    }

    // Generate unique reference number
    const referenceNumber = generateReferenceNumber();

    // Create subscription record
    const [subscription] = await db
      .insert(peeLeads)
      .values({
        referenceNumber,
        civilite: civilite.trim(),
        prenom: prenom.trim(),
        nom: nom.trim(),
        email: email?.trim().toLowerCase() || null,
        telephone: telephone.trim(),
        pays: pays.trim(),
        ville: ville.trim(),
        categorie: categorie.trim(),
        montantCfa: amount.toString(),
        status: 'PENDING',
      })
      .returning();

    console.log('[PEE Subscribe] Created subscription:', {
      id: subscription.id,
      referenceNumber: subscription.referenceNumber,
      email: subscription.email,
      amount,
    });

    return NextResponse.json({
      success: true,
      subscription: {
        id: subscription.id,
        referenceNumber: subscription.referenceNumber,
        amount,
      },
    });
  } catch (error) {
    console.error('[PEE Subscribe] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la création de la souscription' },
      { status: 500 }
    );
  }
}

// Update subscription status after payment
export async function PATCH(request: NextRequest) {
  const blocked = guardLegacyCampaignApi();
  if (blocked) return blocked;

  try {
    const body = await request.json();
    const { referenceNumber, status, providerTransactionId, providerStatus, callbackPayload } = body;

    if (!referenceNumber) {
      return NextResponse.json(
        { success: false, error: 'Référence manquante' },
        { status: 400 }
      );
    }

    // Find subscription
    const [existingSubscription] = await db
      .select()
      .from(peeLeads)
      .where(eq(peeLeads.referenceNumber, referenceNumber))
      .limit(1);

    if (!existingSubscription) {
      return NextResponse.json(
        { success: false, error: 'Souscription non trouvée' },
        { status: 404 }
      );
    }

    // Update subscription
    const updateData: Record<string, unknown> = {};
    
    if (status) {
      updateData.status = status;
      if (status === 'PAYMENT_INITIATED') {
        updateData.paymentInitiatedAt = new Date();
      } else if (status === 'PAYMENT_SUCCESS' || status === 'PAYMENT_FAILED') {
        updateData.paymentCompletedAt = new Date();
      }
    }
    
    if (providerTransactionId) {
      updateData.providerTransactionId = providerTransactionId;
    }
    
    if (providerStatus) {
      updateData.providerStatus = providerStatus;
    }
    
    if (callbackPayload) {
      updateData.paymentCallbackPayload = callbackPayload;
    }

    const [updatedSubscription] = await db
      .update(peeLeads)
      .set(updateData)
      .where(eq(peeLeads.referenceNumber, referenceNumber))
      .returning();

    console.log('[PEE Subscribe] Updated subscription:', {
      referenceNumber,
      status: updatedSubscription.status,
      providerTransactionId: updatedSubscription.providerTransactionId,
    });

    return NextResponse.json({
      success: true,
      subscription: {
        id: updatedSubscription.id,
        referenceNumber: updatedSubscription.referenceNumber,
        status: updatedSubscription.status,
      },
    });
  } catch (error) {
    console.error('[PEE Subscribe] PATCH Error:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la mise à jour de la souscription' },
      { status: 500 }
    );
  }
}

// Get subscription by reference number
export async function GET(request: NextRequest) {
  const blocked = guardLegacyCampaignApi();
  if (blocked) return blocked;

  try {
    const { searchParams } = new URL(request.url);
    const referenceNumber = searchParams.get('referenceNumber');

    if (!referenceNumber) {
      return NextResponse.json(
        { success: false, error: 'Référence manquante' },
        { status: 400 }
      );
    }

    const [subscription] = await db
      .select()
      .from(peeLeads)
      .where(eq(peeLeads.referenceNumber, referenceNumber))
      .limit(1);

    if (!subscription) {
      return NextResponse.json(
        { success: false, error: 'Souscription non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      subscription: {
        id: subscription.id,
        referenceNumber: subscription.referenceNumber,
        prenom: subscription.prenom,
        nom: subscription.nom,
        email: subscription.email,
        montantCfa: subscription.montantCfa,
        status: subscription.status,
        createdAt: subscription.createdAt,
      },
    });
  } catch (error) {
    console.error('[PEE Subscribe] GET Error:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération de la souscription' },
      { status: 500 }
    );
  }
}
