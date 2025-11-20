'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import UploadModal from '../components/UploadModal';
import ManageModal from '../components/ManageModal';
import { Download, Upload, BookOpen, User, LogOut, PlusCircle, Star, TrendingUp, CheckCircle, Clock, XCircle } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface UserActivity {
  _id: string;
  type: string;
  title: string;
  subject: string;
  category: string;
  createdAt: string;
  fileUrl?: string;
  status?: 'pending' | 'approved' | 'rejected';
  isApproved?: boolean;
  rejectionReason?: string;
  metadata?: {
    downloadCount?: number;
    rating?: number;
  };
}

interface Recommendation {
  _id: string;
  title: string;
  author: string;
  subject: string;
  imageUrl: string;
  downloadCount: number;
  rating: {
    average: number;
    count: number;
  };
  recommendationReason: string;
}

interface ActivityData {
  resourceType: 'book' | 'paper';
  resourceId?: string;
  title: string;
  subject: string;
  category: string;
  tags?: string[];
  fileUrl?: string;
}

const DashboardPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [downloads, setDownloads] = useState<UserActivity[]>([]);
  const [uploads, setUploads] = useState<UserActivity[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState<UserActivity | null>(null);

  useEffect(() => {
    // If the user is not authenticated, redirect them to the sign-in page.
    if (status === 'unauthenticated') {
      router.push('/signin');
    } else if (status === 'authenticated') {
      fetchUserData();
    }
  }, [status, router]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Fetch downloads
      const downloadsRes = await fetch('/api/user-activity?type=download&limit=5');
      if (downloadsRes.ok) {
        const downloadsData = await downloadsRes.json();
        setDownloads(downloadsData.activities);
      }
      
      // Fetch uploads
      const uploadsRes = await fetch('/api/user-activity?type=upload&limit=5');
      if (uploadsRes.ok) {
        const uploadsData = await uploadsRes.json();
        setUploads(uploadsData.activities);
      }
      
      // Fetch recommendations
      const recsRes = await fetch('/api/recommendations?limit=5');
      if (recsRes.ok) {
        const recsData = await recsRes.json();
        setRecommendations(recsData.recommendations);
      }
      
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const recordActivity = async (type: string, data: ActivityData) => {
    try {
      await fetch('/api/user-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, ...data }),
      });
    } catch (error) {
      console.error('Error recording activity:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleUploadSuccess = () => {
    // Refresh the user data to show the new upload
    fetchUserData();
  };

  const handleManage = (paper: UserActivity) => {
    setSelectedPaper(paper);
    setIsManageModalOpen(true);
  };

  const handleManageSuccess = () => {
    // Refresh the user data after manage operations
    fetchUserData();
    setIsManageModalOpen(false);
    setSelectedPaper(null);
  };

  const showRejectionReason = (activity: UserActivity) => {
    if (activity.rejectionReason) {
      toast.error(
        <div>
          <p className="font-semibold mb-1">Paper Rejected</p>
          <p className="text-sm">{activity.rejectionReason}</p>
        </div>,
        {
          duration: 6000,
          icon: '❌'
        }
      );
    } else {
      toast.error('Your paper did not meet our quality standards.', {
        duration: 4000,
        icon: '❌'
      });
    }
  };

  // Show a loading state while the session is being fetched.
  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-blue mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Only render the dashboard if the user is authenticated.
  if (status === 'authenticated') {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Welcome Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-gray-800">Welcome back, {session.user?.name}!</h1>
            <p className="text-gray-600 mt-2">Here&apos;s your personal dashboard to track your academic journey.</p>
          </div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Main Content Area (2/3 width) */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Downloaded Papers Card */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center mb-4">
                  <Download className="text-black mr-3" size={24} />
                  <h2 className="text-2xl font-semibold text-gray-700">Recently Downloaded</h2>
                </div>
                <ul className="space-y-4">
                  {downloads.length > 0 ? (
                    downloads.map(activity => (
                      <li key={activity._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                        <div className="flex items-center">
                          <Download className="text-gray-500 mr-4" size={20} />
                          <div>
                            <p className="font-medium text-gray-800">{activity.title}</p>
                            <p className="text-sm text-gray-500">
                              {activity.subject} &bull; {activity.category} &bull; Downloaded on {formatDate(activity.createdAt)}
                            </p>
                            {activity.metadata?.rating && (
                              <div className="flex items-center mt-1">
                                <Star className="text-yellow-400 w-4 h-4 mr-1" fill="currentColor" />
                                <span className="text-sm text-gray-600">{activity.metadata.rating}/5</span>
                              </div>
                            )}
                          </div>
                        </div>
                        {activity.fileUrl && (
                          <button 
                            onClick={() => {
                              window.open(activity.fileUrl, '_blank');
                              recordActivity('download', {
                                resourceType: 'paper',
                                title: activity.title,
                                subject: activity.subject,
                                category: activity.category,
                                fileUrl: activity.fileUrl,
                              });
                            }}
                            className="text-sm font-semibold text-brand-blue hover:underline"
                          >
                            Download Again
                          </button>
                        )}
                      </li>
                    ))
                  ) : (
                    <li className="text-center text-gray-500 py-8">
                      <Download className="mx-auto mb-2 text-gray-300" size={48} />
                      <p>No downloads yet. Start exploring our library!</p>
                    </li>
                  )}
                </ul>
              </div>

              {/* Uploaded Papers Card */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <Upload className="text-green-500 mr-3" size={24} />
                        <h2 className="text-2xl font-semibold text-gray-700">Your Contributions</h2>
                    </div>
                    <button 
                      onClick={() => setIsUploadModalOpen(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition"
                    >
                        <PlusCircle size={18} />
                        Upload Paper
                    </button>
                </div>
                <ul className="space-y-4">
                  {uploads.length > 0 ? (
                    uploads.map(activity => (
                      <li key={activity._id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center flex-1">
                            <Upload className="text-green-500 mr-4 flex-shrink-0" size={20} />
                            <div className="flex-1">
                              <p className="font-medium text-gray-800">{activity.title}</p>
                              <p className="text-sm text-gray-500">
                                {activity.subject} &bull; {activity.category} &bull; Uploaded on {formatDate(activity.createdAt)}
                              </p>
                              {activity.metadata?.downloadCount !== undefined && activity.metadata.downloadCount > 0 && (
                                <div className="flex items-center mt-1">
                                  <TrendingUp className="text-brand-blue w-4 h-4 mr-1" />
                                  <span className="text-sm text-gray-600">{activity.metadata.downloadCount} downloads</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => handleManage(activity)}
                            className="text-sm font-semibold text-black hover:underline ml-2 flex-shrink-0"
                          >
                            Manage
                          </button>
                        </div>

                        {/* Status Badge */}
                        <div className="flex items-center gap-2 mt-2">
                          {activity.status === 'rejected' ? (
                            <>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <XCircle className="h-3 w-3 mr-1" />
                                Rejected
                              </span>
                              <button
                                onClick={() => showRejectionReason(activity)}
                                className="text-xs text-red-600 hover:text-red-800 underline"
                              >
                                View Reason
                              </button>
                            </>
                          ) : activity.isApproved || activity.status === 'approved' ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Approved (₹4 Rewarded)
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending Approval
                            </span>
                          )}
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="text-center text-gray-500 py-8">
                      <Upload className="mx-auto mb-2 text-gray-300" size={48} />
                      <p>No uploads yet. Share your knowledge with the community!</p>
                    </li>
                  )}
                </ul>
              </div>

            </div>

            {/* Sidebar (1/3 width) */}
            <div className="space-y-8">

              {/* Profile Card */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center mb-4">
                  <User className="text-gray-600 mr-3" size={24} />
                  <h2 className="text-2xl font-semibold text-gray-700">My Account</h2>
                </div>
                <div className="space-y-3">
                  <p className="text-gray-800"><strong>Name:</strong> {session.user?.name}</p>
                  
                  <p className="text-gray-800"><strong>Email:</strong> {session.user?.email}</p>
                  <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full mt-2 flex items-center justify-center gap-2 py-2 px-4 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition">
                    <LogOut size={18} />
                    Sign Out
                  </button>
                </div>
              </div>
              
              {/* Recommended Books Card */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center mb-4">
                  <BookOpen className="text-purple-500 mr-3" size={24} />
                  <h2 className="text-2xl font-semibold text-gray-700">Recommended for You</h2>
                </div>
                <ul className="space-y-4">
                  {recommendations.length > 0 ? (
                    recommendations.map(book => (
                      <li key={book._id} className="hover:bg-gray-50 p-3 rounded-lg transition cursor-pointer"
                          onClick={() => {
                            recordActivity('view', {
                              resourceType: 'book',
                              resourceId: book._id,
                              title: book.title,
                              subject: book.subject,
                              category: 'Book',
                              tags: [book.author],
                            });
                          }}>
                        <div className="flex items-start gap-4">
                          <Image 
                            src={book.imageUrl || '/default-book-cover.jpg'} 
                            alt={book.title} 
                            width={50} 
                            height={70} 
                            className="rounded-md shadow-sm flex-shrink-0" 
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-800 truncate">{book.title}</p>
                            <p className="text-sm text-gray-500 mb-1">by {book.author}</p>
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex items-center">
                                <Star className="text-yellow-400 w-4 h-4 mr-1" fill="currentColor" />
                                <span className="text-sm text-gray-600">{book.rating.average.toFixed(1)}</span>
                              </div>
                              <span className="text-gray-300">•</span>
                              <span className="text-sm text-gray-600">{book.downloadCount} downloads</span>
                            </div>
                            <p className="text-xs text-brand-blue font-medium">{book.recommendationReason}</p>
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="text-center text-gray-500 py-8">
                      <BookOpen className="mx-auto mb-2 text-gray-300" size={48} />
                      <p className="text-sm">Start using BookHaven to get personalized recommendations!</p>
                    </li>
                  )}
                </ul>
              </div>

            </div>
          </div>
        </main>
        <Footer />
        
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
      </div>
    );
  }

  // Fallback for any other state, though it should be covered by redirect.
  return null;
};

export default DashboardPage;