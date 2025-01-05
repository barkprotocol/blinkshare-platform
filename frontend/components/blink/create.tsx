'use client'

import { useState } from "react"
import { motion } from "framer-motion"
import { BlinkCard } from "@/components/blink/blink-card"
import { useBlinkGenerator } from "@/hooks/use-blink-generator"
import { BlinkTemplate, BlinkType } from "@/lib/types/blink"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { StylePreset } from "@/app/styles/style-preset.css"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const blinkTemplates: BlinkTemplate[] = [
  {
    type: "payment",
    title: "Payment Link",
    description: "Create a simple payment link for one-time transactions",
    icon: "/icons/payment.svg",
  },
  {
    type: "donation",
    title: "Donation Page",
    description: "Set up a donation page for your cause or project",
    icon: "/icons/donation.svg",
  },
  {
    type: "gift",
    title: "Gift Card",
    description: "Create a digital gift card with a personal message",
    icon: "/icons/gift.svg",
  },
  {
    type: "nft",
    title: "NFT Purchase",
    description: "Sell your NFTs with a simple payment link",
    icon: "/icons/nft.svg",
  },
  {
    type: "subscription",
    title: "Subscription",
    description: "Create a recurring payment link for subscriptions",
    icon: "/icons/subscription.svg",
  },
]

export default function CreateBlink() {
  const { isLoading, selectedType, setSelectedType, generateBlink } = useBlinkGenerator()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    amount: "",
    currency: "SOL",
    memo: "",
  })
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Ensure amount is parsed as a number
    const parsedAmount = parseFloat(formData.amount)

    // If parsing fails, do not proceed with form submission
    if (isNaN(parsedAmount)) {
      setError("Please enter a valid amount.")
      return
    }

    // Clear error if there was one
    setError(null)

    try {
      // Proceed with blink creation
      await generateBlink({
        ...formData,
        amount: parsedAmount,
      })
    } catch (err) {
      setError("An error occurred while creating the Blink. Please try again.")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-8">Create a Blink</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {blinkTemplates.map((template) => (
            <BlinkCard
              key={template.type}
              {...template}
              isSelected={selectedType === template.type}
              onClick={() => setSelectedType(template.type)}
            />
          ))}
        </div>

        {selectedType && (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
            onSubmit={handleSubmit}
          >
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter a title for your blink"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your blink"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.000001"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => setFormData({ ...formData, currency: value })}
                  >
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SOL">SOL</SelectItem>
                      <SelectItem value="USDC">USDC</SelectItem>
                      <SelectItem value="BARK">BARK</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Conditionally render memo for specific Blink types */}
              {selectedType !== "gift" && selectedType !== "nft" && (
                <div>
                  <Label htmlFor="memo">Memo (Optional)</Label>
                  <Input
                    id="memo"
                    value={formData.memo}
                    onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
                    placeholder="Add a memo to your transaction"
                  />
                </div>
              )}
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Creating..." : "Create Blink"}
            </Button>
          </motion.form>
        )}
      </motion.div>
    </div>
  )
}
