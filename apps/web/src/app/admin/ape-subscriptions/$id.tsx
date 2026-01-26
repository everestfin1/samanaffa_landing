import { createFileRoute } from '@tanstack/react-router';
import * as React from 'react';
import PageContainer from '../../../components/admin/layout/PageContainer';

export const Route = createFileRoute('/admin/ape-subscriptions/$id')({
  component: ApeSubscriptionDetailPage,
});

function ApeSubscriptionDetailPage() {
  const { id } = Route.useParams();

  return (
    <PageContainer>
      <h1 className="text-2xl font-bold mb-4">APE Subscription Details</h1>
      <p>Details for APE subscription with ID: {id}</p>
    </PageContainer>
  );
}
