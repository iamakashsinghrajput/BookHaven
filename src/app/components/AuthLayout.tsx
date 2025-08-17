'use client';

import Image from 'next/image';
import React from 'react';
import { motion } from 'framer-motion';
import { FaRegTimesCircle } from 'react-icons/fa';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  showLoginAs?: boolean; // Optional prop to show the "Login as" section
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle, showLoginAs = false }) => {
  return (
    <div className="min-h-screen bg-white">
      <div className="relative min-h-screen lg:grid lg:grid-cols-2">
        {/* Blue Background Pane */}
        <div className="absolute top-0 left-0 w-full h-3/5 bg-[#007BFF] lg:relative lg:h-full"></div>
        
        {/* Left Side Content */}
        <div className="relative lg:flex lg:flex-col lg:justify-between p-8 lg:p-12 z-10">
          <h1 className="text-2xl font-bold text-white">BookHaven</h1>

          <div className="mt-20 lg:mt-0">
            <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight" dangerouslySetInnerHTML={{ __html: title }} />
            <p className="mt-4 max-w-md text-white/80">{subtitle}</p>
          </div>

          {/* Conditionally rendered "Login as" section */}
          {showLoginAs && (
            <div className="hidden lg:block">
              <h3 className="mb-4 text-gray-600">Login as</h3>
              <div className="flex gap-4">
                <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-lg cursor-pointer relative group">
                  <Image src="/user-1.jpg" alt="John Peter" width={48} height={48} className="rounded-full" />
                  <div>
                    <p className="font-semibold text-gray-800">John Peter</p>
                    <p className="text-xs text-gray-500">Active 1 days ago</p>
                  </div>
                  <FaRegTimesCircle className="absolute top-2 right-2 text-gray-400 group-hover:text-gray-600" />
                </div>
                <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-lg cursor-pointer relative group">
                  <Image src="/user-2.jpg" alt="Alina Shmen" width={48} height={48} className="rounded-full" />
                  <div>
                    <p className="font-semibold text-gray-800">Alina Shmen</p>
                    <p className="text-xs text-gray-500">Active 4 days ago</p>
                  </div>
                  <FaRegTimesCircle className="absolute top-2 right-2 text-gray-400 group-hover:text-gray-600" />
                </div>
              </div>
            </div>
          )}
          {!showLoginAs && <div className="hidden lg:block"></div>} {/* Placeholder to maintain spacing */}
        </div>

        {/* Right Side - Form Card and Illustration */}
        <div className="relative flex items-center justify-center p-8 lg:p-0">
          <motion.div
            className="hidden lg:block absolute z-0"
            style={{ top: '10%', left: '-20%' }}
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Image
              src="/rocket-launch.png"
              alt="Illustration of a person launching their knowledge"
              width={400}
              height={400}
            />
          </motion.div>
          
          {/* The form card will be passed as children */}
          <div className="relative z-20 w-full text-black">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;