import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
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

    const accounts = await prisma.userAccount.findMany({
      where: { userId: session.user.id, accountType: 'SAMA_NAFFA' },
      take: 1,
    });
    const account = accounts[0];

    if (!account) {
      return NextResponse.json({ error: 'Compte Sama Naffa introuvable' }, { status: 404 });
    }

    await prisma.userAccount.update({
      where: { id: account.id },
      data: {
        productCode: product.productCode,
        productName: product.name,
        interestRate: product.interestRate.toFixed(2),
        lockPeriodMonths: product.lockPeriodMonths ?? 0,
        allowAdditionalDeposits: product.allowAdditionalDeposits,
      },
    });

    return NextResponse.json({ success: true, product: { id: product.id, name: product.name } });
  } catch (error) {
    console.error('[onboarding/apply-formula]', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
