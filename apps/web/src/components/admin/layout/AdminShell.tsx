import * as React from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

const AdminShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen" style={{ backgroundColor: '#f7f6f6' }}>
      <AdminSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminShell;
