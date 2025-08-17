'use client';

import React from 'react';
import BackButton from './BackButton';
import Header from './Header';

interface PageWrapperProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  title?: string;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ 
  children, 
  showBackButton = true, 
  title 
}) => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      {showBackButton && (
        <div className="px-4 sm:px-6 lg:px-8 pt-4">
          <BackButton />
        </div>
      )}
      {title && (
        <div className="px-4 sm:px-6 lg:px-8 pt-4">
          <h1 className="text-3xl font-bold text-black">{title}</h1>
        </div>
      )}
      <div className="px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
};

export default PageWrapper;