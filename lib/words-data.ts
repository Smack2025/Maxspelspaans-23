export interface Word {
  id: number
  spanish_word: string
  dutch_translation: string
  image_url: string
  difficulty_level: number
}

export const SPANISH_WORDS: Word[] = [
  { id: 1, spanish_word: "gato", dutch_translation: "kat", image_url: "/cute-orange-cat.png", difficulty_level: 1 },
  {
    id: 2,
    spanish_word: "perro",
    dutch_translation: "hond",
    image_url: "/friendly-golden-retriever.png",
    difficulty_level: 1,
  },
  {
    id: 3,
    spanish_word: "casa",
    dutch_translation: "huis",
    image_url: "/cozy-red-roof-house.png",
    difficulty_level: 1,
  },
  {
    id: 4,
    spanish_word: "agua",
    dutch_translation: "water",
    image_url: "/glass-of-water.png",
    difficulty_level: 1,
  },
  {
    id: 5,
    spanish_word: "comida",
    dutch_translation: "eten",
    image_url: "/delicious-meal.png",
    difficulty_level: 1,
  },
  {
    id: 6,
    spanish_word: "libro",
    dutch_translation: "boek",
    image_url: "/open-book.png",
    difficulty_level: 2,
  },
  {
    id: 7,
    spanish_word: "escuela",
    dutch_translation: "school",
    image_url: "/traditional-schoolhouse.png",
    difficulty_level: 2,
  },
  {
    id: 8,
    spanish_word: "familia",
    dutch_translation: "familie",
    image_url: "/happy-family.png",
    difficulty_level: 2,
  },
  {
    id: 9,
    spanish_word: "trabajo",
    dutch_translation: "werk",
    image_url: "/modern-office-workspace.png",
    difficulty_level: 2,
  },
  {
    id: 10,
    spanish_word: "tiempo",
    dutch_translation: "tijd",
    image_url: "/analog-clock.png",
    difficulty_level: 2,
  },
  {
    id: 11,
    spanish_word: "ciudad",
    dutch_translation: "stad",
    image_url: "/vibrant-city-skyline.png",
    difficulty_level: 3,
  },
  {
    id: 12,
    spanish_word: "montaña",
    dutch_translation: "berg",
    image_url: "/majestic-mountain-vista.png",
    difficulty_level: 3,
  },
  {
    id: 13,
    spanish_word: "océano",
    dutch_translation: "oceaan",
    image_url: "/ocean-waves.png",
    difficulty_level: 3,
  },
  {
    id: 14,
    spanish_word: "universidad",
    dutch_translation: "universiteit",
    image_url: "/bustling-university-campus.png",
    difficulty_level: 3,
  },
  {
    id: 15,
    spanish_word: "tecnología",
    dutch_translation: "technologie",
    image_url: "/modern-technology.png",
    difficulty_level: 3,
  },
  {
    id: 16,
    spanish_word: "restaurante",
    dutch_translation: "restaurant",
    image_url: "/elegant-restaurant.png",
    difficulty_level: 4,
  },
  {
    id: 17,
    spanish_word: "medicina",
    dutch_translation: "geneeskunde",
    image_url: "/diverse-medical-equipment.png",
    difficulty_level: 4,
  },
  {
    id: 18,
    spanish_word: "arquitectura",
    dutch_translation: "architectuur",
    image_url: "/abstract-architectural-design.png",
    difficulty_level: 4,
  },
  {
    id: 19,
    spanish_word: "filosofía",
    dutch_translation: "filosofie",
    image_url: "/philosophical-thinking.png",
    difficulty_level: 5,
  },
  {
    id: 20,
    spanish_word: "extraordinario",
    dutch_translation: "buitengewoon",
    image_url: "/extraordinary-moment.png",
    difficulty_level: 5,
  },
]

export function getWordsByDifficulty(difficultyLevel?: number): Word[] {
  if (!difficultyLevel) {
    return SPANISH_WORDS
  }
  return SPANISH_WORDS.filter((word) => word.difficulty_level === difficultyLevel)
}
