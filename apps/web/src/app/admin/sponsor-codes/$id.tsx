import { createFileRoute } from '@tanstack/react-router';
import * as React from 'react';
import PageContainer from '../../../components/admin/layout/PageContainer';

export const Route = createFileRoute('/admin/sponsor-codes/$id')({
  component: SponsorCodeDetailPage,
});

function SponsorCodeDetailPage() {
  const { id } = Route.useParams();

  return (
    <PageContainer>
      <h1 className="text-2xl font-bold mb-4">Sponsor Code Details</h1>
      <p>Details for sponsor code with ID: {id}</p>
    </PageContainer>
  );
}
