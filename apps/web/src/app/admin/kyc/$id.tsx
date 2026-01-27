import { createFileRoute } from '@tanstack/react-router';
import * as React from 'react';
import PageContainer from '../../../components/admin/layout/PageContainer';
import { requireAdminAuth } from '../../../components/admin/hooks/useAdminAuth';

export const Route = createFileRoute('/admin/kyc/$id')({
  beforeLoad: requireAdminAuth,
  component: KycDetailPage,
});

function KycDetailPage() {
  const { id } = Route.useParams();

  return (
    <PageContainer>
      <h1 className="text-2xl font-bold mb-4">KYC Document Details</h1>
      <p>Details for KYC document with ID: {id}</p>
    </PageContainer>
  );
}
