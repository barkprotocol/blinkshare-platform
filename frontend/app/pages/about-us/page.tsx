'use client';

import { Header } from "@/components/ui/layout/header";
import Footer from "@/components/ui/layout/footer";
import { useTheme } from "next-themes";

const AboutUsPage = () => {
  const { theme } = useTheme();

  return (
    <div className={`bg-gray-100 min-h-screen ${theme === 'dark' ? 'bg-black text-white' : 'bg-gray-100 text-black'}`}>
      <Header />
      
      <main className="py-12 px-4 md:px-16">
        <section className="max-w-screen-xl mx-auto">
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
            {/* About Blinkshare */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-3xl font-semibold mb-4">About BlinkShare</h2>
              <p className="text-lg">
                BlinkShare is a next-generation platform designed to simplify blockchain-based interactions. 
                We leverage the power of the Solana blockchain to offer secure and fast NFT management, 
                including minting, staking, and real-world asset integration. Our mission is to provide an intuitive 
                and seamless experience for users and creators alike.
              </p>
            </div>
            
            {/* Blinkshare & BARK Protocol */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-3xl font-semibold mb-4">Part of the BARK Protocol</h2>
              <p className="text-lg">
                BlinkShare is an integral part of the BARK Protocol, a groundbreaking framework that brings together 
                the best of decentralized finance and NFT-based ecosystems. With BARK, users can stake their NFTs, 
                engage with real-world assets, and participate in governance decisions. BARK Protocol’s technology 
                seamlessly integrates with BlinkShare to bring these features to life, empowering users to easily 
                manage, stake, and utilize their assets in a decentralized manner.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutUsPage;
