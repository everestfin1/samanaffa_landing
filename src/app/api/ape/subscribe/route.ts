import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { apeSubscriptions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// Generate a unique reference number for APE subscriptions
function generateReferenceNumber(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 10);
  return `APE-${timestamp}-${random}`.toUpperCase();
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

// Parse amount from formatted string (e.g., "10 000" -> 10000)
function parseAmount(amountStr: string): number {
  return parseInt(amountStr.replace(/\s/g, ''), 10);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      civilite,
      prenom,
      nom,
      email,
      telephone,
      pays_residence,
      ville,
      categorie_socioprofessionnelle,
      tranche_interesse,
      montant_cfa,
      code_parrainage,
    } = body;

    // Validate required fields
    const requiredFields = [
      { field: 'civilite', value: civilite },
      { field: 'prenom', value: prenom },
      { field: 'nom', value: nom },
      { field: 'email', value: email },
      { field: 'telephone', value: telephone },
      { field: 'pays_residence', value: pays_residence },
      { field: 'ville', value: ville },
      { field: 'categorie_socioprofessionnelle', value: categorie_socioprofessionnelle },
      { field: 'tranche_interesse', value: tranche_interesse },
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

    // Validate email
    if (!isValidEmail(email)) {
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
    if (isNaN(amount) || amount < 10000) {
      return NextResponse.json(
        { success: false, error: 'Le montant minimum est de 10 000 FCFA' },
        { status: 400 }
      );
    }

    // Generate unique reference number
    const referenceNumber = generateReferenceNumber();

    // Create subscription record
    const [subscription] = await db
      .insert(apeSubscriptions)
      .values({
        referenceNumber,
        civilite: civilite.trim(),
        prenom: prenom.trim(),
        nom: nom.trim(),
        email: email.trim().toLowerCase(),
        telephone: telephone.trim(),
        paysResidence: pays_residence.trim(),
        ville: ville.trim(),
        categorieSocioprofessionnelle: categorie_socioprofessionnelle.trim(),
        trancheInteresse: tranche_interesse.trim(),
        montantCfa: amount.toString(),
        codeParrainage: code_parrainage?.trim() || null,
        status: 'PENDING',
      })
      .returning();

    console.log('[APE Subscribe] Created subscription:', {
      id: subscription.id,
      referenceNumber: subscription.referenceNumber,
      email: subscription.email,
      amount,
      tranche: subscription.trancheInteresse,
      codeParrainage: subscription.codeParrainage,
    });

    return NextResponse.json({
      success: true,
      subscription: {
        id: subscription.id,
        referenceNumber: subscription.referenceNumber,
        amount,
        tranche: subscription.trancheInteresse,
      },
    });
  } catch (error) {
    console.error('[APE Subscribe] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la création de la souscription' },
      { status: 500 }
    );
  }
}

// Update subscription status after payment
export async function PATCH(request: NextRequest) {
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
      .from(apeSubscriptions)
      .where(eq(apeSubscriptions.referenceNumber, referenceNumber))
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
      .update(apeSubscriptions)
      .set(updateData)
      .where(eq(apeSubscriptions.referenceNumber, referenceNumber))
      .returning();

    console.log('[APE Subscribe] Updated subscription:', {
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
    console.error('[APE Subscribe] PATCH Error:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la mise à jour de la souscription' },
      { status: 500 }
    );
  }
}

// Get subscription by reference number
export async function GET(request: NextRequest) {
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
      .from(apeSubscriptions)
      .where(eq(apeSubscriptions.referenceNumber, referenceNumber))
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
        trancheInteresse: subscription.trancheInteresse,
        montantCfa: subscription.montantCfa,
        status: subscription.status,
        createdAt: subscription.createdAt,
      },
    });
  } catch (error) {
    console.error('[APE Subscribe] GET Error:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération de la souscription' },
      { status: 500 }
    );
  }
}
