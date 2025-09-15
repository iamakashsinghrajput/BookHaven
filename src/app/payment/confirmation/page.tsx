'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Download, Home } from 'lucide-react';
import Link from 'next/link';

const PaymentConfirmationContent = () => {
  const [paymentStatus, setPaymentStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [paperTitle, setPaperTitle] = useState<string>('');
  const searchParams = useSearchParams();

  useEffect(() => {
    const paymentId = searchParams.get('payment_id');
    const orderId = searchParams.get('order_id');
    const signature = searchParams.get('signature');

    if (paymentId && orderId && signature) {
      verifyPayment(paymentId, orderId, signature);
    } else {
      setPaymentStatus('failed');
    }
  }, [searchParams]);

  const verifyPayment = async (paymentId: string, orderId: string, signature: string) => {
    try {
      const response = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          razorpay_payment_id: paymentId,
          razorpay_order_id: orderId,
          razorpay_signature: signature,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPaymentStatus('success');
        setDownloadUrl(data.downloadUrl);
        setPaperTitle(data.paperTitle);
      } else {
        setPaymentStatus('failed');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setPaymentStatus('failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
        {paymentStatus === 'loading' && (
          <div className="space-y-4">
            <div className="animate-spin w-16 h-16 mx-auto border-4 border-blue-500 border-t-transparent rounded-full"></div>
            <h2 className="text-xl font-bold text-gray-800">Verifying Payment...</h2>
            <p className="text-gray-600">Please wait while we confirm your payment.</p>
          </div>
        )}

        {paymentStatus === 'success' && (
          <div className="space-y-6">
            <div className="space-y-4">
              <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
              <h2 className="text-2xl font-bold text-green-600">Payment Successful!</h2>
              <p className="text-gray-600">
                Thank you for your purchase. Your payment of ₹10 has been processed successfully.
              </p>
            </div>

            {paperTitle && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Question Paper:</h3>
                <p className="text-gray-600 text-sm">{paperTitle}</p>
              </div>
            )}

            <div className="space-y-4">
              {downloadUrl && (
                <a
                  href={downloadUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Download size={20} />
                  Download Question Paper
                </a>
              )}

              <Link
                href="/question-papers"
                className="w-full flex items-center justify-center gap-2 py-3 px-6 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Home size={20} />
                Back to Question Papers
              </Link>
            </div>
          </div>
        )}

        {paymentStatus === 'failed' && (
          <div className="space-y-6">
            <div className="space-y-4">
              <XCircle className="w-16 h-16 mx-auto text-red-500" />
              <h2 className="text-2xl font-bold text-red-600">Payment Failed</h2>
              <p className="text-gray-600">
                Unfortunately, your payment could not be processed. Please try again or contact support if the issue persists.
              </p>
            </div>

            <div className="space-y-4">
              <Link
                href="/question-papers"
                className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Home size={20} />
                Back to Question Papers
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const PaymentConfirmationPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
          <div className="animate-spin w-16 h-16 mx-auto border-4 border-blue-500 border-t-transparent rounded-full"></div>
          <h2 className="text-xl font-bold text-gray-800 mt-4">Loading...</h2>
        </div>
      </div>
    }>
      <PaymentConfirmationContent />
    </Suspense>
  );
};

export default PaymentConfirmationPage;