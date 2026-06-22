import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { and, eq } from 'drizzle-orm';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { userAccounts } from '@/lib/db/schema';
import { resolveProductForFormula } from '@/lib/onboarding-formula-map';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { formulaName } = await request.json();
    if (!formulaName || typeof formulaName !== 'string') {
      return NextResponse.json({ error: 'formulaName requis' }, { status: 400 });
    }

    const product = resolveProductForFormula(formulaName);

    const [account] = await db
      .select()
      .from(userAccounts)
      .where(
        and(
          eq(userAccounts.userId, session.user.id),
          eq(userAccounts.accountType, 'SAMA_NAFFA'),
        ),
      )
      .limit(1);

    if (!account) {
      return NextResponse.json({ error: 'Compte Sama Naffa introuvable' }, { status: 404 });
    }

    await db
      .update(userAccounts)
      .set({
        productCode: product.productCode,
        productName: product.name,
        interestRate: product.interestRate.toFixed(2),
        lockPeriodMonths: product.lockPeriodMonths ?? 0,
        allowAdditionalDeposits: product.allowAdditionalDeposits,
      })
      .where(eq(userAccounts.id, account.id));

    return NextResponse.json({ success: true, product: { id: product.id, name: product.name } });
  } catch (error) {
    console.error('[onboarding/apply-formula]', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
