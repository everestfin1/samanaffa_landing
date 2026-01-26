import { createFileRoute } from '@tanstack/react-router';
import * as React from 'react';
import PageContainer from '../../../components/admin/layout/PageContainer';

export const Route = createFileRoute('/admin/transactions/$id')({
  component: TransactionDetailPage,
});

function TransactionDetailPage() {
  const { id } = Route.useParams();

  return (
    <PageContainer>
      <h1 className="text-2xl font-bold mb-4">Transaction Details</h1>
      <p>Details for transaction with ID: {id}</p>
    </PageContainer>
  );
}
