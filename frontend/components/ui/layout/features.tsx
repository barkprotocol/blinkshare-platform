'use client'

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Zap, Link, CreditCard, UserCheck, BarChart3, Shield } from 'lucide-react'

const features = [
  {
    title: "Instant Payments",
    description: "Process Solana-based transactions instantly, providing a seamless experience for your community members.",
    icon: Zap,
  },
  {
    title: "Custom Links",
    description: "Create unique, branded payment links for your Discord server to streamline the subscription process.",
    icon: Link,
  },
  {
    title: "Flexible Subscriptions",
    description: "Set up and manage various subscription tiers to cater to different levels of access and benefits.",
    icon: CreditCard,
  },
  {
    title: "Automatic Role Assignment",
    description: "Automatically assign Discord roles based on subscription status, saving you time and effort.",
    icon: UserCheck,
  },
  {
    title: "Analytics Dashboard",
    description: "Gain insights into your community's growth and engagement with our comprehensive analytics tools.",
    icon: BarChart3,
  },
  {
    title: "Secure Transactions",
    description: "Enjoy peace of mind with our robust security measures ensuring safe and reliable transactions.",
    icon: Shield,
  },
]

export function Features() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Main Title */}
        <h2 className="text-4xl font-extrabold mb-4 text-center text-black dark:text-white">
          Our Powerful Features
        </h2>

        {/* Main Description */}
        <p className="text-lg text-muted-foreground dark:text-gray-300 text-center mb-10">
          Unlock the full potential of your community with our robust set of features designed to enhance user experience, streamline processes, and provide insightful analytics.
        </p>

        {/* Features Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className={cn(
                "transition-all duration-300 cursor-pointer",
                hoveredIndex === index ? "shadow-2xl scale-105" : "shadow-lg",
                "bg-white dark:bg-black",
                "text-black dark:text-white",
                "border border-gray-200 dark:border-gray-800",
                "p-6 rounded-lg"
              )}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <CardHeader className="flex items-center space-x-4">
                {/* Icon with #DBCFC7 color */}
                <feature.icon className="w-10 h-10 text-[#DBCFC7]" />
                <CardTitle className="text-lg font-semibold text-black dark:text-white">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-muted-foreground dark:text-gray-300 leading-relaxed mt-4">
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
