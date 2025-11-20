'use client';

import { useState } from 'react';
import { X, Upload, FileText, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
}

const UploadModal = ({ isOpen, onClose, onUploadSuccess }: UploadModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    category: '',
    year: '',
    branch: '',
    description: '',
    tags: '',
    examType: '',
    mobile: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const subjects = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
    'Mechanical Engineering', 'Electrical Engineering', 'Civil Engineering',
    'Economics', 'Political Science', 'History', 'Geography', 'English',
    'Accountancy', 'Business Studies', 'Other'
  ];

  const categories = [
    'Engineering', 'Medical', 'School', 'UPSC', 'Banking', 'SSC',
    'Railway', 'State Exams', 'University', 'Other'
  ];

  const examTypes = [
    'JEE Main', 'JEE Advanced', 'NEET', 'GATE', 'CAT', 'UPSC',
    'CBSE Board', 'ICSE Board', 'State Board', 'University Exam',
    'Practice Paper', 'Mock Test', 'Previous Year', 'Sample Paper', 'Other'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear - i);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('File size must be less than 10MB');
        return;
      }
      if (!selectedFile.type.includes('pdf') && !selectedFile.type.includes('image')) {
        toast.error('Only PDF and image files are allowed');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    if (!formData.title || !formData.subject || !formData.category || !formData.mobile) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate mobile number format
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(formData.mobile)) {
      toast.error('Please enter a valid 10-digit mobile number starting with 6-9');
      return;
    }

    setIsUploading(true);
    setError('');
    const loadingToast = toast.loading('Uploading paper...');

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('title', formData.title);
      uploadFormData.append('subject', formData.subject);
      uploadFormData.append('category', formData.category);
      uploadFormData.append('year', formData.year);
      uploadFormData.append('branch', formData.branch);
      uploadFormData.append('description', formData.description);
      uploadFormData.append('examType', formData.examType);
      uploadFormData.append('tags', formData.tags);
      uploadFormData.append('mobile', formData.mobile);

      const response = await fetch('/api/upload-paper', {
        method: 'POST',
        body: uploadFormData,
      });

      if (response.ok) {
        toast.success('Paper uploaded successfully!', {
          id: loadingToast,
        });
        onUploadSuccess();
        resetForm();
        onClose();
      } else {
        // Try to parse error message from response
        let errorMessage = 'Upload failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          // If JSON parsing fails, try to get text
          try {
            errorMessage = await response.text() || errorMessage;
          } catch (textError) {
            // Use default error message
          }
        }
        toast.error(errorMessage, {
          id: loadingToast,
        });
      }
    } catch (error) {
      toast.error('Upload failed. Please try again.', {
        id: loadingToast,
      });
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subject: '',
      category: '',
      year: '',
      branch: '',
      description: '',
      tags: '',
      examType: '',
      mobile: '',
    });
    setFile(null);
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/80 backdrop-blur-3xl border border-white/40 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto ring-1 ring-black/5">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Upload Paper</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50/60 backdrop-blur-sm border border-red-200/60 rounded-lg text-red-700">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select File *
            </label>
            <div className="border-2 border-dashed border-gray-300/60 bg-gray-50/30 rounded-lg p-6 text-center hover:border-brand-blue transition">
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <FileText className="mx-auto mb-2 text-gray-400" size={48} />
                <p className="text-gray-600">
                  {file ? file.name : 'Click to select file or drag and drop'}
                </p>
                <p className="text-sm text-gray-500 mt-1">PDF or Image files (max 10MB)</p>
              </label>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Paper Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., JEE Main 2023 Mathematics Paper"
              required
              className="w-full px-3 py-2 border text-gray-500 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </div>

          {/* Subject and Category Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border text-gray-400 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
              >
                <option value="">Select Subject</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border text-gray-400 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Year and Exam Type Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year
              </label>
              <select
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border text-gray-400 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
              >
                <option value="">Select Year</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exam Type
              </label>
              <select
                name="examType"
                value={formData.examType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border text-gray-400 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
              >
                <option value="">Select Exam Type</option>
                {examTypes.map(exam => (
                  <option key={exam} value={exam}>{exam}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Branch */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Branch/Stream
            </label>
            <input
              type="text"
              name="branch"
              value={formData.branch}
              onChange={handleInputChange}
              placeholder="e.g., Computer Science, Mechanical, Commerce"
              className="w-full px-3 py-2 border text-gray-500 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Number (for receiving rewards) *
            </label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              placeholder="Enter 10-digit mobile number"
              pattern="[6-9][0-9]{9}"
              required
              maxLength={10}
              className="w-full px-3 py-2 border text-gray-500 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
            <p className="text-xs text-gray-500 mt-1">
              This number will be linked to your bank account for reward payments
            </p>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="e.g., JEE, Mathematics, Calculus, Important"
              className="w-full px-3 py-2 border text-gray-500 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              placeholder="Brief description of the paper content..."
              className="w-full px-3 py-2 border text-gray-500 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center gap-2 disabled:opacity-50"
            >
              <Upload size={18} />
              {isUploading ? 'Uploading...' : 'Upload Paper'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;