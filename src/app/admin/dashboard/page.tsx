'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
// Removed static import as we'll fetch from API
import {
  Users,
  FileText,
  Upload,
  DollarSign,
  Eye,
  Download,
  Calendar,
  TrendingUp,
  Award,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { FaRupeeSign } from 'react-icons/fa';

interface UserReward {
  userEmail: string;
  userName: string;
  paperTitle: string;
  rewardAmount: number;
  uploadDate: string;
  status: 'pending' | 'approved' | 'paid';
}

interface UploadedPaper {
  id: string;
  title: string;
  author: string;
  subject: string;
  category: string;
  tags: string[];
  description?: string;
  fileUrl?: string;
  fileType?: string;
  fileSize?: number;
  uploadedBy: {
    name: string;
    email: string;
  };
  downloadCount: number;
  viewCount: number;
  rating: {
    average: number;
    count: number;
  };
  isPublic: boolean;
  isApproved: boolean;
  uploadDate: string;
  createdAt: string;
  updatedAt: string;
}

interface UploadStats {
  totalUploads: number;
  pendingApproval: number;
  approvedPapers: number;
  totalRewards: number;
  pendingRewards: number;
  approvedRewards: number;
  uniqueUsers: number;
}

const AdminDashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [papers, setPapers] = useState<UploadedPaper[]>([]);
  const [userRewards, setUserRewards] = useState<UserReward[]>([]);
  const [stats, setStats] = useState<UploadStats>({
    totalUploads: 0,
    pendingApproval: 0,
    approvedPapers: 0,
    totalRewards: 0,
    pendingRewards: 0,
    approvedRewards: 0,
    uniqueUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session || (session.user as any)?.userType !== 'admin') {
      router.push('/signin');
      return;
    }

    fetchAdminData();
  }, [session, status, router]);

  const fetchAdminData = async () => {
    try {
      // Get all uploaded papers from API
      const papersResponse = await fetch('/api/admin/uploaded-papers');
      let allPapers: UploadedPaper[] = [];

      if (papersResponse.ok) {
        allPapers = await papersResponse.json();
        setPapers(allPapers);
      }

      // Fetch user rewards from API
      const rewardsResponse = await fetch('/api/admin/user-rewards');
      let rewards: UserReward[] = [];

      if (rewardsResponse.ok) {
        rewards = await rewardsResponse.json();
        setUserRewards(rewards);
      }

      // Calculate stats
      const uniqueUsersSet = new Set(allPapers.map(p => p.uploadedBy.email).filter(Boolean));
      const pendingPapers = allPapers.filter(p => !p.isApproved);
      const approvedPapers = allPapers.filter(p => p.isApproved);

      const totalRewards = rewards.reduce((sum: number, reward: UserReward) => sum + reward.rewardAmount, 0);
      const pendingRewards = rewards
        .filter((reward: UserReward) => reward.status === 'pending')
        .reduce((sum: number, reward: UserReward) => sum + reward.rewardAmount, 0);
      const approvedRewards = rewards
        .filter((reward: UserReward) => reward.status === 'approved')
        .reduce((sum: number, reward: UserReward) => sum + reward.rewardAmount, 0);

      setStats({
        totalUploads: allPapers.length,
        pendingApproval: pendingPapers.length,
        approvedPapers: approvedPapers.length,
        totalRewards,
        pendingRewards,
        approvedRewards,
        uniqueUsers: uniqueUsersSet.size
      });
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateRewardStatus = async (rewardId: string, newStatus: 'pending' | 'approved' | 'paid') => {
    try {
      const response = await fetch('/api/admin/update-reward-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rewardId, status: newStatus })
      });

      if (response.ok) {
        fetchAdminData(); // Refresh data
      }
    } catch (error) {
      console.error('Error updating reward status:', error);
    }
  };

  const approvePaper = async (paperId: string, approve: boolean) => {
    try {
      const response = await fetch('/api/admin/approve-paper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paperId, approve })
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        fetchAdminData(); // Refresh data to show updated approval status and new rewards
      } else {
        alert(data.error || 'Failed to update paper status');
      }
    } catch (error) {
      console.error('Error approving paper:', error);
      alert('Failed to update paper status');
    }
  };

  const downloadPaper = (paper: UploadedPaper) => {
    // Admin has unrestricted access - direct download
    if (paper.fileUrl) {
      if (paper.fileUrl.startsWith('http')) {
        window.open(paper.fileUrl, '_blank');
      } else {
        // For local files, we might need a special admin endpoint
        window.open(`/api/admin/download-paper/${paper.id}`, '_blank');
      }
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-blue mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // All papers are user uploaded since they come from the Book model

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 py-4 sm:py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-2 sm:gap-3 mb-4">
              <ShieldCheck className="h-6 sm:h-8 w-6 sm:w-8 text-blue-600" />
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            </div>
            <p className="text-sm sm:text-base text-gray-600">
              Welcome, {session?.user?.name}! Here's an overview of your library platform.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Uploads</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalUploads}</p>
                </div>
                <Upload className="h-6 sm:h-8 w-6 sm:w-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-yellow-600">Pending Approval</p>
                  <p className="text-xl sm:text-2xl font-bold text-yellow-900">{stats.pendingApproval}</p>
                  <p className="text-xs text-yellow-600 mt-1">Need your approval</p>
                </div>
                <Clock className="h-6 sm:h-8 w-6 sm:w-8 text-yellow-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-green-600">Approved Papers</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-900">{stats.approvedPapers}</p>
                  <p className="text-xs text-green-600 mt-1">₹4 each rewarded</p>
                </div>
                <CheckCircle className="h-6 sm:h-8 w-6 sm:w-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Rewards</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">₹{stats.totalRewards}</p>
                </div>
                <FaRupeeSign className="h-6 sm:h-8 w-6 sm:w-8 text-yellow-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Unique Users</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.uniqueUsers}</p>
                </div>
                <Users className="h-6 sm:h-8 w-6 sm:w-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Paid Rewards</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">₹{stats.approvedRewards}</p>
                </div>
                <TrendingUp className="h-6 sm:h-8 w-6 sm:w-8 text-purple-500" />
              </div>
            </div>
          </div>

          {/* User Uploads Section */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FileText className="h-4 sm:h-5 w-4 sm:w-5" />
              User Uploaded Papers ({papers.length})
            </h2>

            {papers.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No user uploads yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b text-black">
                      <th className="text-left py-2 px-2 sm:px-4">Paper Title</th>
                      <th className="text-left py-2 px-2 sm:px-4 hidden sm:table-cell">Uploader</th>
                      <th className="text-left py-2 px-2 sm:px-4">Status</th>
                      <th className="text-left py-2 px-2 sm:px-4 hidden md:table-cell">Upload Date</th>
                      <th className="text-left py-2 px-2 sm:px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {papers.map((paper) => (
                      <tr key={paper.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-2 sm:px-4">
                          <div>
                            <p className="font-medium text-gray-900 text-sm sm:text-base">{paper.title}</p>
                            <p className="text-xs sm:text-sm text-gray-500">{paper.subject}</p>
                            <p className="text-xs text-gray-500 sm:hidden">By: {paper.uploadedBy.name || 'Unknown'}</p>
                            {paper.tags && paper.tags.length > 0 && (
                              <p className="text-xs text-gray-400 mt-1">Tags: {paper.tags.slice(0, 2).join(', ')}</p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-2 sm:px-4 hidden sm:table-cell">
                          <div>
                            <p className="font-medium text-gray-900">{paper.uploadedBy.name || 'Unknown'}</p>
                            <p className="text-sm text-gray-500">{paper.uploadedBy.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-2 sm:px-4">
                          <div className="flex flex-col gap-1">
                            <span className="inline-flex items-center px-1.5 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {paper.category}
                            </span>
                            {paper.isApproved ? (
                              <span className="inline-flex items-center px-1.5 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                <span className="hidden sm:inline">Approved (₹4 Rewarded)</span>
                                <span className="sm:hidden">Approved</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-1.5 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                <Clock className="h-3 w-3 mr-1" />
                                <span className="hidden sm:inline">Pending Approval</span>
                                <span className="sm:hidden">Pending</span>
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-2 sm:px-4 hidden md:table-cell">
                          <div className="flex items-center gap-1 text-gray-500">
                            <Calendar className="h-4 w-4" />
                            {paper.uploadDate}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            Downloads: {paper.downloadCount} | Views: {paper.viewCount}
                          </div>
                        </td>
                        <td className="py-3 px-2 sm:px-4">
                          <div className="flex gap-1 sm:gap-2 flex-wrap">
                            {!paper.isApproved ? (
                              <>
                                <button
                                  onClick={() => approvePaper(paper.id, true)}
                                  className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors text-xs"
                                >
                                  <CheckCircle className="h-3 sm:h-4 w-3 sm:w-4" />
                                  <span className="hidden sm:inline">Approve & Give ₹4</span>
                                  <span className="sm:hidden">✓</span>
                                </button>
                                <button
                                  onClick={() => approvePaper(paper.id, false)}
                                  className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-xs"
                                >
                                  <XCircle className="h-3 sm:h-4 w-3 sm:w-4" />
                                  <span className="hidden sm:inline">Reject</span>
                                  <span className="sm:hidden">✗</span>
                                </button>
                              </>
                            ) : (
                              <span className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-gray-100 text-gray-500 rounded-md text-xs">
                                <CheckCircle className="h-3 sm:h-4 w-3 sm:w-4" />
                                <span className="hidden sm:inline">Already Approved</span>
                                <span className="sm:hidden">✓</span>
                              </span>
                            )}
                            <button
                              onClick={() => downloadPaper(paper)}
                              disabled={!paper.fileUrl}
                              className={`flex items-center gap-1 px-2 sm:px-3 py-1 rounded-md transition-colors text-xs ${
                                paper.fileUrl
                                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              }`}
                            >
                              <Download className="h-3 sm:h-4 w-3 sm:w-4" />
                              <span className="hidden sm:inline">{paper.fileUrl ? 'Download' : 'No File'}</span>
                              <span className="sm:hidden">↓</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* User Rewards Section */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Award className="h-4 sm:h-5 w-4 sm:w-5" />
              User Rewards ({userRewards.length})
            </h2>

            {userRewards.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No rewards to display yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b text-black">
                      <th className="text-left py-2 px-2 sm:px-4">User</th>
                      <th className="text-left py-2 px-2 sm:px-4 hidden sm:table-cell">Paper Title</th>
                      <th className="text-left py-2 px-2 sm:px-4">Reward</th>
                      <th className="text-left py-2 px-2 sm:px-4 hidden md:table-cell">Upload Date</th>
                      <th className="text-left py-2 px-2 sm:px-4">Status</th>
                      <th className="text-left py-2 px-2 sm:px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userRewards.map((reward, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-2 sm:px-4">
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{reward.userName}</p>
                            <p className="text-xs text-gray-500">{reward.userEmail}</p>
                            <p className="text-xs text-gray-500 sm:hidden">{reward.paperTitle}</p>
                          </div>
                        </td>
                        <td className="py-3 px-2 sm:px-4 hidden sm:table-cell">
                          <p className="text-gray-900">{reward.paperTitle}</p>
                        </td>
                        <td className="py-3 px-2 sm:px-4">
                          <span className="font-semibold text-green-600">₹{reward.rewardAmount}</span>
                        </td>
                        <td className="py-3 px-2 sm:px-4 hidden md:table-cell">
                          <div className="flex items-center gap-1 text-gray-500">
                            <Calendar className="h-4 w-4" />
                            {reward.uploadDate}
                          </div>
                        </td>
                        <td className="py-3 px-2 sm:px-4">
                          <span className={`inline-flex items-center px-1.5 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            reward.status === 'paid' ? 'bg-green-100 text-green-800' :
                            reward.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {reward.status.charAt(0).toUpperCase() + reward.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-2 sm:px-4">
                          {reward.status !== 'paid' && (
                            <select
                              value={reward.status}
                              onChange={(e) => updateRewardStatus((reward as any)._id, e.target.value as any)}
                              className="text-xs sm:text-sm border border-gray-300 rounded px-1 sm:px-2 py-1 w-full"
                            >
                              <option value="pending">Pending</option>
                              <option value="approved">Approved</option>
                              <option value="paid">Paid</option>
                            </select>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* All Papers Access Section */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mt-6 sm:mt-8">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Eye className="h-4 sm:h-5 w-4 sm:w-5" />
              All Papers - Unrestricted Access ({papers.length})
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mb-4">
              As an admin, you have unrestricted access to all papers in the system.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {papers.slice(0, 12).map((paper) => (
                <div key={paper.id} className="border rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-900 text-xs sm:text-sm line-clamp-2 flex-1">{paper.title}</h3>
                    <div className="ml-2 flex flex-col gap-1">
                      <span className="px-1.5 sm:px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full whitespace-nowrap">
                        Upload
                      </span>
                      {paper.isApproved ? (
                        <span className="px-1.5 sm:px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full whitespace-nowrap">
                          ✓
                        </span>
                      ) : (
                        <span className="px-1.5 sm:px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full whitespace-nowrap">
                          ⏳
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{paper.subject}</p>
                  <p className="text-xs text-gray-400 mb-2">By: {paper.author} • {paper.category}</p>
                  <p className="text-xs text-gray-400 mb-3">↓ {paper.downloadCount} | 👁 {paper.viewCount}</p>

                  <button
                    onClick={() => downloadPaper(paper)}
                    disabled={!paper.fileUrl}
                    className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md text-xs sm:text-sm transition-colors ${
                      !paper.fileUrl
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                  >
                    <Download className="h-3 sm:h-4 w-3 sm:w-4" />
                    {!paper.fileUrl ? 'No File' : 'Download'}
                  </button>
                </div>
              ))}
            </div>

            {papers.length > 12 && (
              <div className="text-center mt-6">
                <p className="text-gray-500">Showing first 12 papers. Total: {papers.length} papers available.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminDashboard;