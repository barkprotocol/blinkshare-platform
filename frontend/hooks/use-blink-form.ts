import { useState } from "react"
import { Blink, BlinkType } from "@/lib/types/blink"

interface BlinkFormData {
  title: string
  description: string
  amount: number
  currency: "SOL" | "USDC" | "BARK"
  memo: string
}

export function useBlinkForm(type: BlinkType) {
  const [formData, setFormData] = useState<BlinkFormData>({
    title: "",
    description: "",
    amount: 0,
    currency: "SOL", // Default currency is SOL
    memo: "",
  })

  // Update individual fields in the form
  const updateField = (field: keyof BlinkFormData, value: string) => {
    if (field === "amount") {
      // Parse the amount field as a number
      setFormData((prev) => ({
        ...prev,
        [field]: parseFloat(value),
      }))
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }
  }

  // Reset form data to initial values
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      amount: 0,
      currency: "SOL", // Default currency
      memo: "",
    })
  }

  // Form validation: Ensure all fields are filled and the amount is greater than 0
  const validateForm = (): boolean => {
    return (
      formData.title &&
      formData.description &&
      formData.amount > 0
    )
  }

  return {
    formData,
    updateField,
    resetForm,
    validateForm,
  }
}
