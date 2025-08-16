export interface Word {
  id: number
  spanish_word: string
  dutch_translation: string
  image_url: string | null
  difficulty_level: number
  created_at: string
}

export interface UserProgress {
  id: number
  user_id: string
  word_id: number
  correct_attempts: number
  incorrect_attempts: number
  last_attempted: string
  mastery_level: number
  created_at: string
}

export interface GameSession {
  id: number
  user_id: string
  score: number
  total_questions: number
  correct_answers: number
  session_duration: number | null
  completed_at: string
}

export interface GameQuestion {
  word: Word
  options: string[]
  correctAnswer: string
}
