'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Eye, Shield, AlertTriangle } from 'lucide-react';
import { QuestionPaper } from '../data/questionPapers';

interface SecurePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  paper: QuestionPaper;
}

const SecurePreviewModal: React.FC<SecurePreviewModalProps> = ({
  isOpen,
  onClose,
  paper,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSecurityViolation, setIsSecurityViolation] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLIFrameElement>(null);
  const [focusLost, setFocusLost] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    // Security measures
    const securityMeasures = () => {
      let rightClickCount = 0;

      // Disable right-click context menu
      const disableContextMenu = (e: MouseEvent) => {
        e.preventDefault();
        rightClickCount++;

        // Only flag as violation after multiple attempts (3+ right clicks)
        if (rightClickCount >= 3) {
          setViolationCount(prev => prev + 1);
          setIsSecurityViolation(true);
        } else {
          console.warn(`Right-click blocked (${rightClickCount}/3 attempts)`);
        }
      };

      // Disable keyboard shortcuts
      const disableKeyboardShortcuts = (e: KeyboardEvent) => {
        // Prevent common screenshot/recording shortcuts
        const isViolation =
          e.key === 'PrintScreen' ||
          (e.ctrlKey && e.key === 's') || // Ctrl+S (Save)
          (e.ctrlKey && e.key === 'p') || // Ctrl+P (Print)
          (e.ctrlKey && e.shiftKey && e.key === 'I') || // DevTools
          (e.key === 'F12') || // DevTools
          (e.ctrlKey && e.shiftKey && e.key === 'J') || // DevTools Console
          (e.ctrlKey && e.key === 'u') || // View Source
          (e.ctrlKey && e.shiftKey && e.key === 'C'); // DevTools Elements

        if (isViolation) {
          e.preventDefault();
          // Show warning but don't immediately flag as violation
          console.warn('Blocked keyboard shortcut:', e.key);
        }

        // Only flag as security violation for serious attempts
        if (
          e.key === 'PrintScreen' ||
          (e.key === 'F12') ||
          (e.ctrlKey && e.shiftKey && e.key === 'I')
        ) {
          setViolationCount(prev => prev + 1);
          // Show violation warning only after 2+ violations
          if (violationCount >= 1) {
            setIsSecurityViolation(true);
          }
        }
      };

      // Detect window focus changes (potential screen recording)
      const handleVisibilityChange = () => {
        if (document.hidden) {
          setFocusLost(true);
          // Close preview after 10 seconds of focus loss (increased from 3 seconds)
          setTimeout(() => {
            if (document.hidden) {
              onClose();
            }
          }, 10000);
        } else {
          setFocusLost(false);
        }
      };

      // Prevent text selection
      const preventSelection = (e: Event) => {
        e.preventDefault();
      };

      // Add event listeners
      document.addEventListener('contextmenu', disableContextMenu);
      document.addEventListener('keydown', disableKeyboardShortcuts);
      document.addEventListener('visibilitychange', handleVisibilityChange);
      document.addEventListener('selectstart', preventSelection);
      window.addEventListener('blur', handleVisibilityChange);

      // Cleanup function
      return () => {
        document.removeEventListener('contextmenu', disableContextMenu);
        document.removeEventListener('keydown', disableKeyboardShortcuts);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        document.removeEventListener('selectstart', preventSelection);
        window.removeEventListener('blur', handleVisibilityChange);
      };
    };

    const cleanup = securityMeasures();

    // Load preview
    loadPreview();

    return cleanup;
  }, [isOpen, onClose]);

  // Monitor for screen capture attempts (disabled - too sensitive)
  useEffect(() => {
    if (!isOpen) return;

    // Note: Performance monitoring disabled due to false positives
    // Can be re-enabled with more sophisticated detection algorithms

    return () => {}; // No cleanup needed
  }, [isOpen]);

  const loadPreview = async () => {
    try {
      setIsLoading(true);

      // Call preview API endpoint
      const response = await fetch(`/api/preview-paper`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paperId: paper.id,
          paperUrl: paper.url,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to load preview');
      }

      const data = await response.json();
      setPreviewUrl(`${data.previewUrl}#page=1`);
      console.log('Preview loaded successfully:', data.previewUrl);
    } catch (error) {
      console.error('Preview loading error:', error);
      // Set a fallback preview URL for local sample papers
      if (paper.url.includes('sample-papers') || paper.url === '#') {
        setPreviewUrl(`/api/secure-embed?local=${encodeURIComponent('/sample-papers/sample.pdf')}&paper=${paper.id}&user=${encodeURIComponent('preview')}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      {/* Security violation overlay */}
      {isSecurityViolation && (
        <div className="absolute inset-0 bg-yellow-500/20 backdrop-blur-sm flex items-center justify-center z-60">
          <div className="bg-yellow-500 text-black p-6 rounded-lg max-w-md text-center">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2">Security Warning</h3>
            <p className="text-sm mb-4">
              We detected {violationCount + 1} attempts to use restricted features. Please avoid using screenshot tools or developer shortcuts while previewing.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsSecurityViolation(false)}
                className="flex-1 px-4 py-2 bg-white text-yellow-600 rounded-lg font-semibold hover:bg-gray-100"
              >
                Continue Preview
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-black text-white rounded-lg font-semibold hover:bg-gray-800"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Focus loss warning */}
      {focusLost && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black px-4 py-2 rounded-lg z-60">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} />
            <span className="text-sm font-semibold">
              Preview will close in 10 seconds if window remains inactive
            </span>
          </div>
        </div>
      )}

      <div
        ref={modalRef}
        className="bg-white rounded-lg max-w-4xl max-h-[90vh] w-full flex flex-col overflow-hidden"
        style={{ userSelect: 'none' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div className="flex items-center gap-3">
            <Eye className="text-blue-500" size={20} />
            <div>
              <h3 className="font-bold text-gray-800">{paper.title}</h3>
              <p className="text-sm text-gray-600">{paper.subject} • {paper.year}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full">
              <Shield size={14} />
              <span className="text-xs font-semibold">Secure Preview</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-yellow-50 border-b border-yellow-200 p-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="text-yellow-600 flex-shrink-0 mt-0.5" size={16} />
            <div className="text-xs text-yellow-800">
              <p><strong>Security Notice:</strong> This is a protected preview. Screenshots, downloads, and screen recording are disabled. Unauthorized attempts will close the preview.</p>
            </div>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 relative overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin w-8 h-8 mx-auto border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
                <p className="text-gray-600">Loading secure preview...</p>
              </div>
            </div>
          ) : previewUrl ? (
            <div className="relative h-full">
              {/* Anti-screenshot overlay pattern */}
              <div
                className="absolute inset-0 pointer-events-none z-10 opacity-10"
                style={{
                  backgroundImage: `
                    repeating-linear-gradient(
                      45deg,
                      transparent,
                      transparent 20px,
                      rgba(0,0,0,0.1) 20px,
                      rgba(0,0,0,0.1) 22px
                    ),
                    repeating-linear-gradient(
                      -45deg,
                      transparent,
                      transparent 20px,
                      rgba(0,0,0,0.1) 20px,
                      rgba(0,0,0,0.1) 22px
                    )
                  `
                }}
              />

              {/* Watermark overlay */}
              <div className="absolute inset-0 pointer-events-none z-20">
                <div className="h-full w-full relative overflow-hidden">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute text-gray-300/20 font-bold text-lg select-none"
                      style={{
                        top: `${(i % 4) * 25}%`,
                        left: `${(i % 5) * 20}%`,
                        transform: 'rotate(-15deg)',
                      }}
                    >
                      PREVIEW ONLY • MY LIBRARY APP
                    </div>
                  ))}
                </div>
              </div>

              {/* PDF Preview */}
              <iframe
                ref={previewRef}
                src={previewUrl}
                className="w-full h-full border-0"
                title="Question Paper Preview"
                style={{
                  userSelect: 'none',
                  minHeight: '600px',
                }}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <AlertTriangle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Preview not available</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <span>Preview Only • Full access requires payment</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  onClose();
                  // Trigger payment flow (you can emit an event or call a callback)
                  window.dispatchEvent(new CustomEvent('startPayment', { detail: { paper } }));
                }}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Pay ₹10 & Download Full Paper
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurePreviewModal;
