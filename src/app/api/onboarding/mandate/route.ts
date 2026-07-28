import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { isSignatureStorageConfigured } from '@/lib/storage/config';
import { persistMandateSignature } from '@/lib/storage/signatures';
import { isPersistedSignature, isValidSignatureDataUrl } from '@/lib/signature';

const MAX_SIGNATURE_CHARS = 800_000;

/**
 * Persist Momar E8 mandate acceptance + electronic signature.
 * Signature PNG is uploaded to Cloudflare R2 (S3-compatible) when configured;
 * otherwise stored inline on the user row (local dev fallback).
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const body = (await request.json()) as {
      signature?: string;
      cguAccepted?: boolean;
      mandateAccepted?: boolean;
    };

    if (body.cguAccepted !== true) {
      return NextResponse.json(
        { error: 'Vous devez accepter les conditions générales d\'utilisation (CGU).' },
        { status: 400 },
      );
    }

    if (body.mandateAccepted !== true) {
      return NextResponse.json(
        { error: 'Vous devez accepter la convention de gestion sous mandat (CGSM).' },
        { status: 400 },
      );
    }

    const signatureInput = typeof body.signature === 'string' ? body.signature.trim() : '';
    if (!isValidSignatureDataUrl(signatureInput)) {
      return NextResponse.json({ error: 'Signature invalide.' }, { status: 400 });
    }
    if (signatureInput.length > MAX_SIGNATURE_CHARS) {
      return NextResponse.json({ error: 'Signature trop volumineuse.' }, { status: 400 });
    }

    if (process.env.NODE_ENV === 'production' && !isSignatureStorageConfigured()) {
      console.error('[onboarding/mandate] S3_BUCKET_SIGNATURES not configured in production');
      return NextResponse.json(
        { error: 'Le stockage des signatures n\'est pas configuré.' },
        { status: 503 },
      );
    }

    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });
    }

    const persisted = await persistMandateSignature(session.user.id, signatureInput);

    const now = new Date();
    const [updated] = await db
      .update(users)
      .set({
        signature: persisted.storedValue,
        termsAccepted: true,
        termsAcceptedAt: now,
      })
      .where(eq(users.id, session.user.id))
      .returning({
        signature: users.signature,
        termsAccepted: users.termsAccepted,
      });

    if (!updated?.termsAccepted || !isPersistedSignature(updated.signature)) {
      console.error('[onboarding/mandate] signature persist verification failed', {
        userId: session.user.id,
        storageBackend: persisted.storageBackend,
      });
      return NextResponse.json(
        { error: 'La signature n\'a pas pu être enregistrée. Veuillez réessayer.' },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      signatureSaved: true,
      storageBackend: persisted.storageBackend,
    });
  } catch (error) {
    console.error('[onboarding/mandate]', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
