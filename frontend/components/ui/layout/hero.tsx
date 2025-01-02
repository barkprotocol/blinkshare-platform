import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-black overflow-hidden">
      <Image
        src="https://ucarecdn.com/8f30b618-6bcd-4db2-8171-bb8bc2e947cd/blackgoldcoinsbg.jpeg"
        alt="Golden Coins Background"
        fill
        sizes="100vw"
        quality={85}
        priority
        className="object-cover object-center"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-black/60" aria-hidden="true"></div>
      <div className="relative z-10 container mx-auto px-4 py-12 text-center text-white">
        <h2 className="text-sm sm:text-base md:text-lg font-semibold mb-4 bg-gradient-to-r from-sand-300 to-sand-400 text-transparent bg-clip-text">
          Blockchain Made Seamless
        </h2>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 drop-shadow-2xl">
          Welcome to BlinkShare
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl mb-10 max-w-2xl mx-auto drop-shadow-lg">
          Empower your Discord communities with seamless Solana-based transactions. Create, share, engage, and grow with blockchain integration.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button 
            asChild 
            size="lg" 
            className="shadow-lg hover:shadow-2xl transition-shadow bg-primary text-white hover:bg-primary/90 border-1 border-transparent hover:border-white/30 px-6 py-3 text-md"
          >
            <Link href="/get-started">Get Started</Link>
          </Button>
          <Button 
            asChild 
            variant="outline" 
            size="lg" 
            className="shadow-lg hover:shadow-2xl transition-shadow border-1 border-white text-black hover:bg-white/20 px-6 py-3 text-md"
          >
            <Link href="https://docs.blinkshare.fun">Documents</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
