import Link from 'next/link'
import { Button } from "@/components/ui/button"

export function CTA() {
  return (
    <section className="bg-primary py-16">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4 text-primary-foreground">
          Ready to Empower Your Community?
        </h2>
        <p className="text-xl mb-8 text-primary-foreground/80">
          Start using BlinkShare today and revolutionize your Discord server's engagement.
        </p>
        <Button asChild size="lg" variant="secondary">
          <Link href="/create-blink">
            Create Your Blink Now
          </Link>
        </Button>
      </div>
    </section>
  )
}
