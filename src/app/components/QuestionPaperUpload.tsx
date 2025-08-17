'use client';

import { useState } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import { addUserUploadedPaper } from '../data/questionPapers';

interface UploadFormData {
  title: string;
  category: string;
  subCategory: string;
  year: string;
  subject: string;
  uploaderName: string;
  uploaderEmail: string;
  file: File | null;
}

interface QuestionPaperUploadProps {
  onPaperUploaded?: () => void;
}

const QuestionPaperUpload: React.FC<QuestionPaperUploadProps> = ({ onPaperUploaded }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<UploadFormData>({
    title: '',
    category: '',
    subCategory: '',
    year: '',
    subject: '',
    uploaderName: '',
    uploaderEmail: '',
    file: null
  });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset subcategory when category changes
      ...(name === 'category' && { subCategory: '' })
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, file }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.file) {
      alert('Please select a PDF file to upload.');
      return;
    }

    try {
      // In a real application, you would upload the file to a server first
      // For now, we'll simulate this with a blob URL
      const fileUrl = URL.createObjectURL(formData.file);
      
      // Add the paper to our database
      const newPaper = addUserUploadedPaper({
        title: formData.title,
        category: formData.category as 'engineering' | 'medical' | 'school' | 'other',
        subCategory: formData.subCategory,
        year: parseInt(formData.year),
        subject: formData.subject,
        url: fileUrl,
        uploaderName: formData.uploaderName,
        uploaderEmail: formData.uploaderEmail
      });

      console.log('New paper added:', newPaper);
      alert('Thank you for your contribution! Your question paper has been added to our database and is now available for download.');
      
      // Call the callback to refresh the parent component
      if (onPaperUploaded) {
        onPaperUploaded();
      }
      
      // Reset form
      setFormData({
        title: '',
        category: '',
        subCategory: '',
        year: '',
        subject: '',
        uploaderName: '',
        uploaderEmail: '',
        file: null
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Error uploading paper:', error);
      alert('There was an error uploading your paper. Please try again.');
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 15 }, (_, i) => currentYear - i);

  const subCategoryOptions = formData.category ? 
    filterOptions[formData.category as keyof typeof filterOptions] || [] : [];

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-brand-blue text-black border border-black font-semibold rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-colors"
        >
          <Upload size={20} />
          Contribute Paper
        </button>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setIsOpen(false);
        }
      }}
    >
      <div 
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-black">Upload Question Paper</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Paper Title */}
            <div>
              <label className="block font-semibold mb-2 text-black">Paper Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., JEE Main 2024 - Physics"
                className="w-full p-3 border border-gray-300 text-black rounded-md"
                required
              />
            </div>

            {/* Category and Subcategory */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-2 text-black">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 text-gray-600 rounded-md"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="engineering">Engineering</option>
                  <option value="medical">Medical</option>
                  <option value="school">School (10th/12th)</option>
                  <option value="other">Other Exams</option>
                </select>
              </div>
              
              <div>
                <label className="block font-semibold mb-2 text-black">Sub-category *</label>
                <select
                  name="subCategory"
                  value={formData.subCategory}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 text-gray-600 rounded-md"
                  disabled={!formData.category}
                  required
                >
                  <option value="">Select Sub-category</option>
                  {subCategoryOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Year and Subject */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-2 text-black">Year *</label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 text-gray-600 rounded-md"
                  required
                >
                  <option value="">Select Year</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block font-semibold mb-2 text-black">Subject *</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="e.g., Physics, Mathematics"
                  className="w-full p-3 border border-gray-300 text-black rounded-md"
                  required
                />
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block font-semibold mb-2 text-black">PDF File *</label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center relative">
                {formData.file ? (
                  <div className="flex items-center justify-center gap-2 text-green-600">
                    <FileText size={20} />
                    <span>{formData.file.name}</span>
                  </div>
                ) : (
                  <div className="text-gray-500">
                    <Upload className="mx-auto mb-2" size={32} />
                    <p>Click to upload or drag and drop</p>
                    <p className="text-sm">PDF files only (Max 10MB)</p>
                  </div>
                )}
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  required
                />
              </div>
            </div>

            {/* Uploader Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-2 text-black">Your Name *</label>
                <input
                  type="text"
                  name="uploaderName"
                  value={formData.uploaderName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 text-black rounded-md"
                  required
                />
              </div>
              
              <div>
                <label className="block font-semibold mb-2 text-black">Your Email *</label>
                <input
                  type="email"
                  name="uploaderEmail"
                  value={formData.uploaderEmail}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 text-black rounded-md"
                  required
                />
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-700">
              <p><strong>Note:</strong> By uploading this question paper, you confirm that you have the right to share it and that it doesn&apos;t violate any copyright laws. All submissions will be reviewed before being published.</p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-blue-600 hover:text-white transition-colors"
              >
                Upload Paper
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuestionPaperUpload;