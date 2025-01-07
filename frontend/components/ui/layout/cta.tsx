'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section
      className="relative bg-cover bg-center py-16"
      style={{
        backgroundImage: 'url(https://ucarecdn.com/e2dcb7c0-d1ba-4109-a4f2-49935a83b682/freepikexport20241005075839m1yB.jpeg)',
      }}
    >
      {/* Black overlay with transparency */}
      <div className="absolute inset-0 bg-black opacity-90"></div>

      <div className="container mx-auto text-center relative z-10">
        <h2 className="text-3xl font-bold mb-4 text-primary-foreground">
          Ready to Empower Your Community?
        </h2>
        <p className="text-xl mb-8 text-primary-foreground/80">
          Start using BlinkShare today and revolutionize your Discord server's engagement.
        </p>
        <Button size="lg" variant="secondary">
          <Link href="/create-blink">
            Create Your Blink Now
          </Link>
        </Button>
      </div>
    </section>
  );
}
