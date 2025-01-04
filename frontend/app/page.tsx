import Hero from "@/components/ui/layout/hero";
import { Features } from "@/components/ui/layout/features";
import HowItWorks from "@/components/ui/layout/how-it-works";
import { CTA } from "@/components/ui/layout/cta";
import { FAQ } from "@/components/ui/layout/faq";

export default function Home() {
  return (
    <main className="flex flex-col space-y-16">
      <section
        aria-label="Hero Section"
        className="py-16 sm:py-24 flex items-center justify-center"
      >
        <Hero />
      </section>

      <section
        aria-label="Features Section"
        className="bg-muted py-16 sm:py-24"
      >
        <Features />
      </section>

      <section
        aria-label="How It Works Section"
        className="py-16 sm:py-24"
      >
        <HowItWorks />
      </section>

      <section
        aria-label="BlinkShare BOT Section"
        className="bg-muted py-16 sm:py-24"
      >
        <CTA />
      </section>

      <section
        aria-label="Frequently Asked Questions Section"
        className="py-16 sm:py-24"
      >
        <FAQ />
      </section>
    </main>
  );
}
