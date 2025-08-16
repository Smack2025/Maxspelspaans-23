import { type NextRequest, NextResponse } from "next/server"
import { saveGameSession } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { score, totalQuestions, correctAnswers, sessionDuration, userId = "guest" } = await request.json()

    if (
      typeof score !== "number" ||
      typeof totalQuestions !== "number" ||
      typeof correctAnswers !== "number" ||
      typeof sessionDuration !== "number"
    ) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 })
    }

    await saveGameSession(userId, score, totalQuestions, correctAnswers, sessionDuration)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving game session:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
