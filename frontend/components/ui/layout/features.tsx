'use client'

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Zap, Link, CreditCard, UserCheck, BarChart3, Shield } from 'lucide-react'

const features = [
  {
    title: "Instant Payments",
    description: "Process Solana-based transactions instantly.",
    icon: Zap,
  },
  {
    title: "Custom Links",
    description: "Create unique, branded payment links for Discord.",
    icon: Link,
  },
  {
    title: "Flexible Subscriptions",
    description: "Manage tiers for varying access and benefits.",
    icon: CreditCard,
  },
  {
    title: "Auto Role Assignment",
    description: "Assign Discord roles based on subscription status.",
    icon: UserCheck,
  },
  {
    title: "Analytics Dashboard",
    description: "Gain insights into growth and engagement.",
    icon: BarChart3,
  },
  {
    title: "Secure Transactions",
    description: "Robust measures ensure safe payments.",
    icon: Shield,
  },
]

export function Features() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Main Title */}
        <h2 className="text-4xl font-extrabold mb-6 text-center text-black dark:text-white">
          Features That Empower
        </h2>

        {/* Main Description */}
        <p className="text-lg text-muted-foreground dark:text-gray-400 text-center mb-12">
          Elevate your community experience with our cutting-edge tools.
        </p>

        {/* Features Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className={cn(
                "transition-transform duration-300 cursor-pointer",
                hoveredIndex === index ? "shadow-2xl scale-105" : "shadow-md",
                "bg-white dark:bg-neutral-900",
                "text-black dark:text-white",
                "border border-gray-200 dark:border-gray-700",
                "p-6 rounded-xl"
              )}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <CardHeader className="flex items-center space-x-4">
                {/* Icon */}
                <feature.icon className="w-12 h-12 text-[#DBCFC7]" />
                <CardTitle className="text-lg font-medium">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mt-2 text-sm text-muted-foreground dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
