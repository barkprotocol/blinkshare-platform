import { NextResponse } from "next/server";
import { z } from "zod";
import { generateBlink } from "@/lib/blink/generate-blink";

const BlinkSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    amount: z.number().min(0, "Amount must be a positive number"),
    currency: z.enum(["SOL", "USDC", "BARK"], {
      errorMap: () => ({ message: "Invalid currency, must be SOL, USDC, or BARK" }),
    }),
    memo: z.string().optional(),
  });
  
export async function POST(req: Request) {
  try {
    // Parse request body as JSON
    const body = await req.json();

    // Validate the body against the Zod schema
    const validatedData = BlinkSchema.parse(body);

    // Call the function to generate the Blink
    const blink = await generateBlink(validatedData);

    // Return success response
    return NextResponse.json(
      { message: "Blink created successfully", blink },
      { status: 201 }
    );
  } catch (error) {
    // Handle validation or other errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors.map((e) => e.message) },
        { status: 400 }
      );
    }

    // Log error (optional)
    console.error(error);

    // Return generic error response
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
