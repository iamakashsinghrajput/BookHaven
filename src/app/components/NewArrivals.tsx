'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { FileText, Eye, Lock } from 'lucide-react';

interface UploadedPaper {
  id: string;
  title: string;
  subject: string;
  category: string;
  uploaderName: string;
  uploadDate: string;
  url: string;
}

const NewArrivals = () => {
  const { data: session } = useSession();
  const [recentPapers, setRecentPapers] = useState<UploadedPaper[]>([]);
  const [loading, setLoading] = useState(true);

  const handlePreview = (paper: UploadedPaper) => {
    if (paper.url && paper.url !== '#') {
      window.open(paper.url, '_blank', 'noopener,noreferrer');
    }
  };

  useEffect(() => {
    fetchRecentPapers();
  }, []);

  const fetchRecentPapers = async () => {
    try {
      const response = await fetch('/api/public-papers?limit=4');
      if (response.ok) {
        const data = await response.json();
        setRecentPapers(data.papers);
      }
    } catch (error) {
      console.error('Error fetching recent papers:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-white tracking-tight">New Arrivals</h2>
            <p className="mt-4 text-lg text-gray-300">Loading recent uploads...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-white tracking-tight">New Arrivals</h2>
          <p className="mt-4 text-lg text-gray-300">Check out the latest community uploads.</p>
        </div>
        {recentPapers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {recentPapers.map((paper) => (
              <div key={paper.id} className="group text-center">
                <div className="overflow-hidden rounded-lg shadow-lg group-hover:shadow-2xl transition-shadow duration-300 bg-white/10 backdrop-blur-sm border border-white/20 p-6 h-48 flex flex-col justify-center relative">
                  <FileText className="mx-auto mb-4 text-white group-hover:text-blue-300 transition-colors" size={48} />
                  <div className="text-center">
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full mb-2">
                      Community Upload
                    </span>
                  </div>
                  
                  {/* Preview Button - Only visible to logged-in users */}
                  {session?.user ? (
                    <button
                      onClick={() => handlePreview(paper)}
                      className="absolute top-3 right-3 p-2 bg-blue-500/80 hover:bg-blue-600/90 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110"
                      title="Preview document"
                    >
                      <Eye size={16} />
                    </button>
                  ) : (
                    <div
                      className="absolute top-3 right-3 p-2 bg-gray-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      title="Sign in to preview"
                    >
                      <Lock size={16} />
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-bold text-white mt-4 line-clamp-2">{paper.title}</h3>
                <p className="text-gray-300 text-sm">{paper.subject}</p>
                <p className="text-gray-500 text-xs">by {paper.uploaderName}</p>
                <p className="text-gray-500 text-xs">{paper.uploadDate}</p>
                
                {/* Preview button below card for mobile */}
                <div className="mt-3">
                  {session?.user ? (
                    <button
                      onClick={() => handlePreview(paper)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      <Eye size={14} />
                      Preview
                    </button>
                  ) : (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded-lg cursor-not-allowed">
                      <Lock size={14} />
                      Sign in to Preview
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-300 mb-8">No community uploads yet. Be the first to contribute!</p>
          </div>
        )}
        <div className="text-center mt-12">
          <Link href="/question-papers" className="px-8 py-3 bg-black text-white font-semibold rounded-full hover:bg-white hover:text-black transition-colors">
            Browse All Papers
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;