import { createBlink } from "../[serverId]/create/create-a-blink"
import database from "@/lib/database"

// Creating a new Blink
const newBlink = await createBlink({
  title: "Sample Blink",
  description: "This is a sample Blink.",
  iconUrl: "https://ucarecdn.com/69cf7fa0-0d1f-4e07-ad1e-946244f11adc/eyebg.png",
  stylePreset: "default",
  serverId: "server1",
  code: "12345",
  fields: ["field1", "field2"],
})

// Saving the new Blink to the database
await database.save("blinks", newBlink)

// Retrieving all Blinks
const allBlinks = await database.get("blinks")
console.log("All Blinks:", allBlinks)

// Retrieving a Blink by ID (assuming the ID is known)
const blinkById = await database.getById("blinks", newBlink.id)
console.log("Blink by ID:", blinkById)

// Reset the database (for testing or clearing data)
await database.reset()
