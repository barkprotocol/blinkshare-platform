import { createBlink } from "@/app/servers/create/create-a-blink"
import { database } from "@/lib/database"

// Creating a new Blink
const newBlink = await createBlink({
  title: "Sample Blink",
  description: "This is a sample Blink.",
  iconUrl: "http://example.com/icon.png",
  stylePreset: "default",
  serverId: "server1",
  code: "12345",
  fields: ["field1", "field2"],
})

// Saving the new Blink
await database.save("blinks", newBlink)

// Retrieving all Blinks
const allBlinks = await database.get("blinks")
console.log("All Blinks:", allBlinks)

// Retrieving a Blink by ID (assuming the ID is known)
const blinkById = await database.getById("blinks", newBlink.id)
console.log("Blink by ID:", blinkById)

// Reset the database (for testing or clearing data)
await database.reset()
export { database }

