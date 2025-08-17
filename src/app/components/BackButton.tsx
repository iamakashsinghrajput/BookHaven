'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

const BackButton = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <button
      onClick={handleBack}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
    >
      <ArrowLeft size={16} />
      Back
    </button>
  );
};

export default BackButton;