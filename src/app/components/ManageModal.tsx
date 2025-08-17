'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { X, Edit, Trash2, Eye, Download, Star, AlertCircle, CheckCircle } from 'lucide-react';

interface ManageModalProps {
  isOpen: boolean;
  onClose: () => void;
  paperData: {
    _id: string;
    resourceId?: string;
    title: string;
    subject: string;
    category: string;
    fileUrl?: string;
    metadata?: {
      downloadCount?: number;
      rating?: number;
      fileSize?: number;
    };
    createdAt: string;
  } | null;
  onUpdateSuccess: () => void;
}

const ManageModal = ({ isOpen, onClose, paperData, onUpdateSuccess }: ManageModalProps) => {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [emailConfirmation, setEmailConfirmation] = useState('');
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Reset form fields when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setEmailConfirmation('');
      setDeleteConfirmationText('');
      setShowDeleteConfirm(false);
      setError('');
      setSuccess('');
    }
  }, [isOpen]);

  if (!isOpen || !paperData) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleDelete = async () => {
    // Validate email confirmation
    if (emailConfirmation !== session?.user?.email) {
      setError('Email confirmation does not match your account email.');
      return;
    }

    // Validate delete confirmation text
    const expectedText = `Delete-${paperData.title}`;
    if (deleteConfirmationText !== expectedText) {
      setError(`Please type exactly: ${expectedText}`);
      return;
    }

    setIsDeleting(true);
    setError('');

    try {
      // Use resourceId (Book ID) instead of _id (UserActivity ID) for deletion
      const bookId = paperData.resourceId || paperData._id;
      const response = await fetch(`/api/manage-paper/${bookId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('Paper deleted successfully');
        setTimeout(() => {
          onUpdateSuccess();
          onClose();
        }, 1500);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to delete paper');
      }
    } catch (error) {
      setError('Failed to delete paper. Please try again.');
      console.error('Delete error:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleDownload = () => {
    if (paperData.fileUrl) {
      window.open(paperData.fileUrl, '_blank');
    }
  };

  const handlePreview = () => {
    if (paperData.fileUrl) {
      // Calculate optimal window size based on screen dimensions
      const screenWidth = window.screen.width;
      const screenHeight = window.screen.height;
      const windowWidth = Math.min(1200, screenWidth * 0.9);
      const windowHeight = Math.min(900, screenHeight * 0.9);
      const left = (screenWidth - windowWidth) / 2;
      const top = (screenHeight - windowHeight) / 2;

      const newWindow = window.open(
        '',
        'preview',
        `width=${windowWidth},height=${windowHeight},left=${left},top=${top},scrollbars=yes,resizable=yes,status=yes,toolbar=no,menubar=no,location=no`
      );
      
      if (newWindow) {
        newWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Preview: ${paperData.title}</title>
              <style>
                * {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                }
                body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  color: #333;
                  overflow: hidden;
                }
                .header {
                  background: rgba(255, 255, 255, 0.95);
                  backdrop-filter: blur(10px);
                  padding: 15px 20px;
                  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  position: fixed;
                  top: 0;
                  left: 0;
                  right: 0;
                  z-index: 1000;
                  height: 60px;
                }
                .header h2 {
                  font-size: 18px;
                  font-weight: 600;
                  color: #2563eb;
                  margin: 0;
                  max-width: 70%;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
                .header .controls {
                  display: flex;
                  gap: 10px;
                }
                .btn {
                  padding: 8px 16px;
                  border: none;
                  border-radius: 6px;
                  font-size: 14px;
                  font-weight: 500;
                  cursor: pointer;
                  transition: all 0.2s;
                  text-decoration: none;
                  display: inline-flex;
                  align-items: center;
                  gap: 6px;
                }
                .btn-primary {
                  background: #2563eb;
                  color: white;
                }
                .btn-primary:hover {
                  background: #1d4ed8;
                }
                .btn-secondary {
                  background: #6b7280;
                  color: white;
                }
                .btn-secondary:hover {
                  background: #4b5563;
                }
                .preview-container {
                  position: fixed;
                  top: 60px;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  background: white;
                }
                .preview-iframe {
                  width: 100%;
                  height: 100%;
                  border: none;
                  background: white;
                }
                .loading {
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  text-align: center;
                  color: #6b7280;
                }
                .spinner {
                  width: 40px;
                  height: 40px;
                  border: 4px solid #e5e7eb;
                  border-top: 4px solid #2563eb;
                  border-radius: 50%;
                  animation: spin 1s linear infinite;
                  margin: 0 auto 16px;
                }
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              </style>
            </head>
            <body>
              <div class="header">
                <h2>${paperData.title}</h2>
                <div class="controls">
                  <a href="${paperData.fileUrl}" target="_blank" class="btn btn-primary">
                    📥 Download
                  </a>
                  <button onclick="window.close()" class="btn btn-secondary">
                    ✕ Close
                  </button>
                </div>
              </div>
              <div class="preview-container">
                <div class="loading" id="loading">
                  <div class="spinner"></div>
                  <p>Loading document...</p>
                </div>
                <iframe 
                  src="${paperData.fileUrl}" 
                  class="preview-iframe"
                  onload="document.getElementById('loading').style.display='none'"
                  onerror="document.getElementById('loading').innerHTML='<p>Failed to load document. <a href=&quot;${paperData.fileUrl}&quot; target=&quot;_blank&quot;>Click here to download</a></p>'"
                ></iframe>
              </div>
            </body>
          </html>
        `);
        newWindow.document.close();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/80 backdrop-blur-3xl border border-white/40 rounded-2xl shadow-2xl w-full max-w-md ring-1 ring-black/5">
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
          <h2 className="text-xl font-bold text-gray-800">Manage Paper</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50/60 backdrop-blur-sm border border-red-200/60 rounded-lg text-red-700 mb-4">
              <AlertCircle size={18} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 bg-green-50/60 backdrop-blur-sm border border-green-200/60 rounded-lg text-green-700 mb-4">
              <CheckCircle size={18} />
              <span className="text-sm">{success}</span>
            </div>
          )}

          {/* Paper Details */}
          <div className="space-y-4 mb-6">
            <div>
              <h3 className="font-semibold text-gray-800 text-lg mb-2">{paperData.title}</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Subject:</strong> {paperData.subject}</p>
                <p><strong>Category:</strong> {paperData.category}</p>
                <p><strong>Uploaded:</strong> {formatDate(paperData.createdAt)}</p>
                {paperData.metadata?.fileSize && (
                  <p><strong>File Size:</strong> {formatFileSize(paperData.metadata.fileSize)}</p>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-gray-50/30 backdrop-blur-sm rounded-lg p-4">
              <h4 className="font-medium text-gray-700 mb-2">Statistics</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-black">
                  <Download size={16} className="text-gray-500" />
                  <span>{paperData.metadata?.downloadCount || 0} downloads</span>
                </div>
                {paperData.metadata?.rating && (
                  <div className="flex items-center gap-2">
                    <Star size={16} className="text-yellow-500" fill="currentColor" />
                    <span>{paperData.metadata.rating}/5 rating</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {!showDeleteConfirm ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handlePreview}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-blue text-white bg-blue-500 rounded-lg hover:bg-blue-600 hover:text-white hover:border-0 transition"
                >
                  <Eye size={16} />
                  Preview
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                  <Download size={16} />
                  Download
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleEdit}
                  disabled={isEditing}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition disabled:opacity-50"
                >
                  <Edit size={16} />
                  {isEditing ? 'Editing...' : 'Edit'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-red-50/60 backdrop-blur-sm border border-red-200/60 rounded-lg p-4">
                <h4 className="font-medium text-red-800 mb-3">Confirm Deletion</h4>
                <p className="text-sm text-red-700 mb-4">
                  This action cannot be undone. To confirm deletion, please complete both fields below:
                </p>
                
                {/* Email Confirmation */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-red-800 mb-1">
                    Confirm your email address:
                  </label>
                  <input
                    type="email"
                    value={emailConfirmation}
                    onChange={(e) => setEmailConfirmation(e.target.value)}
                    placeholder={session?.user?.email || "Enter your email"}
                    className="w-full px-3 py-2 border border-red-300 rounded-lg text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {/* Delete Text Confirmation */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-red-800 mb-1">
                    Type <span className="font-mono bg-red-100 px-1 rounded">Delete-{paperData.title}</span> to confirm:
                  </label>
                  <input
                    type="text"
                    value={deleteConfirmationText}
                    onChange={(e) => setDeleteConfirmationText(e.target.value)}
                    placeholder={`Delete-${paperData.title}`}
                    className="w-full px-3 py-2 border border-red-300 rounded-lg text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setEmailConfirmation('');
                    setDeleteConfirmationText('');
                    setError('');
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting || !emailConfirmation || !deleteConfirmationText}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Paper'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageModal;