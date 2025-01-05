"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BlinkTemplate } from "@/lib/types/blink"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface BlinkCardProps extends BlinkTemplate {
  onClick: () => void
  isSelected?: boolean
}

export function BlinkCard({ type, title, description, icon, onClick, isSelected }: BlinkCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <Card className={cn(
        "cursor-pointer transition-colors",
        isSelected ? "border-primary bg-primary/5" : "hover:border-primary/50"
      )}>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-primary/10 p-2">
              <Image
                src={icon}
                alt={title}
                width={24}
                height={24}
                className="h-6 w-6"
              />
            </div>
            <div>
              <CardTitle>{title}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {type}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

