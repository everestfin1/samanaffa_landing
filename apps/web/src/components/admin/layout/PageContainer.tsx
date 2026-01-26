import * as React from 'react';

const PageContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className="container mx-auto px-4 sm:px-6 lg:px-8">{children}</div>;
};

export default PageContainer;
