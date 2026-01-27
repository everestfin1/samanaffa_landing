import { createFileRoute } from '@tanstack/react-router';
import * as React from 'react';
import PageContainer from '../../../components/admin/layout/PageContainer';
import { requireAdminAuth } from '../../../components/admin/hooks/useAdminAuth';

export const Route = createFileRoute('/admin/users/$id')({
  beforeLoad: requireAdminAuth,
  component: UserDetailPage,
});

function UserDetailPage() {
  const { id } = Route.useParams();

  return (
    <PageContainer>
      <h1 className="text-2xl font-bold mb-4">User Details</h1>
      <p>Details for user with ID: {id}</p>
    </PageContainer>
  );
}
