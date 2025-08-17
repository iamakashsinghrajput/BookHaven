'use client';

import { useState } from 'react';
import { Trash2, X, Mail, Shield } from 'lucide-react';
import { QuestionPaper } from '../data/questionPapers';
import toast from 'react-hot-toast';

interface DeletePaperDialogProps {
  isOpen: boolean;
  onClose: () => void;
  paper: QuestionPaper;
  onPaperDeleted: () => void;
}

const DeletePaperDialog: React.FC<DeletePaperDialogProps> = ({ isOpen, onClose, paper, onPaperDeleted }) => {
  const [userEmail, setUserEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState(1); // 1: Email input, 2: Verification code
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSendCode = async () => {
    if (!userEmail.trim()) {
      toast.error('Please enter your email address.');
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading('Sending verification code...');
    
    try {
      console.log('Sending verification request with:', { paperId: paper.id, userEmail: userEmail.trim() });
      
      const response = await fetch('/api/send-delete-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paperId: paper.id,
          userEmail: userEmail.trim(),
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      toast.success('Verification code sent to your email! Please check your inbox.', {
        id: loadingToast,
      });
      setStep(2);
    } catch (error: any) {
      toast.error(`Error: ${error.message}`, {
        id: loadingToast,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAndDelete = async () => {
    if (!verificationCode.trim()) {
      toast.error('Please enter the verification code.');
      return;
    }

    setIsDeleting(true);
    const loadingToast = toast.loading('Deleting paper...');
    
    try {
      console.log('Verifying with:', { paperId: paper.id, userEmail: userEmail.trim(), verificationCode: verificationCode.trim() });
      
      const response = await fetch('/api/verify-delete-paper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paperId: paper.id,
          userEmail: userEmail.trim(),
          verificationCode: verificationCode.trim(),
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      toast.success('Paper deleted successfully!', {
        id: loadingToast,
      });
      onClose();
      setStep(1);
      setUserEmail('');
      setVerificationCode('');
      onPaperDeleted();
    } catch (error: any) {
      toast.error(`Error: ${error.message}`, {
        id: loadingToast,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/80 backdrop-blur-3xl border border-white/40 rounded-2xl shadow-2xl w-full max-w-md ring-1 ring-black/5">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-gray-800">Delete Paper</h2>
            {step === 2 && <Shield className="text-blue-500" size={24} />}
          </div>
          <button
            onClick={() => {
              onClose();
              setStep(1);
              setUserEmail('');
              setVerificationCode('');
            }}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-700 mb-2">
            Are you sure you want to delete "{paper.title}"?
          </p>
          
          {step === 1 ? (
            <>
              <p className="text-sm text-gray-500 mb-4">
                For security, we'll send a verification code to your email address to confirm you are the uploader.
              </p>
              
              <div>
                <label className="block font-medium mb-2 text-black">Your Email Address</label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="Enter the email you used when uploading"
                  className="w-full p-3 border border-gray-300 text-black rounded-md"
                  disabled={isLoading}
                />
              </div>
            </>
          ) : (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2 text-blue-700 mb-1">
                  <Mail size={16} />
                  <span className="font-medium">Verification Code Sent</span>
                </div>
                <p className="text-sm text-blue-600">
                  We've sent a 6-digit code to {userEmail}
                </p>
              </div>
              
              <div>
                <label className="block font-medium mb-2 text-black">Enter Verification Code</label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter 6-digit code from email"
                  className="w-full p-3 border border-gray-300 text-black rounded-md text-center text-lg tracking-wider"
                  disabled={isDeleting}
                  maxLength={6}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Code expires in 10 minutes. Check your spam folder if you don't see it.
                </p>
              </div>
            </>
          )}
        </div>

        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={() => {
              onClose();
              setStep(1);
              setUserEmail('');
              setVerificationCode('');
            }}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            disabled={isLoading || isDeleting}
          >
            Cancel
          </button>
          
          {step === 1 ? (
            <button
              onClick={handleSendCode}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                'Sending...'
              ) : (
                <>
                  <Mail size={16} />
                  Send Code
                </>
              )}
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  setStep(1);
                  setVerificationCode('');
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                disabled={isDeleting}
              >
                Back
              </button>
              <button
                onClick={handleVerifyAndDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete Paper'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeletePaperDialog;