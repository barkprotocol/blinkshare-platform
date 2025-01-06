'use client'

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link, Share, CreditCard, UserCheck, RefreshCcw, BarChart } from "lucide-react";

const sections = [
  {
    title: "Create a Customized Blink",
    description:
      "Create a unique BlinkShare link for your Discord server and obtain a dedicated payment link that simplifies subscription management for your community.",
    icon: Link,
  },
  {
    title: "Share Your Custom Link",
    description:
      "Share your custom payment link with your community across any media channel, making it easy for members to join and access exclusive content.",
    icon: Share,
  },
  {
    title: "Simple Payment Flow",
    description:
      "Members open the link, authorize with Discord, select their desired subscription, and securely pay using their Solana wallet—all in just a few clicks.",
    icon: CreditCard,
  },
  {
    title: "Premium Role Assignment",
    description:
      "Upon successful payment, BlinkShare automatically assigns premium roles to members, granting them immediate access to exclusive content and features.",
    icon: UserCheck,
  },
  {
    title: "Subscription Management",
    description:
      "BlinkShare handles subscription payment reminders and renewals, letting you focus on engaging your community while we take care of the rest.",
    icon: RefreshCcw,
  },
  {
    title: "Analytics and Insights",
    description:
      "Gain valuable insights into your community's growth, engagement, and revenue through our comprehensive analytics dashboard.",
    icon: BarChart,
  },
];

export default function HowItWorks() {
  const [activeSection, setActiveSection] = useState<number>(0);

  return (
    <section className="py-16 bg-muted">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-4 text-center">How BlinkShare Works</h2>
        <p className="text-lg text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
          Learn how BlinkShare simplifies your community management, payments, and access control, all within Discord.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section, index) => (
            <Card
              key={index}
              className={cn(
                "transition-all duration-200 cursor-pointer p-4",
                activeSection === index
                  ? "shadow-2xl bg-white dark:bg-gray-800 ring-2 ring-[#DBCFC7]"
                  : "shadow-lg hover:shadow-2xl hover:bg-gray-50 dark:hover:bg-gray-900"
              )}
              onClick={() => setActiveSection(index)}
              aria-selected={activeSection === index}
            >
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <section.icon className="w-6 h-6 text-[#DBCFC7]" />
                  <CardTitle className="text-xl font-semibold text-black dark:text-white">
                    {section.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-base dark:text-gray-300">
                  {section.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
