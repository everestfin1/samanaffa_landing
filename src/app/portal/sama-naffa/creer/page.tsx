'use client';

import { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useUserProfile } from '../../../../hooks/useUserProfile';
import PortalHeader from '../../../../components/portal/PortalHeader';
import E3CreateKondanne, {
  type E3CreateResult,
} from '../../../../components/onboarding/E3CreateKondanne';
import { NATTUKAAY_PROJECTS } from '../../../../components/data/nattukaay-projects';
import {
  buildNaffaAccountPayload,
  getObjectiveBySlug,
} from '@/lib/naffa-plan';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

type KYCStatus = 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';

export default function CreerKondannePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session, status } = useSession();
  const { data: userData, isLoading, error: profileError } = useUserProfile();

  useEffect(() => {
    document.documentElement.classList.add('c1-dashboard');
    document.body.classList.add('c1-dashboard');
    return () => {
      document.documentElement.classList.remove('c1-dashboard');
      document.body.classList.remove('c1-dashboard');
    };
  }, []);

  if (status === 'loading' || isLoading) {
    return (
      <div className="c1-page c1-page--soft c1-page--center">
        <p className="text-night/70">Chargement...</p>
      </div>
    );
  }

  if (!session) {
    router.push('/login');
    return null;
  }

  if (profileError || !userData) {
    return (
      <div className="c1-page c1-page--soft c1-page--center">
        <div className="text-center px-4">
          <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-night/70 mb-4">Erreur lors du chargement</p>
          <button type="button" className="c1-create" onClick={() => window.location.reload()}>
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const kycStatus = (userData.kycStatus as KYCStatus) || 'PENDING';

  const handleCreate = async (result: E3CreateResult) => {
    const nattukaay =
      NATTUKAAY_PROJECTS.find((p) => p.slug === result.project) ??
      NATTUKAAY_PROJECTS.find((p) => p.slug === 'autres');
    if (!nattukaay) throw new Error('Projet invalide');

    const objective =
      getObjectiveBySlug(nattukaay.slug) ?? getObjectiveBySlug('autres');
    if (!objective) throw new Error('Objectif introuvable');

    const payload = buildNaffaAccountPayload({
      objectiveSlug: objective.slug,
      objectiveId: objective.id,
      objectiveName: objective.name,
      objectiveTitre: objective.titre,
      monthlyAmount: result.monthlyAmount,
      durationMonths: result.durationMonths,
      customName: result.kondanneName,
    });

    const res = await fetch('/api/accounts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        accountType: 'SAMA_NAFFA',
        metadata: {
          ...payload.metadata,
          kondanneName: result.kondanneName,
        },
      }),
    });
    const data = (await res.json().catch(() => ({}))) as {
      success?: boolean;
      account?: { id?: string };
      error?: string;
    };
    if (!res.ok || !data.success || !data.account?.id) {
      throw new Error(data.error || 'Impossible de créer le Kondanné');
    }

    await queryClient.invalidateQueries({ queryKey: ['samaNaffaAccounts'] });
    router.push(`/portal/sama-naffa/${data.account.id}`);
  };

  return (
    <div className="c1-page c1-page--soft">
      <PortalHeader
        variant="momar"
        userData={{
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          phone: userData.phone || '',
          userId: userData.id || '',
          isNewUser: false,
          kycStatus,
        }}
        kycStatus={kycStatus}
        activeTab="sama-naffa"
        onLogout={async () => {
          await signOut({ callbackUrl: '/login' });
        }}
      />
      <div className="c4-shell">
        <button
          type="button"
          className="c2-back c4-back"
          onClick={() => router.push('/portal/sama-naffa')}
        >
          ← Mes Kondannés
        </button>
        <E3CreateKondanne
          firstName={userData.firstName}
          onSuccess={handleCreate}
        />
      </div>
    </div>
  );
}
