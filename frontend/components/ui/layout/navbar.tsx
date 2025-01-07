'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { WalletButton } from '@/components/ui/wallet-button';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Store, User } from 'lucide-react';
import { FaDiscord } from 'react-icons/fa';

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/servers", icon: Store, label: "Marketplace" },
  { href: "https://discord.gg/invite/CjUeKEB7b6", icon: FaDiscord, label: "Discord" },
  { href: "/my-blinks", icon: User, label: "My Blinks" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={`w-full py-4 px-6 fixed top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black/80 backdrop-blur-sm' : 'bg-transparent'}`}>
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and title */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="https://ucarecdn.com/bbc74eca-8e0d-4147-8a66-6589a55ae8d0/bark.webp"
            alt="BARK Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <h1 className="text-xl font-bold text-white">
            Blink<span className="font-light">Share</span>
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-grow justify-center space-x-6">
          {navItems.map((item) => (
            <Link 
              key={item.href}
              href={item.href} 
              className="text-[#DBCFC7]/80 hover:text-[#DBCFC7] flex items-center space-x-2 transition-colors duration-200"
              onClick={closeMenu}
            >
              <item.icon size={20} /> <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={toggleMenu}
          aria-label="Toggle menu"
          className="md:hidden text-[#DBCFC7] focus:outline-none"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            fill="currentColor" 
            viewBox="0 0 16 16"
          >
            {isMenuOpen ? (
              <path d="M4.293 4.293a1 1 0 0 1 1.414 0L8 5.586l2.293-2.293a1 1 0 0 1 1.414 1.414L9.414 7l2.293 2.293a1 1 0 1 1-1.414 1.414L8 8.414l-2.293 2.293a1 1 0 1 1-1.414-1.414L6.586 7 4.293 4.707a1 1 0 0 1 0-1.414z"/>
            ) : (
              <path d="M2 3h12a1 1 0 1 1 0 2H2a1 1 0 1 1 0-2zm0 4h12a1 1 0 1 1 0 2H2a1 1 0 1 1 0-2zm0 4h12a1 1 0 1 1 0 2H2a1 1 0 1 1 0-2z"/>
            )}
          </svg>
        </button>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <WalletButton />
          <Button asChild className="text-white bg-black border border-white hover:bg-gray-900 hover:text-white transition-colors duration-200">
            <Link href="https://raydium.io/swap/?inputMint=sol&outputMint=2NTvEssJ2i998V2cMGT4Fy3JhyFnAzHFonDo9dbAkVrg">Buy BARK</Link>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-black/90 text-white p-4 space-y-4"
          >
            {navItems.map((item) => (
              <Link 
                key={item.href}
                href={item.href} 
                className="block flex items-center space-x-2 py-2 transition-colors duration-200 hover:text-white"
                onClick={closeMenu}
              >
                <item.icon size={20} /> <span>{item.label}</span>
              </Link>
            ))}
            <div className="pt-4">
              <WalletButton />
            </div>
            <Button asChild className="w-full text-white bg-black border border-white hover:bg-gray-900 hover:text-gray-100 transition-colors duration-200">
              <Link href="https://raydium.io/swap/?inputMint=sol&outputMint=2NTvEssJ2i998V2cMGT4Fy3JhyFnAzHFonDo9dbAkVrg" onClick={closeMenu}>Buy BARK</Link>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
