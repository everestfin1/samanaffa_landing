import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';

const MAX_SIGNATURE_CHARS = 800_000; // ~PNG data URL cap

/**
 * Persist Momar E8 mandate acceptance + electronic signature.
 * Sets termsAccepted (CGSM) and stores signature on the user row.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const body = (await request.json()) as {
      signature?: string;
      mandateAccepted?: boolean;
    };

    if (body.mandateAccepted !== true) {
      return NextResponse.json(
        { error: 'Vous devez accepter la convention de gestion sous mandat (CGSM).' },
        { status: 400 },
      );
    }

    const signature = typeof body.signature === 'string' ? body.signature.trim() : '';
    if (!signature.startsWith('data:image/')) {
      return NextResponse.json({ error: 'Signature invalide.' }, { status: 400 });
    }
    if (signature.length > MAX_SIGNATURE_CHARS) {
      return NextResponse.json({ error: 'Signature trop volumineuse.' }, { status: 400 });
    }

    const [user] = await db
      .select({
        id: users.id,
        termsAccepted: users.termsAccepted,
      })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });
    }

    const now = new Date();
    const updateData: {
      signature: string;
      termsAccepted?: boolean;
      termsAcceptedAt?: Date;
    } = { signature };

    if (!user.termsAccepted) {
      updateData.termsAccepted = true;
      updateData.termsAcceptedAt = now;
    }

    await db.update(users).set(updateData).where(eq(users.id, session.user.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[onboarding/mandate]', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
