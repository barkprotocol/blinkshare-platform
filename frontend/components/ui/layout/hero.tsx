import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-gray-950 overflow-hidden">
      <Image
        src="https://ucarecdn.com/f6029e68-9768-49db-80a9-64e41e70acff/waveblack.png"
        alt="Abstract wave background"
        fill
        sizes="100vw"
        quality={85}
        priority
        className="object-cover object-center"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-black/60" aria-hidden="true"></div>
      <div className="relative z-10 container mx-auto px-4 py-16 text-center text-white">
        <h2 className="text-sm sm:text-base md:text-lg font-medium mb-4 bg-gradient-to-r from-white to-gray-50 text-transparent bg-clip-text">
          Empower Your Discord Community With
        </h2>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 drop-shadow-lg">
          <span className="font-bold">Blink</span>
          <span className="font-medium">Share</span> Platform
        </h1>
        <p className="text-lg sm:text-xl md:text-1xl mb-10 max-w-3xl mx-auto drop-shadow">
          Unlock the full potential of your Discord community by integrating Solana-based transactions into your Blink platform.
          With our streamlined blockchain integration, you can effortlessly share, engage, and grow your community.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button asChild size="lg" className="shadow-lg hover:shadow-xl transition-shadow bg-white hover:bg-white text-black">
            <Link href="https://discord.com/oauth2/authorize?client_id=1324299574336290866" aria-label="Get started with Blink platform">
              Get Started
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="shadow-lg hover:shadow-xl transition-shadow bg-white/10 hover:bg-white/20">
            <Link href="https://docs.blinkshare.fun" aria-label="View Blink Share documentation">
              Documentation
            </Link>
          </Button>
        </div>
        <div className="mt-16 flex flex-col items-center">
          <p className="text-white/60 text-sm mb-4">Powered by</p>
          <div className="flex items-center justify-center space-x-8">
            <Image
              src="https://ucarecdn.com/7b3b0c2e-f49e-4c5c-bfdc-e81df44273cc/solanaLogo.png"
              alt="Solana Logo"
              width={100}
              height={35}
              className="opacity-75 hover:opacity-90 transition-opacity"
            />
            <Image
              src="https://ucarecdn.com/e8a3c826-ba34-4f92-a55c-5700933adcb1/Privy_Brandmark_White.png"
              alt="Privy Logo"
              width={80}
              height={24}
              className="opacity-75 hover:opacity-90 transition-opacity"
            />
            <Image
              src="https://ucarecdn.com/5b42a7f6-1d4f-494b-96e4-4fe5b8b1fa3c/dialectwhitelogomark.png"
              alt="Dialect Logo"
              width={100}
              height={24}
              className="opacity-75 hover:opacity-90 transition-opacity"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
