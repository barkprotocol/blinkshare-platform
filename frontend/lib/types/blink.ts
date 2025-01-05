import { z } from "zod"

export const blinkTypeSchema = z.enum([
  "payment",
  "donation",
  "gift",
  "nft",
  "subscription"
])

export type BlinkType = z.infer<typeof blinkTypeSchema>

export const blinkSchema = z.object({
  id: z.string().optional(),
  type: blinkTypeSchema,
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  amount: z.number().min(0),
  currency: z.enum(["SOL", "USDC","BARK"]),
  recipientAddress: z.string(),
  memo: z.string().optional(),
  expiresAt: z.date().optional(),
  imageUrl: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export type Blink = z.infer<typeof blinkSchema>

export interface BlinkTemplate {
  type: BlinkType
  title: string
  description: string
  icon: string
}

