'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Search, ChevronRight, Menu, X, User, LogOut, Shield } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';

const Header = () => {
  const { data: session, status } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Effect to handle scrolling
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  // Effect to handle clicking outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      className={`sticky top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-sm shadow-md text-black' : 'bg-white text-black'
      }`}
    >
      {/* Top bar */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center text-sm py-2 border-b border-gray-200">
          <div className="flex gap-x-6">
            <Link href="/dashboard" className="hover:underline flex items-center gap-1">
              My Account <ChevronRight size={14} />
            </Link>
            <a href="#" className="hover:underline flex items-center gap-1">
              Help <ChevronRight size={14} />
            </a>
          </div>
          <a href="#" className="hover:underline flex items-center gap-1">
            Digital Portal <ChevronRight size={14} />
          </a>
        </div>
      </div>
      
      {/* Main navigation */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="text-2xl font-bold flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.svg" alt="BookHaven Logo" width={50} height={50} />
              <div className="flex flex-col uppercase tracking-tighter leading-none font-rampart">
                <span>Book</span><span>Haven</span>
              </div>
            </Link>
          </div>
           <nav className="hidden md:flex items-center gap-x-8 text-base">
              <Link href="/catalog" className="hover:text-brand-blue transition-colors">Catalog</Link>
              <Link href="/events" className="hover:text-brand-blue transition-colors">Events</Link>
              <Link href="/question-papers" className="hover:text-brand-blue transition-colors">Exam Prep</Link>
              <Link href="/about" className="hover:text-brand-blue transition-colors">About Us</Link>
              <Link href="/contact" className="hover:text-brand-blue transition-colors">Contact</Link>
            </nav>
          <div className="flex items-center gap-x-4">
            {status === 'authenticated' ? (
              <div className="relative" ref={dropdownRef}>
                {session?.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    width={40}
                    height={40}
                    className="rounded-full cursor-pointer border-2 border-gray-200 hover:border-brand-blue transition-colors"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  />
                ) : (
                  <div
                    className="w-10 h-10 rounded-full bg-gray-200 border-2 border-gray-300 cursor-pointer hover:border-brand-blue transition-colors flex items-center justify-center"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <User className="h-6 w-6 text-gray-600" />
                  </div>
                )}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-20">
                    {(session?.user as any)?.userType === 'admin' && (
                      <>
                        <div className="px-4 py-2 text-xs font-semibold text-blue-600 bg-blue-50 border-b">
                          <Shield className="inline mr-1" size={14} />
                          ADMIN ACCESS
                        </div>
                        <Link href="/admin/dashboard" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <Shield className="mr-2" size={16} />
                          Admin Dashboard
                        </Link>
                        <div className="border-t border-gray-100 my-1"></div>
                      </>
                    )}
                    <Link href="/dashboard" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <User className="mr-2" size={16} />
                      My Account
                    </Link>
                    <button
                      onClick={() => {
                        signOut({ callbackUrl: '/' });
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="mr-2" size={16} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/signin">
                <button className="hidden sm:block px-5 py-2 cursor-pointer border border-black rounded-full hover:bg-black hover:text-white transition-colors">
                  Join
                </button>
              </Link>
            )}
            <button className="p-2">
              <Search size={24} />
            </button>
            <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white text-black">
          <nav className="flex flex-col items-center gap-y-4 py-4">
            <Link href="/catalog" className="hover:text-brand-blue transition-colors">Catalog</Link>
            <Link href="/events" className="hover:text-brand-blue transition-colors">Events</Link>
            <Link href="/question-papers" className="hover:text-brand-blue transition-colors">Exam Prep</Link>
            <Link href="/about" className="hover:text-brand-blue transition-colors">About Us</Link>
            <Link href="/contact" className="hover:text-brand-blue transition-colors">Contact</Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;