import { type NextRequest, NextResponse } from "next/server"
import { updateUserProgress } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { wordId, isCorrect, userId = "guest" } = await request.json()

    if (!wordId || typeof isCorrect !== "boolean") {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 })
    }

    await updateUserProgress(userId, wordId, isCorrect)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating progress:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
