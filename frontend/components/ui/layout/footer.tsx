import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * Footer Component for the BlinkShare Platform.
 * This component includes:
 * - A logo and brief description of the platform.
 * - Links for quick navigation: Terms & Privacy, Privacy Policy, About Us.
 * - Social media icons for Twitter, Telegram, Discord, and Instagram.
 * - A subscription form for receiving updates.
 * 
 * @returns JSX Element representing the footer section of the platform.
 */
export default function Footer() {
  const socialLinks = [
    {
      href: "https://x.com/bark_protocol",
      ariaLabel: "Twitter",
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
      href: "https://discord.gg/barkprotocol",
      ariaLabel: "Discord",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.317 4.3698a19.7913 19.7913 000-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-.295.9954-.6012.2622.1851-.6999.0808-.8889-.0692z"/>
        </svg>
      ),
    },
    {
      href: "https://instagram.com/bark_protocol",
      ariaLabel: "Instagram",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.16a9.84 9.84 0 1 0 9.84 9.84A9.853 9.853 0 0 0 12 2.16zm0 18.72A8.88 8.88 0 1 1 20.88 12a8.891 8.891 0 0 1-8.88 8.88zM12 7.32a4.68 4.68 0 1 0 4.68 4.68A4.684 4.684 0 0 0 12 7.32zm0 7.08a2.4 2.4 0 1 1 2.4-2.4 2.397 2.397 0 0 1-2.4 2.4zM18.6 5.4a.9.9 0 1 0 .9.9.9.9 0 0 0-.9-.9z"/>
        </svg>
      ),
    },
  ];

  return (
    <footer className="w-full bg-black text-white border-t border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          
          {/* Logo and Description */}
          <div>
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
          <div className="space-y-4 text-sm text-gray-300">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/terms" className="hover:text-sand-300">Terms & Privacy</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-sand-300">Privacy Policy</Link></li>
              <li><Link href="/about-us" className="hover:text-sand-300">About Us</Link></li>
            </ul>
          </div>

          {/* Subscription Section */}
          <div className="space-y-4 text-sm text-gray-300">
            <h3 className="text-lg font-semibold text-white">Stay Updated</h3>
            <p>Sign up for updates and news.</p>
            <form>
              <div className="flex flex-col space-y-2">
                <Input 
                  type="email" 
                  placeholder="Your email" 
                  className="bg-gray-800 border-0 rounded-md text-gray-300 placeholder-gray-500 py-2 px-3"
                />
                <Button className="mt-4 w-full bg-white text-black hover:bg-gray-100 transition-all text-sm py-3">Subscribe</Button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="text-center text-sm text-gray-400 py-4">
          <p>&copy; {new Date().getFullYear()} BARK Protocol. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
