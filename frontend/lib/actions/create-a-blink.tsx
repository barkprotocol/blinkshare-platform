import { Blink, blinkSchema } from "@/lib/types/blink"
import { nanoid } from "nanoid"
import { supabase } from "@/lib/supabase-client"

export async function createBlink(data: Partial<Blink>): Promise<Blink> {
  try {
    // Parse and validate the Blink data using the schema
    const blink = blinkSchema.parse({
      ...data,
      id: nanoid(), // Generate a unique ID
      createdAt: new Date(), // Set the creation date
      updatedAt: new Date(), // Set the updated date
    })

    // Insert the Blink data into the Supabase database
    const { data: insertedBlink, error } = await supabase
      .from("blinks") // Replace "blinks" with your actual table name
      .insert([blink])
      .single()

    if (error) {
      throw new Error(error.message)
    }

    // Return the newly created Blink object
    return insertedBlink
  } catch (error) {
    console.error("Error creating blink:", error)
    throw new Error("Failed to create blink")
  }
}
