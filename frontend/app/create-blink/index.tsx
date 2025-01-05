'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { WalletButton } from '@/components/ui/wallet-button';
import { Input } from '@/components/ui/input';
import { FaDonate, FaImage, FaLink } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, clusterApiUrl } from '@solana/web3.js';
import { getSolanaPrice, createBlinkNFT } from '@/lib/actions/create-blink';

type BlinkData = {
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  donation: number;
  links: string[];
};

export default function CreateBlinkPage() {
  const [blinkData, setBlinkData] = useState<BlinkData>({
    title: '',
    description: '',
    imageUrl: '',
    price: 0,
    donation: 0,
    links: [],
  });
  const [previewImage, setPreviewImage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [solPrice, setSolPrice] = useState<number>(0);
  const { publicKey, connected } = useWallet();
  const router = useRouter();
  const connection = useMemo(() => new Connection(clusterApiUrl('devnet')), []);

  // Load Solana price for Blink
  useEffect(() => {
    const fetchSolPrice = async () => {
      const price = await getSolanaPrice(); // Your price-fetching logic here
      setSolPrice(price);
    };
    fetchSolPrice();
  }, []);

  // Handle image preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Handle Blink creation
  const handleCreateBlink = async () => {
    if (!connected || !publicKey) {
      alert('Please connect your wallet first');
      return;
    }

    setIsProcessing(true);
    try {
      const transaction = await createBlinkNFT(blinkData, publicKey, connection); // Implement NFT creation logic
      alert('Blink NFT created successfully');
      router.push(`/my-blinks`); // Redirect to user’s Blinks page
    } catch (error) {
      console.error('Error creating Blink:', error);
      alert('Failed to create Blink NFT');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle donation update
  const handleDonationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBlinkData({
      ...blinkData,
      donation: parseFloat(e.target.value),
    });
  };

  // Handle link addition
  const handleLinkAdd = () => {
    setBlinkData({
      ...blinkData,
      links: [...blinkData.links, ''], // Add an empty string for new link
    });
  };

  const handleLinkChange = (index: number, value: string) => {
    const updatedLinks = [...blinkData.links];
    updatedLinks[index] = value;
    setBlinkData({
      ...blinkData,
      links: updatedLinks,
    });
  };

  return (
    <main className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">Create Your Blink</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Input
            label="Title"
            value={blinkData.title}
            onChange={(e) => setBlinkData({ ...blinkData, title: e.target.value })}
          />
          <Input
            label="Description"
            value={blinkData.description}
            onChange={(e) => setBlinkData({ ...blinkData, description: e.target.value })}
          />
          <div>
            <label className="block text-sm font-medium">Upload Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} className="mt-2" />
            {previewImage && (
              <motion.img
                src={previewImage}
                alt="Blink preview"
                className="mt-4 w-full h-auto max-w-xs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
            )}
          </div>
          <div className="flex items-center space-x-2">
            <FaDonate />
            <Input
              type="number"
              label="Donation Amount (SOL)"
              value={blinkData.donation}
              onChange={handleDonationChange}
              placeholder="Amount in SOL"
              className="w-32"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Price & Links</h2>
          <div className="flex items-center space-x-2">
            <span className="text-lg">Price: </span>
            <span className="text-lg font-bold">{blinkData.price} SOL</span>
            <span className="text-lg">({(blinkData.price * solPrice).toFixed(2)} USD)</span>
          </div>

          {/* Links Section */}
          <div>
            {blinkData.links.map((link, index) => (
              <div key={index} className="flex items-center space-x-2">
                <FaLink />
                <Input
                  value={link}
                  onChange={(e) => handleLinkChange(index, e.target.value)}
                  placeholder="Enter link"
                />
              </div>
            ))}
            <Button onClick={handleLinkAdd} variant="outline" className="mt-2">
              Add Link
            </Button>
          </div>

          <div className="flex items-center space-x-4">
            <WalletButton />
            <Button onClick={handleCreateBlink} disabled={isProcessing}>
              {isProcessing ? 'Processing...' : 'Create Blink'}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
