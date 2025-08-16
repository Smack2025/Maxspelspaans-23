import { neon } from "@neondatabase/serverless"
import type { Word, UserProgress } from "@/lib/types"

// Initialize Neon SQL client with fallback environment variables
const getDatabaseUrl = () => {
  const url =
    process.env.DATABASE_URL ||
    process.env.DATABASE_URL_UNPOOLED ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_URL_NON_POOLING

  if (!url) {
    console.error("No database URL found in environment variables:", {
      DATABASE_URL: !!process.env.DATABASE_URL,
      DATABASE_URL_UNPOOLED: !!process.env.DATABASE_URL_UNPOOLED,
      POSTGRES_URL: !!process.env.POSTGRES_URL,
      POSTGRES_URL_NON_POOLING: !!process.env.POSTGRES_URL_NON_POOLING,
    })
    throw new Error("No database connection string found. Please check your environment variables.")
  }

  return url
}

const getSqlClient = () => {
  return neon(getDatabaseUrl())
}

// Get words for the game, optionally filtered by difficulty
export async function getWords(difficultyLevel?: number): Promise<Word[]> {
  try {
    const sql = getSqlClient()
    let data

    if (difficultyLevel) {
      data = await sql`SELECT * FROM words WHERE difficulty_level = ${difficultyLevel} ORDER BY difficulty_level ASC`
    } else {
      data = await sql`SELECT * FROM words ORDER BY difficulty_level ASC`
    }

    return data as Word[]
  } catch (error) {
    console.error("Error fetching words:", error)
    return []
  }
}

// Get user progress for specific words
export async function getUserProgress(userId: string, wordIds: number[]): Promise<UserProgress[]> {
  try {
    const sql = getSqlClient()
    // For IN clause with array, we need to use ANY() with array syntax
    const data = await sql`SELECT * FROM user_progress WHERE user_id = ${userId} AND word_id = ANY(${wordIds})`
    return data as UserProgress[]
  } catch (error) {
    console.error("Error fetching user progress:", error)
    return []
  }
}

// Update user progress for a word
export async function updateUserProgress(userId: string, wordId: number, isCorrect: boolean): Promise<void> {
  try {
    const sql = getSqlClient()
    // First, try to get existing progress
    const existingProgress = await sql`SELECT * FROM user_progress WHERE user_id = ${userId} AND word_id = ${wordId}`

    if (existingProgress.length > 0) {
      // Update existing progress
      const progress = existingProgress[0] as UserProgress
      const correctAttempts = isCorrect ? progress.correct_attempts + 1 : progress.correct_attempts
      const incorrectAttempts = !isCorrect ? progress.incorrect_attempts + 1 : progress.incorrect_attempts

      // Calculate mastery level based on performance
      const totalAttempts = correctAttempts + incorrectAttempts
      const successRate = correctAttempts / totalAttempts
      let masteryLevel = 0

      if (totalAttempts >= 3) {
        if (successRate >= 0.8)
          masteryLevel = 2 // Mastered
        else if (successRate >= 0.5) masteryLevel = 1 // Learning
      }

      await sql`UPDATE user_progress 
                SET correct_attempts = ${correctAttempts}, incorrect_attempts = ${incorrectAttempts}, 
                    mastery_level = ${masteryLevel}, last_attempted = NOW()
                WHERE user_id = ${userId} AND word_id = ${wordId}`
    } else {
      // Create new progress record
      const correctAttempts = isCorrect ? 1 : 0
      const incorrectAttempts = isCorrect ? 0 : 1

      await sql`INSERT INTO user_progress (user_id, word_id, correct_attempts, incorrect_attempts, mastery_level, last_attempted)
                VALUES (${userId}, ${wordId}, ${correctAttempts}, ${incorrectAttempts}, 0, NOW())`
    }
  } catch (error) {
    console.error("Error updating user progress:", error)
  }
}

// Save a completed game session
export async function saveGameSession(
  userId: string,
  score: number,
  totalQuestions: number,
  correctAnswers: number,
  sessionDuration: number,
): Promise<void> {
  try {
    const sql = getSqlClient()
    await sql`INSERT INTO game_sessions (user_id, score, total_questions, correct_answers, session_duration)
              VALUES (${userId}, ${score}, ${totalQuestions}, ${correctAnswers}, ${sessionDuration})`
  } catch (error) {
    console.error("Error saving game session:", error)
  }
}

// Get user statistics
export async function getUserStats(userId: string) {
  try {
    const sql = getSqlClient()
    // Get total progress stats
    const progressStats = await sql`SELECT mastery_level, correct_attempts, incorrect_attempts 
                                   FROM user_progress WHERE user_id = ${userId}`

    // Get recent game sessions
    const recentSessions = await sql`SELECT * FROM game_sessions 
                                    WHERE user_id = ${userId} 
                                    ORDER BY completed_at DESC LIMIT 10`

    const totalWords = progressStats?.length || 0
    const masteredWords = progressStats?.filter((p: any) => p.mastery_level === 2).length || 0
    const learningWords = progressStats?.filter((p: any) => p.mastery_level === 1).length || 0
    const totalCorrect = progressStats?.reduce((sum: number, p: any) => sum + p.correct_attempts, 0) || 0
    const totalIncorrect = progressStats?.reduce((sum: number, p: any) => sum + p.incorrect_attempts, 0) || 0
    const totalAttempts = totalCorrect + totalIncorrect
    const accuracy = totalAttempts > 0 ? (totalCorrect / totalAttempts) * 100 : 0

    return {
      totalWords,
      masteredWords,
      learningWords,
      accuracy: Math.round(accuracy),
      recentSessions: recentSessions || [],
    }
  } catch (error) {
    console.error("Error fetching user stats:", error)
    return {
      totalWords: 0,
      masteredWords: 0,
      learningWords: 0,
      accuracy: 0,
      recentSessions: [],
    }
  }
}
