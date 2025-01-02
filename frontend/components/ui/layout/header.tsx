'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { WalletButton } from "@/components/ui/wallet-button"
import Image from 'next/image'
import { useState } from 'react'
import { FaCogs, FaDiscord, FaQuestionCircle, FaUserAlt } from 'react-icons/fa'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <header className="w-full py-4 px-6 fixed top-0 z-50 bg-transparent">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and Title */}
        <div className="flex items-center space-x-2">
          <Image
            src="https://ucarecdn.com/bbc74eca-8e0d-4147-8a66-6589a55ae8d0/bark.webp"
            alt="BARK Logo"
            width={40}
            height={40}
            className="rounded-full"
            role="img"
            aria-label="BARK Logo"
          />
          <h1 className="text-xl font-bold text-white">
            Blink<span className="font-light">Share</span>
          </h1>
        </div>

        {/* Navbar (Desktop) */}
        <nav className="hidden md:flex flex-grow justify-center space-x-6">
          <Link href="/features" className="text-white/80 hover:text-white flex items-center space-x-2">
            <FaCogs /> <span>Features</span>
          </Link>
          <Link href="https://discord.gg/invite/BxQUSECy" className="text-white/80 hover:text-white flex items-center space-x-2">
            <FaDiscord /> <span>Discord</span>
          </Link>
          <Link href="/my-blinks" className="text-white/80 hover:text-white flex items-center space-x-2">
            <FaUserAlt /> <span>My Blinks</span>
          </Link>
          <Link href="/faq" className="text-white/80 hover:text-white flex items-center space-x-2">
            <FaQuestionCircle /> <span>FAQ</span>
          </Link>
        </nav>

        {/* Hamburger Menu (Mobile) */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            aria-label="Toggle menu"
            className="text-white focus:outline-none"
          >
            {isMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                <path d="M4.293 4.293a1 1 0 0 1 1.414 0L8 5.586l2.293-2.293a1 1 0 0 1 1.414 1.414L9.414 7l2.293 2.293a1 1 0 1 1-1.414 1.414L8 8.414l-2.293 2.293a1 1 0 1 1-1.414-1.414L6.586 7 4.293 4.707a1 1 0 0 1 0-1.414z"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
                <path d="M2 3h12a1 1 0 1 1 0 2H2a1 1 0 1 1 0-2zm0 4h12a1 1 0 1 1 0 2H2a1 1 0 1 1 0-2zm0 4h12a1 1 0 1 1 0 2H2a1 1 0 1 1 0-2z"/>
              </svg>
            )}
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <WalletButton />
          <Button asChild className="text-white bg-primary hover:bg-primary/90">
            <Link href="/create-blink">Create a Blink</Link>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/90 text-white p-4 space-y-4">
          <Link href="/features" className="block flex items-center space-x-2">
            <FaCogs /> <span>Features</span>
          </Link>
          <Link href="https://discord.gg/invite/BxQUSECy" className="block flex items-center space-x-2">
            <FaDiscord /> <span>Discord</span>
          </Link>
          <Link href="/my-blinks" className="block flex items-center space-x-2">
            <FaUserAlt /> <span>My Blinks</span>
          </Link>
          <Link href="/faq" className="block flex items-center space-x-2">
            <FaQuestionCircle /> <span>FAQ</span>
          </Link>
        </div>
      )}
    </header>
  )
}
