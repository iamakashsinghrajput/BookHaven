import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="bg-gray-100 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-black tracking-tight">{title}</h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
      </div>
    </div>
  );
};

export default PageHeader;