import { Blink, blinkSchema } from "@/lib/types/blink"
import { nanoid } from "nanoid"
import { supabase } from "@/lib/supabase-client"

export async function createBlink(data: Partial<Blink>): Promise<Blink> {
  try {
    // Parse and validate the Blink data using the schema
    const blink: Blink = blinkSchema.parse({
      ...data,
      id: nanoid(), // Generate a unique ID
      createdAt: new Date(), // Set the creation date
      updatedAt: new Date(), // Set the updated date
    })

    // Insert the Blink data into the Supabase database
    const { data: insertedBlink, error } = await supabase
      .from("blinks")
      .insert([blink])
      .single()

    if (error) {
      throw new Error(`Supabase Error: ${error.message}`)
    }

    // Return the newly created Blink object
    return insertedBlink
  } catch (error) {
    console.error("Error creating blink:", error)
    // Add specific error details to improve debugging
    if (error instanceof Error) {
      throw new Error(`Failed to create blink: ${error.message}`)
    }
    throw new Error("Unexpected error occurred while creating blink")
  }
}
