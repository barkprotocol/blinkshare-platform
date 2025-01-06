'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "What is BlinkShare?",
    answer: "BlinkShare is a platform that enables Discord server owners to create custom payment links for their communities, facilitating easy subscription management and access control."
  },
  {
    question: "How does BlinkShare work with Discord?",
    answer: "BlinkShare integrates with Discord to automatically assign roles based on subscription status. When a member pays through your custom link, they're granted the appropriate role and access to exclusive content."
  },
  {
    question: "Is BlinkShare secure?",
    answer: "Yes, BlinkShare prioritizes security. We use industry-standard encryption and don't store sensitive payment information. Transactions are processed securely through the Solana blockchain."
  },
  {
    question: "Can I customize my subscription tiers?",
    answer: "You can create multiple subscription tiers with different prices, durations, and associated Discord roles to suit your community's needs."
  },
  {
    question: "How do I get started with BlinkShare?",
    answer: "Getting started is easy! Just click on the 'Create a Blink' button, connect your Discord server, set up your subscription tiers, and share your custom link with your community."
  }
];

export function FAQ() {
  return (
    <section className="py-16 bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center text-black dark:text-white">
          Frequently Asked Questions
        </h2>
        <Accordion
          type="single"
          collapsible
          className="w-full max-w-4xl mx-auto space-y-6"
        >
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={item.question}>
              <AccordionTrigger
                className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 rounded-lg shadow-sm hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 transition-all duration-300"
                aria-expanded="false"
                aria-label={`Toggle answer for "${item.question}"`}
              >
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="bg-gray-100 dark:bg-gray-700 text-black dark:text-white p-4 rounded-lg shadow-sm transition-all duration-300">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
