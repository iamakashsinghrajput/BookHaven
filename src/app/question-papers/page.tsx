'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import PageHeader from '../components/PageHeader';
import PageWrapper from '../components/PageWrapper';
import Footer from '../components/Footer';
import UploadModal from '../components/UploadModal';
import ManageModal from '../components/ManageModal';
import DeletePaperDialog from '../components/DeletePaperDialog';
import { getAllPapers, QuestionPaper } from '../data/questionPapers';
import { FileText, Download, Search, PlusCircle, Trash2 } from 'lucide-react';

// Define the structure for our filter options
const filterOptions = {
  engineering: [
    { value: 'jee', label: 'JEE Main/Adv' },
    { value: 'cse', label: 'Computer Science' },
    { value: 'mech', label: 'Mechanical Eng.' },
    { value: 'btech', label: 'B.Tech General' },
  ],
  medical: [
    { value: 'neet', label: 'NEET (UG)' },
    { value: 'aiims', label: 'AIIMS' },
  ],
  school: [
    { value: 'class12', label: 'Class 12th' },
    { value: 'class10', label: 'Class 10th' },
  ],
  other: [
    { value: 'upsc', label: 'UPSC' }
  ]
};

const years = [2024, 2023, 2022, 2021, 2020, 2019];

const QuestionPapersPage = () => {
  const { data: session } = useSession();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [filteredPapers, setFilteredPapers] = useState<QuestionPaper[]>([]);
  const [publicPapers, setPublicPapers] = useState<QuestionPaper[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState<UserActivity | null>(null);
  const [paperToDelete, setPaperToDelete] = useState<QuestionPaper | null>(null);
  const [userPapers, setUserPapers] = useState<UserActivity[]>([]);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  interface UserActivity {
    _id: string;
    title: string;
    subject: string;
    category: string;
    fileUrl?: string;
    createdAt: string;
    metadata?: {
      downloadCount?: number;
      rating?: number;
    };
  }

  const subCategoryOptions = useMemo(() => {
    if (!selectedCategory) return [];
    return filterOptions[selectedCategory as keyof typeof filterOptions] || [];
  }, [selectedCategory]);

  // Fetch public uploaded papers
  const fetchPublicPapers = async () => {
    try {
      const response = await fetch('/api/public-papers?limit=100');
      if (response.ok) {
        const data = await response.json();
        setPublicPapers(data.papers);
      }
    } catch (error) {
      console.error('Error fetching public papers:', error);
    }
  };

  const handleSearch = () => {
    let results = getAllPapers();
    
    // Combine static papers with uploaded papers
    const allPapers = [...results, ...publicPapers];

    if (selectedCategory) {
      results = allPapers.filter(p => p.category === selectedCategory);
    } else {
      results = allPapers;
    }
    
    if (selectedSubCategory) {
      results = results.filter(p => p.subCategory === selectedSubCategory);
    }
    if (selectedYear) {
      results = results.filter(p => p.year === parseInt(selectedYear, 10));
    }

    setFilteredPapers(results);
    setHasSearched(true);
  };

  // Fetch public papers on component mount
  useEffect(() => {
    fetchPublicPapers();
    // Show initial papers (static + uploaded)
    const initialPapers = [...getAllPapers().slice(0, 6)];
    setFilteredPapers(initialPapers);
  }, []);

  // Update filteredPapers when publicPapers change and no search has been done
  useEffect(() => {
    if (!hasSearched) {
      const initialPapers = [...getAllPapers().slice(0, 6), ...publicPapers.slice(0, 6)];
      setFilteredPapers(initialPapers);
    }
  }, [publicPapers, hasSearched]);

  // Fetch user uploaded papers
  useEffect(() => {
    if (session?.user?.email) {
      fetchUserPapers();
    }
  }, [session]);

  const fetchUserPapers = async () => {
    try {
      const response = await fetch('/api/user-activity?type=upload&limit=50');
      if (response.ok) {
        const data = await response.json();
        setUserPapers(data.activities);
      }
    } catch (error) {
      console.error('Error fetching user papers:', error);
    }
  };

  const handlePaperUploaded = () => {
    // Refresh the papers list when a new paper is uploaded
    fetchPublicPapers(); // Refresh public papers to include newly uploaded ones
    setRefreshKey(prev => prev + 1);
    fetchUserPapers(); // Refresh user papers
  };

  const handleUploadSuccess = () => {
    handlePaperUploaded();
    setIsUploadModalOpen(false);
  };

  const handleManage = (paper: UserActivity) => {
    setSelectedPaper(paper);
    setIsManageModalOpen(true);
  };

  const handleManageSuccess = () => {
    handlePaperUploaded();
    setIsManageModalOpen(false);
    setSelectedPaper(null);
  };

  const handleDelete = (paper: QuestionPaper) => {
    setPaperToDelete(paper);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteSuccess = () => {
    handlePaperUploaded();
    setIsDeleteModalOpen(false);
    setPaperToDelete(null);
  };

  return (
    <>
      <PageWrapper>
        <PageHeader
          title="Question Paper Archive"
          subtitle="Filter and find the exact paper you need to boost your preparation."
        />

      {/* Filter Section */}
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            {/* Category Filter */}
            <div>
              <label className="block font-semibold mb-2 text-black">Select Field</label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedSubCategory(''); // Reset subcategory when field changes
                }}
                className="w-full p-3 pl-8 border border-gray-300 text-gray-600 rounded-md appearance-none bg-white bg-no-repeat bg-left"
                style={{
                  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
                  backgroundPosition: '8px center',
                  backgroundSize: '16px'
                }}
              >
                <option value="">All Fields</option>
                <option value="engineering">Engineering</option>
                <option value="medical">Medical</option>
                <option value="school">School (10th/12th)</option>
                <option value="other">Other Exams</option>
              </select>
            </div>

            {/* Sub-category Filter */}
            <div>
              <label className="block font-semibold mb-2 text-black">Select Branch / Class</label>
              <select
                value={selectedSubCategory}
                onChange={(e) => setSelectedSubCategory(e.target.value)}
                className="w-full p-3 pl-8 border border-gray-300 text-gray-600 rounded-md appearance-none bg-white bg-no-repeat bg-left"
                style={{
                  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
                  backgroundPosition: '8px center',
                  backgroundSize: '16px'
                }}
                disabled={!selectedCategory}
              >
                <option value="">All</option>
                {subCategoryOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            <div>
              <label className="block font-semibold mb-2 text-black">Select Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full p-3 pl-8 border border-gray-300 text-gray-600 rounded-md appearance-none bg-white bg-no-repeat bg-left"
                style={{
                  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
                  backgroundPosition: '8px center',
                  backgroundSize: '16px'
                }}
              >
                <option value="">All Years</option>
                {years.map(year => <option key={year} value={year}>{year}</option>)}
              </select>
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="w-full flex items-center justify-center gap-2 p-3 bg-black text-white font-semibold rounded-md hover:bg-gray-800 transition-colors"
            >
              <Search size={20} />
              Find Papers
            </button>
          </div>
        </div>
      </div>

      {/* Notice Section */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Note:</strong> Papers marked as &quot;Sample&quot; are demonstration files. Some external links may be temporarily unavailable. 
                You can upload your own papers using the &quot;Contribute Paper&quot; button.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredPapers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPapers.map((paper) => (
              <div key={`${paper.id}-${refreshKey}`} className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <FileText className="text-black flex-shrink-0 mt-1" size={24} />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-black">{paper.title}</h3>
                    <p className="text-sm text-gray-500">{paper.subject} &bull; {paper.year}</p>
                    {paper.isUserUploaded && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                            Community Upload
                          </span>
                          <span className="text-xs text-gray-400">
                            by {paper.uploaderName} on {paper.uploadDate}
                          </span>
                        </div>
                        {/* Only show delete button if current user is the uploader */}
                        {session?.user?.email === paper.uploaderEmail && (
                          <button
                            onClick={() => handleDelete(paper)}
                            className="flex items-center gap-1 px-3 py-1 text-red-600 hover:bg-red-50 rounded-md transition-colors text-sm"
                            title="Delete this paper"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {session?.user ? (
                  paper.url === '#' ? (
                    <button
                      disabled
                      className="mt-4 w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-300 text-gray-500 font-semibold rounded-md cursor-not-allowed"
                      title="Paper not available for download"
                    >
                      <Download size={16} />
                      Not Available
                    </button>
                  ) : (
                    <a
                      href={paper.url}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-100 text-gray-800 font-semibold rounded-md hover:bg-gray-200 transition-colors"
                    >
                      <Download size={16} />
                      {paper.title.includes('Sample') ? 'Download Sample PDF' : 'Download PDF'}
                    </a>
                  )
                ) : (
                  <button
                    onClick={() => setShowLoginPrompt(true)}
                    className="mt-4 w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-colors"
                  >
                    <Download size={16} />
                    Sign in to Download
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          hasSearched && (
            <div className="text-center py-16">
              <h3 className="text-2xl font-bold text-black">No Papers Found</h3>
              <p className="text-gray-600 mt-2">Try adjusting your filters to find what you&apos;re looking for.</p>
            </div>
          )
        )}
      </main>
      
      {/* User Uploaded Papers Section */}
      {session?.user && userPapers.length > 0 && (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t">
          <h2 className="text-2xl font-bold text-black mb-6">Your Uploaded Papers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userPapers.slice(0, 6).map((paper) => (
              <div key={paper._id} className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <FileText className="text-black flex-shrink-0 mt-1" size={24} />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-black">{paper.title}</h3>
                    <p className="text-sm text-gray-500">{paper.subject} • {paper.category}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                        Your Upload
                      </span>
                      <button 
                        onClick={() => handleManage(paper)}
                        className="text-sm font-semibold text-gray-600 hover:underline"
                      >
                        Manage
                      </button>
                    </div>
                  </div>
                </div>
                {paper.fileUrl && (
                  <a
                    href={paper.fileUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-100 text-gray-800 font-semibold rounded-md hover:bg-gray-200 transition-colors"
                  >
                    <Download size={16} />
                    Download PDF
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Upload Button */}
      {session?.user ? (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white border border-blue-600 font-semibold rounded-full shadow-lg hover:bg-blue-600 transition-colors"
          >
            <PlusCircle size={20} />
            Contribute Paper
          </button>
        </div>
      ) : (
        <div className="fixed bottom-6 right-6 z-40">
          <div className="bg-white border border-gray-300 rounded-full px-4 py-2 shadow-lg">
            <p className="text-sm text-gray-600">Sign in to contribute papers</p>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />

      {/* Manage Modal */}
      <ManageModal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        paperData={selectedPaper}
        onUpdateSuccess={handleManageSuccess}
      />

      {/* Delete Modal */}
      {paperToDelete && (
        <DeletePaperDialog
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          paper={paperToDelete}
          onPaperDeleted={handleDeleteSuccess}
        />
      )}

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl w-full max-w-md ring-1 ring-black/5">
            <div className="p-6 text-center">
              <div className="mb-4">
                <Download className="mx-auto text-blue-500 mb-4" size={48} />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Sign In Required</h3>
                <p className="text-gray-600">
                  Please sign in to your account to download question papers and access your personalized library.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLoginPrompt(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowLoginPrompt(false);
                    window.location.href = '/signin';
                  }}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </PageWrapper>
      
      <Footer />
    </>
  );
};

export default QuestionPapersPage;