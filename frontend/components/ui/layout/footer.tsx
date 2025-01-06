'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from 'react';
import { toast } from 'sonner';

const socialLinks = [
  {
    href: "https://x.com/bark_protocol",
    ariaLabel: "X",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    href: "https://t.me/@bark_protocol",
    ariaLabel: "Telegram",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
    ),
  },
  {
    href: "https://discord.gg/PaZQzMFMNW",
    ariaLabel: "Discord",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.77 4.33c-2.41-.47-4.71-.9-7.04-.9-2.34 0-4.63.43-7.04.9C3.27 4.7 2 6.44 2 8.43v7.23c0 1.99 1.27 3.73 3.73 4.1 2.41.47 4.71.9 7.04.9s4.63-.43 7.04-.9c2.46-.37 3.73-2.11 3.73-4.1V8.43c0-1.99-1.27-3.73-3.73-4.1zM12 18.61c-1.72 0-3.47-.26-5.02-.72-.4-.11-.56-.57-.31-.9.41-.52.73-.94.73-.95s1.01-.72 1.84-1.13c.84-.42 1.54-.72 2.42-.72 1.58 0 3.17.9 4.21 2.15 1.5 1.51 1.85 3.62 1.15 5.33-.17.4-.64.58-1.03.43-.39-.17-.56-.64-.37-1.03-.1-.02-.42-.28-.64-.5-.36-.34-.69-.67-.93-1.03-.24-.36-.45-.73-.67-1.13-1.03-.27-2.16-.49-3.29-.7-.57-.15-.88-.61-.9-1.17-.02-.57.33-1.03.88-1.17 1.13-.23 2.27-.45 3.4-.71-.02-.07-.06-.15-.09-.22.07-.31.09-.62.09-.94 0-.94-.03-1.88-.08-2.81-.35-.3-.75-.65-1.21-.91-.45-.26-.9-.47-1.38-.7-.47-.23-.97-.42-1.47-.61-.23-.11-.45-.23-.69-.34-.53-.24-.98-.51-1.5-.78-.56-.29-.96-.83-.96-1.48 0-1.06.85-1.92 1.91-1.92s1.91.85 1.91 1.92c0 .65-.4 1.2-.96 1.48-.52.27-.97.54-1.5.78-.24.11-.46.23-.69.34-.5.19-.99.38-1.47.61-.48.23-.93.44-1.38.7-.46.26-.86.61-1.21.91-.04-.93-.07-1.87-.07-2.81 0-.31.02-.63.09-.94-.03-.07-.07-.14-.1-.22 1.13.26 2.27.48 3.4.71.55.14.89.61.87 1.17-.03.57-.33 1.02-.9 1.17-1.13.23-2.27.45-3.4.71.03-.07.07-.15.1-.22 1.02-.01 2.02-.08 3.03-.18 1.55-.17 2.95-.53 4.32-1.04 1.22-.45 2.16-1.31 2.68-2.37.29-.58.52-1.18.7-1.79-.49-.29-.96-.57-1.47-.87z"/>
      </svg>
    ),
  },
  {
    href: "https://instagram.com/bark.protocol",
    ariaLabel: "Instagram",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.16a9.84 9.84 0 1 0 9.84 9.84A9.853 9.853 0 0 0 12 2.16zm0 18.72A8.88 8.88 0 1 1 20.88 12a8.891 8.891 0 0 1-8.88 8.88zM12 7.32a4.68 4.68 0 1 0 4.68 4.68A4.684 4.684 0 0 0 12 7.32zm0 7.08a2.4 2.4 0 1 1 2.4-2.4 2.397 2.397 0 0 1-2.4 2.4zM18.6 5.4a.9.9 0 1 0 .9.9.9.9 0 0 0-.9-.9z"/>
      </svg>
    ),
  },
];

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the email to your backend
    console.log('Subscribing email:', email);
    toast.success('Thank you for subscribing!');
    setEmail('');
  };

  return (
    <footer className="w-full bg-gray-950 text-gray-200 border-t border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <Image
                src="https://ucarecdn.com/bbc74eca-8e0d-4147-8a66-6589a55ae8d0/bark.webp"
                alt="BARK Logo"
                width={40}
                height={40}
                className="rounded-full"
              />
              <h2 className="text-xl font-semibold text-white">
                <span className="text-sand-300">Blink</span><span className="font-light text-white">Share</span>
              </h2>
            </div>
            <p className="text-sm text-gray-400 mb-6">
              BlinkShare is a powerful platform designed to enable seamless Solana blockchain transactions directly within Discord communities.
            </p>
            <div className="flex space-x-6">
              {socialLinks.map((link, index) => (
                <a 
                  key={index} 
                  href={link.href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label={link.ariaLabel} 
                  className="text-gray-400 hover:text-sand-300 transition-all"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Section */}
          <div className="space-y-4 text-sm">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/pages/about-us" className="hover:text-sand-300 transition-colors">About Us</Link></li>
              <li><Link href="/pages/terms" className="hover:text-sand-300 transition-colors">Terms of Service</Link></li>
              <li><Link href="/pages/privacy-policy" className="hover:text-sand-300 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Subscription Section */}
          <div className="space-y-4 text-sm">
            <h3 className="text-lg font-semibold text-white">Stay Updated</h3>
            <p>Sign up for updates and news.</p>
            <form onSubmit={handleSubscribe}>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-x-2 sm:space-y-0">
                <Input 
                  type="email" 
                  placeholder="Your email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-800 border-0 rounded-md text-gray-300 placeholder-gray-500 py-2 px-3 w-full sm:w-2/3"
                  required
                />
                <Button type="submit" className="mt-4 sm:mt-0 w-full sm:w-1/3 bg-white text-black hover:bg-sand-400 transition-colors">Subscribe</Button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="text-center text-sm text-gray-400 pt-8 border-t border-gray-800">
          <p>&copy; {new Date().getFullYear()} BARK Protocol. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
