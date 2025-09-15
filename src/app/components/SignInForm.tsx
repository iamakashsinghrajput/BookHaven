'use client';

import Link from 'next/link';
import { FaGoogle, FaFacebookF, FaGithub } from 'react-icons/fa';

const SignInForm = () => {
  // On mobile, text is white, on desktop it's black.
  const textColor = 'text-white lg:text-gray-900';
  const subTextColor = 'text-white/80 lg:text-gray-500';
  const inputLabelColor = 'text-white/90 lg:text-gray-700';

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg mx-auto">
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-gray-500">Welcome to <span className="font-bold text-blue-500">BookHaven</span></p>
          <h2 className="text-4xl font-bold">Sign in</h2>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">No Account?</p>
          <Link href="/signup" className="text-sm text-blue-500 font-semibold hover:underline">
            Sign up
          </Link>
        </div>
      </div>

      <div className="flex gap-4 my-6">
        <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
          <FaGoogle className="text-red-500" /> Sign in with Google
        </button>
        <button className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 transition">
          <FaFacebookF className="text-blue-600" />
        </button>
        <button className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 transition">
          <FaGithub />
        </button>
      </div>

      <form>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">
            Enter your username or email address
          </label>
          <input
            type="email"
            placeholder="Username or email address"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="password">
            Enter your Password
          </label>
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="text-right mt-2">
            <a href="#" className="text-sm text-blue-500 hover:underline">Forgot Password?</a>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-[#007BFF] text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition"
        >
          Sign in
        </button>
      </form>
    </div>
  );
};

export default SignInForm;