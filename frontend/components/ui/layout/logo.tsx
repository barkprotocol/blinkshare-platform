import Image from 'next/image'
import Link from 'next/link'

export function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2" aria-label="Go to homepage">
      <Image
        src="https://ucarecdn.com/bbc74eca-8e0d-4147-8a66-6589a55ae8d0/bark.webp"
        alt="BARK - BlinkShare Logo"
        width={40}
        height={40}
        layout="intrinsic"
      />
      <span className="text-xl text-foreground/80">
        <span className="font-bold text-primary">Blink</span>
        <span className="font-light text-primary/80">Share</span>
      </span>
    </Link>
  )
}
