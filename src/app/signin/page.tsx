'use client';

import Image from 'next/image';
import { User, Lock } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { signIn } from 'next-auth/react'; // Import signIn
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaGoogle } from 'react-icons/fa';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });
    
    if (result?.error) {
      setError(result.error);
    } else if (result?.ok) {
      router.push('/'); // Redirect to home on success
    }
    setIsLoading(false);
  };

  return (
    <>
      <Header />
      <main className="h-screen flex items-center justify-center bg-gray-100 overflow-hidden">
        <div className="relative w-full max-w-6xl">
          <div className="relative flex w-full flex-col overflow-hidden rounded-2xl shadow-2xl lg:flex-row mx-auto">
            <div className="absolute inset-0 bg-black/20 rounded-2xl transform translate-y-8 translate-x-4 blur-xl"></div>
            
            <div className="relative z-10 w-full p-8 lg:w-1/2 flex flex-col justify-center h-[500px]" style={{backgroundColor: 'rgba(97, 56, 200, 0.39)'}}>
              <h1 className="text-4xl font-bold text-black font-rampart">Welcome to <br />BookHaven</h1>
              <div className="my-4 h-1 w-20 bg-white/50"></div>
              <p className="max-w-sm text-gray-800">
                Your personal library for acing exams. Access thousands of question papers, notes, and study guides.
              </p>
              {/* Google Sign-In Button */}
              <button
                onClick={() => signIn('google', { callbackUrl: '/' })}
                className="mt-8 w-fit flex items-center gap-3 rounded-full border-2 border-black px-6 py-2 font-semibold text-black transition hover:bg-white/30"
              >
                <FaGoogle /> Sign in with Google
              </button>
            </div>

            <div className="w-full bg-white p-8 pl-24 pr-8 lg:w-1/2 flex flex-col justify-center relative z-10 h-[500px]">
              <h2 className="text-3xl font-bold text-gray-800">Sign In</h2>
              <div className="my-4 h-1 w-16 bg-brand-blue"></div>

              <form onSubmit={handleCredentialsSignIn} className="space-y-8">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address" 
                    required
                    className="w-full border-b-2 text-gray-500 border-gray-200 py-3 pl-10 focus:border-brand-blue focus:outline-none"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password" 
                    required
                    className="w-full border-b-2 text-gray-500 border-gray-200 py-3 pl-10 focus:border-brand-blue focus:outline-none"
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-48 rounded-full bg-brand-blue py-3 font-semibold border-2 border-black text-black transition hover:bg-blue-700 hover:text-white hover:border-white cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? "Logging in..." : "Login"}
                </button>
              </form>

              <div className="mt-8 text-sm text-gray-500">
                Forgot your password?{' '}
                <a href="#" className="font-semibold text-brand-blue hover:underline">Reset it</a>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don&apos;t have an account?{' '}
                  <a href="/signup" className="font-semibold text-brand-blue hover:underline">
                    Sign up here
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30"
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

export default SignInPage;