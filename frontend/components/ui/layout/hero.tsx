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
      />
      <div className="absolute inset-0 bg-black bg-opacity-60" aria-hidden="true"></div>
      <div className="relative z-10 container mx-auto px-4 py-12 text-center text-white">
        <h2 className="text-sm sm:text-base md:text-lg font-semibold mb-4 bg-gradient-to-r from-[#d0c8b9] to-[#c5bdae] text-transparent bg-clip-text">
          Blockchain Made Seamless
        </h2>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-shadow-lg">
          Welcome to BlinkShare
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-shadow">
          Empower your Discord communities with seamless Solana-based transactions. Share, engage, and grow with blockchain integration.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button asChild size="lg" className="shadow-lg hover:shadow-xl transition-shadow bg-[#d0c8b9] hover:bg-[#c5bdae] text-gray-900">
            <Link href="/create-blink">Create a Blink</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="shadow-lg hover:shadow-xl transition-shadow bg-white bg-opacity-20 hover:bg-opacity-30">
            <Link href="/learn-more">Learn More</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
