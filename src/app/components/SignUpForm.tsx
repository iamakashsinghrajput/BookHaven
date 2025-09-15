'use client';

import Link from 'next/link';

const SignUpForm = () => {
  return (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-gray-500">Join <span className="font-bold text-blue-500">BookHaven</span></p>
          <h2 className="text-4xl font-bold">Sign up</h2>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Have an Account?</p>
          <Link href="/signin" className="text-sm text-blue-500 font-semibold hover:underline">
            Sign in
          </Link>
        </div>
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
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="username">
              User name
            </label>
            <input
              type="text"
              placeholder="User name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="contact">
              Contact Number
            </label>
            <input
              type="tel"
              placeholder="Contact Number"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
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
        </div>
        <button
          type="submit"
          className="w-full bg-[#007BFF] text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition"
        >
          Sign up
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;