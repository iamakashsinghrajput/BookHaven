'use client';

import { Facebook, Twitter, Instagram } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
    return (
        <footer className="w-full bg-gray-900 text-gray-400">
            <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="flex flex-col gap-4">
                        <Link href="/" className="flex items-center gap-2">
                            <Image src="/logo.svg" alt="BookHaven Logo" width={40} height={40} />
                            <h3 className="text-xl font-bold text-white font-rampart">BookHaven</h3>
                        </Link>
                        <p>Your community hub for learning, discovery, and imagination.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                            <li><Link href="/catalog" className="hover:text-white">Catalog</Link></li>
                            <li><Link href="/events" className="hover:text-white">Events</Link></li>
                            <li><Link href="/question-papers" className="hover:text-white">Question Papers</Link></li>
                            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white mb-4">Contact Us</h4>
                        <p>F-No: 187623</p>
                        <p>VVIP Homes, Greater Noida</p>
                        <p className="mt-2">9351 736629</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white mb-4">Follow Us</h4>
                        <div className="flex space-x-4">
                            <a href="#" className="hover:text-white"><Facebook /></a>
                            <a href="#" className="hover:text-white"><Twitter /></a>
                            <a href="#" className="hover:text-white"><Instagram /></a>
                        </div>
                    </div>
                    </div>
                    <div className="mt-8 border-t border-gray-800 pt-6 flex justify-between items-center text-sm">
                        <p>&copy; {new Date().getFullYear()} BookHaven Library. All rights reserved.</p>
                        <div className="flex items-center gap-2">
                            <p>Designed and Developed by:</p>
                            <a href="https://portfolio-lyart-gamma-39.vercel.app/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                                <Image src="/Akashstudios.svg" alt="Akash Studios Logo" width={24} height={24} />
                                <span>Akash Studios</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;