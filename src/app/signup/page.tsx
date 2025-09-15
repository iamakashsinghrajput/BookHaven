'use client';

import Image from 'next/image';
import { User, Lock, Mail } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const SignUpPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        setIsOtpSent(true);
      } else {
        const errorText = await res.text();
        setError(errorText || 'Registration failed.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Registration error:', err);
    }
    
    setIsLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    const res = await fetch('/api/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: formData.email, otp }),
    });
    if (res.ok) {
      const signInRes = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });
      if (signInRes?.ok) {
        router.push('/');
      } else {
        setError(signInRes?.error || 'Failed to log in. Please try again.');
        setIsOtpSent(false); // Go back to sign-in/register
      }
    } else {
      const data = await res.json();
      setError(data.message || 'OTP verification failed.');
    }
    setIsLoading(false);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen flex items-center justify-center bg-gray-100 py-4 px-4">
        <div className="relative w-full max-w-6xl">
          <div className="relative flex w-full flex-col overflow-hidden rounded-2xl shadow-2xl lg:flex-row mx-auto">
            <div className="absolute inset-0 bg-black/20 rounded-2xl transform translate-y-2 translate-x-2 lg:translate-y-8 lg:translate-x-4 blur-xl"></div>

            <div className="relative z-10 w-full p-6 sm:p-8 lg:w-1/2 flex flex-col justify-center min-h-[300px] sm:min-h-[400px] lg:h-[500px]" style={{backgroundColor: 'rgba(97, 56, 200, 0.39)'}}>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black font-rampart">Join <br />BookHaven</h1>
              <div className="my-4 h-1 w-16 sm:w-20 bg-white/50"></div>
              <p className="max-w-sm text-sm sm:text-base text-gray-800">
                Create your account to save papers, track your progress, and join a community of dedicated learners.
              </p>
              <a href="/signin" className="mt-6 sm:mt-8 w-fit rounded-full border-2 border-gray-300 px-6 sm:px-8 py-2 text-sm sm:text-base font-semibold text-gray-300 transition hover:bg-white/10">
                Login
              </a>
            </div>

            <div className="w-full bg-white p-6 sm:p-8 lg:pl-24 lg:pr-8 lg:w-1/2 flex flex-col justify-center relative z-10 min-h-[400px] lg:h-[500px]">
              {!isOtpSent ? (
                <>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Sign Up</h2>
                  <div className="my-4 h-1 w-16 bg-brand-blue"></div>
                  <form onSubmit={handleRegister} className="space-y-4 sm:space-y-6">
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <input name="name" type="text" placeholder="Full Name" onChange={handleInputChange} required className="w-full border-b-2 border-gray-200 text-gray-400 py-3 pl-10 focus:border-brand-blue focus:outline-none"/>
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <input name="email" type="email" placeholder="Email Address" onChange={handleInputChange} required className="w-full border-b-2 border-gray-200 text-gray-400 py-3 pl-10 focus:border-brand-blue focus:outline-none"/>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <input name="password" type="password" placeholder="Password" onChange={handleInputChange} required className="w-full border-b-2 border-gray-200 text-gray-400 py-3 pl-10 focus:border-brand-blue focus:outline-none"/>
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button type="submit" disabled={isLoading} className="w-full sm:w-48 rounded-full bg-brand-blue py-3 font-semibold text-black border-2 border-black transition hover:bg-blue-700 hover:text-white hover:border-white cursor-pointer disabled:opacity-50 text-sm sm:text-base">
                      {isLoading ? "Sending..." : "Create Account"}
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Verify Your Email</h2>
                  <div className="my-4 h-1 w-16 bg-brand-blue"></div>
                  <p className="text-sm sm:text-base text-gray-600 mb-4">An OTP has been sent to <strong>{formData.email}</strong>. Please enter it below.</p>
                  <form onSubmit={handleVerifyOtp} className="space-y-4 sm:space-y-6">
                    <div className="relative">
                      <input value={otp} onChange={(e) => setOtp(e.target.value)} type="text" placeholder="6-digit OTP" maxLength={6} required className="w-full border-b-2 border-gray-200 text-gray-400 py-3 text-center tracking-[0.3em] sm:tracking-[0.5em] text-lg sm:text-xl font-semibold focus:border-brand-blue focus:outline-none"/>
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button type="submit" disabled={isLoading} className="w-full sm:w-48 rounded-full bg-brand-blue py-3 font-semibold text-black border-2 border-black transition hover:bg-blue-700 hover:text-white hover:border-white cursor-pointer disabled:opacity-50 text-sm sm:text-base">
                       {isLoading ? "Verifying..." : "Verify & Sign In"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>

          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 hidden lg:block"
            style={{ filter: "drop-shadow(0 25px 50px rgba(0, 0, 0, 0.3))", pointerEvents: "none" }}
          >
            <Image
              src="/study-character.png"
              alt="3D Character studying with books"
              width={400}
              height={650}
              className="drop-shadow-2xl"
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default SignUpPage;