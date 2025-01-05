import { useState } from "react"
import { Blink, BlinkType } from "@/lib/types/blink"
import { useWallet } from "@solana/wallet-adapter-react"
import { createBlink } from "@/lib/actions/create-a-blink"
import { toast } from "sonner"

export function useBlinkGenerator() {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedType, setSelectedType] = useState<BlinkType | null>(null)
  const wallet = useWallet()

  const generateBlink = async (data: Partial<Blink>) => {
    if (!wallet.connected) {
      toast.error("Please connect your wallet first")
      return null
    }

    if (!selectedType) {
      toast.error("Please select a blink type")
      return null
    }

    setIsLoading(true)
    try {
      // Validate fields (if needed)
      if (!data.recipientAddress) {
        toast.error("Recipient address is required")
        return null
      }

      const blink = await createBlink({
        ...data,
        recipientAddress: wallet.publicKey?.toString() || "",
        type: selectedType || "payment",
      })
      toast.success("Blink created successfully!")
      return blink
    } catch (error) {
      console.error("Error creating blink:", error)
      toast.error("Failed to create blink. Please try again.")
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    selectedType,
    setSelectedType,
    generateBlink,
  }
}
