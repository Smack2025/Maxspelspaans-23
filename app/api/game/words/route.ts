import { type NextRequest, NextResponse } from "next/server"
import { getWords } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const difficulty = searchParams.get("difficulty")
    const difficultyLevel = difficulty ? Number.parseInt(difficulty) : undefined

    const words = await getWords(difficultyLevel)

    if (words.length === 0) {
      return NextResponse.json({ error: "No words found" }, { status: 404 })
    }

    const gameWords = words.map((word) => {
      // Get other words for options from all words
      const otherWords = words.filter((w) => w.id !== word.id).slice(0, 3) // Get 3 other complete word objects

      const correctOption = {
        text: word.dutch_translation,
        image: word.image_url || "/placeholder.svg?height=48&width=48",
      }

      const incorrectOptions = otherWords.map((w) => ({
        text: w.dutch_translation,
        image:
          w.image_url ||
          `/placeholder.svg?height=48&width=48&query=${encodeURIComponent(`illustration of ${w.dutch_translation} in Dutch`)}`,
      }))

      const allOptions = [correctOption, ...incorrectOptions].sort(() => Math.random() - 0.5) // Shuffle options

      return {
        id: word.id,
        spanish: word.spanish_word,
        dutch: word.dutch_translation,
        image: word.image_url || "/placeholder.svg?height=200&width=200",
        options: allOptions, // Now includes both text and image for each option
        difficulty: word.difficulty_level,
        progress: null, // No user progress tracking without auth
      }
    })

    return NextResponse.json({ words: gameWords })
  } catch (error) {
    console.error("Error fetching words:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
