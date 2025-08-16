"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Settings, Volume2, VolumeX, Sparkles } from "lucide-react"
import { DifficultySelector } from "./difficulty-selector"
import { AchievementSystem } from "./achievement-system"
import { SoundManager } from "./sound-manager"
import { BrainrotCollection, getRandomCharacterToUnlock, BRAINROT_CHARACTERS } from "./italian-brainrot-characters"
import { getWordsByDifficulty } from "@/lib/words-data"

interface GameWord {
  id: number
  spanish: string
  dutch: string
  image: string
  options: Array<{
    text: string
    image: string
  }> // Updated to include image data for each option
  difficulty: number
  progress?: {
    correct: number
    incorrect: number
    mastery: number
  } | null
}

export function SpanishLearningGame() {
  const [gameMode, setGameMode] = useState<"welcome" | "select" | "playing" | "collection">("welcome") // Added welcome mode as initial state
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(null)
  const [words, setWords] = useState<GameWord[]>([])
  const [loading, setLoading] = useState(false)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)
  const [animationClass, setAnimationClass] = useState("")
  const [gameStartTime, setGameStartTime] = useState<number>(Date.now())
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [playCorrectSound, setPlayCorrectSound] = useState(false)
  const [playIncorrectSound, setPlayIncorrectSound] = useState(false)
  const [playCompleteSound, setPlayCompleteSound] = useState(false)

  const [unlockedCharacters, setUnlockedCharacters] = useState<string[]>([])
  const [newlyUnlockedCharacter, setNewlyUnlockedCharacter] = useState<string | null>(null)
  const [showCharacterUnlock, setShowCharacterUnlock] = useState(false)

  const [isSpeaking, setIsSpeaking] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("brainrot-collection")
    if (saved) {
      setUnlockedCharacters(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    if (unlockedCharacters.length > 0) {
      localStorage.setItem("brainrot-collection", JSON.stringify(unlockedCharacters))
    }
  }, [unlockedCharacters])

  useEffect(() => {
    setSpeechSupported("speechSynthesis" in window)
  }, [])

  useEffect(() => {
    if (speechSupported) {
      speakWelcomeMessage()

      // Multiple retry attempts to ensure audio plays
      const retryTimers = [
        setTimeout(() => speakWelcomeMessage(), 100),
        setTimeout(() => speakWelcomeMessage(), 500),
        setTimeout(() => speakWelcomeMessage(), 1000),
      ]

      return () => retryTimers.forEach((timer) => clearTimeout(timer))
    }
  }, [speechSupported]) // Removed gameMode dependency to play on component mount

  useEffect(() => {
    if (currentWord && speechSupported && gameMode === "playing" && !showResult) {
      // Auto-speak the word after a short delay
      const timer = setTimeout(() => {
        speakWord(currentWord.spanish)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [currentWordIndex, gameMode, showResult])

  const getImageForDutchWord = (dutchWord: string): string => {
    const imageMap: { [key: string]: string } = {
      kat: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kat-OKajeZKvQVHqw90gd8cYKw2El3iuJM.png",
      hond: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hond-QRPHbuD1RaWP8HO8gdMBHeTh8ihl1Q.png",
      huis: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/huis-ZQo007HXEtSoQJfzWnD0uPyVSy6I4r.png",
      water: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/water-wIm9Y6JmEHzRnbF7N35TCiK2gI0gR2.png",
      eten: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/eten-8qPb96sH78Yvbitdb9Hd5h29x4MJcH.png",
      boek: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/boek-OKajeZKvQVHqw90gd8cYKw2El3iuJM.png",
      auto: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/auto-QRPHbuD1RaWP8HO8gdMBHeTh8ihl1Q.png",
      zon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/zon-ZQo007HXEtSoQJfzWnD0uPyVSy6I4r.png",
      maan: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/maan-OKajeZKvQVHqw90gd8cYKw2El3iuJM.png",
      boom: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/boom-QRPHbuD1RaWP8HO8gdMBHeTh8ihl1Q.png",
      bloem: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bloem-ZQo007HXEtSoQJfzWnD0uPyVSy6I4r.png",
      tafel: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tafel-OKajeZKvQVHqw90gd8cYKw2El3iuJM.png",
      stoel: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/stoel-QRPHbuD1RaWP8HO8gdMBHeTh8ihl1Q.png",
      raam: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/raam-ZQo007HXEtSoQJfzWnD0uPyVSy6I4r.png",
      deur: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/deur-OKajeZKvQVHqw90gd8cYKw2El3iuJM.png",
      spel: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/spel-QRPHbuD1RaWP8HO8gdMBHeTh8ihl1Q.png",
      telefoon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/telefoon-ZQo007HXEtSoQJfzWnD0uPyVSy6I4r.png",
      internet: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/internet-OKajeZKvQVHqw90gd8cYKw2El3iuJM.png",
      meme: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/meme-QRPHbuD1RaWP8HO8gdMBHeTh8ihl1Q.png",
      video: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/video-ZQo007HXEtSoQJfzWnD0uPyVSy6I4r.png",
      muziek: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/muziek-OKajeZKvQVHqw90gd8cYKw2El3iuJM.png",
      foto: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/foto-QRPHbuD1RaWP8HO8gdMBHeTh8ihl1Q.png",
      chat: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/chat-ZQo007HXEtSoQJfzWnD0uPyVSy6I4r.png",
      school: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/school-OKajeZKvQVHqw90gd8cYKw2El3iuJM.png",
      werk: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/werk-QRPHbuD1RaWP8HO8gdMBHeTh8ihl1Q.png",
      familie: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/familie-ZQo007HXEtSoQJfzWnD0uPyVSy6I4r.png",
      vriend: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vriend-OKajeZKvQVHqw90gd8cYKw2El3iuJM.png",
      vrienden: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vrienden-QRPHbuD1RaWP8HO8gdMBHeTh8ihl1Q.png",
      tijd: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tijd-ZQo007HXEtSoQJfzWnD0uPyVSy6I4r.png",
      volger: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/volger-OKajeZKvQVHqw90gd8cYKw2El3iuJM.png",
      viraal: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/viraal-QRPHbuD1RaWP8HO8gdMBHeTh8ihl1Q.png",
      influencer:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/influencer-ZQo007HXEtSoQJfzWnD0uPyVSy6I4r.png",
      streaming: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/streaming-OKajeZKvQVHqw90gd8cYKw2El3iuJM.png",
      content: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/content-QRPHbuD1RaWP8HO8gdMBHeTh8ihl1Q.png",
      algoritme: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/algoritme-ZQo007HXEtSoQJfzWnD0uPyVSy6I4r.png",
      notificatie:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/notificatie-OKajeZKvQVHqw90gd8cYKw2El3iuJM.png",
      hashtag: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hashtag-QRPHbuD1RaWP8HO8gdMBHeTh8ihl1Q.png",
      gebaseerd: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/gebaseerd-ZQo007HXEtSoQJfzWnD0uPyVSy6I4r.png",
      verdacht: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/verdacht-OKajeZKvQVHqw90gd8cYKw2El3iuJM.png",
      sfeer: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sfeer-ZQo007HXEtSoQJfzWnD0uPyVSy6I4r.png",
      pronken: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pronken-ZQo007HXEtSoQJfzWnD0uPyVSy6I4r.png",
      paasei: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/paasei-OKajeZKvQVHqw90gd8cYKw2El3iuJM.png",
      beginner: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/beginner-QRPHbuD1RaWP8HO8gdMBHeTh8ihl1Q.png",
      vertraging:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vertraging-ZQo007HXEtSoQJfzWnD0uPyVSy6I4r.png",
      fout: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fout-ZQo007HXEtSoQJfzWnD0uPyVSy6I4r.png",
      snelloop: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/snelloop-ZQo007HXEtSoQJfzWnD0uPyVSy6I4r.png",
      modificatie:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/modificatie-ZQo007HXEtSoQJfzWnD0uPyVSy6I4r.png",
      rickroll: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/rickroll-ZQo007HXEtSoQJfzWnD0uPyVSy6I4r.png",
      deepfake: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/deepfake-ZQo007HXEtSoQJfzWnD0uPyVSy6I4r.png",
      blockchain:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/blockchain-ZQo007HXEtSoQJfzWnD0uPyVSy6I4r.png",
      metaverse: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/metaverse-ZQo007HXEtSoQJfzWnD0uPyVSy6I4r.png",
      NFT: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/NFT-ZQo007HXEtSoQJfzWnD0uPyVSy6I4r.png",
      podcast: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/podcast-ZQo007HXEtSoQJfzWnD0uPyVSy6I4r.png",
      gigachad: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/gigachad-ZQo007HXEtSoQJfzWnD0uPyVSy6I4r.png",
      wojak: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/wojak-ZQo007HXEtSoQJfzWnD0uPyVSy6I4r.png",
      pepe: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pepe-ZQo007HXEtSoQJfzWnD0uPyVSy6I4r.png",
      doge: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/doge-ZQo007HXEtSoQJfzWnD0uPyVSy6I4r.png",
      karen: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/karen-ZQo007HXEtSoQJfzWnD0uPyVSy6I4r.png",
      simp: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/simp-ZQo007HXEtSoQJfzWnD0uPyVSy6I4r.png",
    }

    return (
      imageMap[dutchWord.toLowerCase()] || `/placeholder.svg?height=48&width=48&text=${encodeURIComponent(dutchWord)}`
    )
  }

  const loadWords = async (difficulty?: number) => {
    setLoading(true)
    try {
      const url = difficulty ? `/api/game/words?difficulty=${difficulty}` : "/api/game/words"
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        const wordsWithImages = data.words.map((word: GameWord) => ({
          ...word,
          options: word.options.map((option: any) => ({
            ...option,
            image: getImageForDutchWord(option.text),
          })),
        }))
        setWords(wordsWithImages)
        setGameStartTime(Date.now())
      } else {
        console.error("Failed to load words")
        const fallbackWords = getWordsByDifficulty(difficulty)
        const gameWords = fallbackWords.map((word) => {
          // Get 3 random incorrect options from other words
          const otherWords = fallbackWords.filter((w) => w.id !== word.id)
          const incorrectOptions = otherWords
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map((w) => ({
              text: w.dutch_translation,
              image: getImageForDutchWord(w.dutch_translation),
            }))

          // Add the correct option
          const correctOption = {
            text: word.dutch_translation,
            image: getImageForDutchWord(word.dutch_translation),
          }

          // Combine and shuffle all options
          const allOptions = [correctOption, ...incorrectOptions].sort(() => Math.random() - 0.5)

          return {
            id: word.id,
            spanish: word.spanish_word,
            dutch: word.dutch_translation,
            image: word.image_url,
            options: allOptions,
            difficulty: word.difficulty_level,
          }
        })
        setWords(gameWords)
      }
    } catch (error) {
      console.error("Error loading words:", error)
      const fallbackWords = getWordsByDifficulty(difficulty)
      const gameWords = fallbackWords.map((word) => {
        // Get 3 random incorrect options from other words
        const otherWords = fallbackWords.filter((w) => w.id !== word.id)
        const incorrectOptions = otherWords
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map((w) => ({
            text: w.dutch_translation,
            image: getImageForDutchWord(w.dutch_translation),
          }))

        // Add the correct option
        const correctOption = {
          text: word.dutch_translation,
          image: getImageForDutchWord(word.dutch_translation),
        }

        // Combine and shuffle all options
        const allOptions = [correctOption, ...incorrectOptions].sort(() => Math.random() - 0.5)

        return {
          id: word.id,
          spanish: word.spanish_word,
          dutch: word.dutch_translation,
          image: word.image_url,
          options: allOptions,
          difficulty: word.difficulty_level,
        }
      })
      setWords(gameWords)
    } finally {
      setLoading(false)
    }
  }

  const handleDifficultySelect = (level: number) => {
    setSelectedDifficulty(level)
    setGameMode("playing")
    loadWords(level)
  }

  const handlePlayAll = () => {
    setSelectedDifficulty(null)
    setGameMode("playing")
    loadWords()
  }

  const currentWord = words[currentWordIndex]

  const handleAnswerSelect = async (answer: string) => {
    if (showResult) return

    setSelectedAnswer(answer)
    const correct = answer === currentWord.dutch
    setIsCorrect(correct)
    setShowResult(true)

    if (correct) {
      setScore(score + 1)
      setStreak(streak + 1)
      setMaxStreak(Math.max(maxStreak, streak + 1))
      setAnimationClass("celebration")

      if ((score + 1) % 2 === 0) {
        // Every 2 correct answers
        const newCharacter = getRandomCharacterToUnlock(unlockedCharacters)
        if (newCharacter) {
          setNewlyUnlockedCharacter(newCharacter)
          setUnlockedCharacters((prev) => [...prev, newCharacter])
          setShowCharacterUnlock(true)
        }
      }

      if (soundEnabled) {
        setPlayCorrectSound(true)
      }
    } else {
      setStreak(0) // Reset streak on wrong answer
      if (soundEnabled) {
        setPlayIncorrectSound(true)
      }
    }

    setTimeout(() => {
      nextWord()
    }, 2000)
  }

  const nextWord = () => {
    setAnimationClass("")
    setSelectedAnswer(null)
    setShowResult(false)

    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1)
    } else {
      setGameComplete(true)
      if (soundEnabled) {
        setPlayCompleteSound(true)
      }
      saveGameSession()
    }
  }

  const saveGameSession = async () => {
    const userId = "guest"
    const sessionDuration = Math.floor((Date.now() - gameStartTime) / 1000)

    try {
      // Save game session
      await fetch("/api/game/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          score,
          totalQuestions: words.length,
          correctAnswers: score,
          sessionDuration,
        }),
      })

      // Update progress for each word
      for (let i = 0; i <= currentWordIndex; i++) {
        const word = words[i]
        if (word) {
          await fetch("/api/game/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId,
              wordId: word.id,
              isCorrect: true, // All answers are correct in this game
            }),
          })
        }
      }
    } catch (error) {
      console.error("Error saving game session:", error)
    }
  }

  const resetGame = () => {
    setCurrentWordIndex(0)
    setScore(0)
    setStreak(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setGameComplete(false)
    setAnimationClass("")
    setGameStartTime(Date.now())
    setShowCharacterUnlock(false)
    setNewlyUnlockedCharacter(null)
  }

  const backToMenu = () => {
    setGameMode("select")
    setWords([])
    resetGame()
  }

  const showCollection = () => {
    setGameMode("collection")
  }

  const GameHeader = () => (
    <div className="absolute top-4 right-4 flex items-center gap-3">
      <Button variant="outline" size="sm" onClick={showCollection} className="h-8 px-3 font-body bg-transparent">
        <Sparkles className="w-3 h-3 mr-1" />
        {unlockedCharacters.length}/{BRAINROT_CHARACTERS.length}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setSoundEnabled(!soundEnabled)}
        className="h-8 px-3 font-body bg-transparent"
      >
        {soundEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
      </Button>
    </div>
  )

  const handleSoundPlayed = () => {
    setPlayCorrectSound(false)
    setPlayIncorrectSound(false)
    setPlayCompleteSound(false)
  }

  const speakWord = (word: string) => {
    if (!speechSupported || isSpeaking) return

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(word)
    utterance.lang = "es-ES" // Spanish language
    utterance.rate = 1.0 // Normal speed instead of fast
    utterance.pitch = 2.2 // Keep very high pitch for funny squeaky voice
    utterance.volume = soundEnabled ? 1 : 0

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }

  const speakWelcomeMessage = () => {
    if (!speechSupported) return

    window.speechSynthesis.cancel()

    const message = "Hello Papacito Max, are you ready to collect Italian Brainrot Figures?"
    const utterance = new SpeechSynthesisUtterance(message)

    utterance.lang = "es-US" // Spanish locale for Spanish-accented English
    utterance.rate = 1.0 // Normal speed instead of fast
    utterance.pitch = 2.5 // Keep extremely high pitch for hilarious squeaky voice
    utterance.volume = 1

    const voices = window.speechSynthesis.getVoices()
    const funnyVoice =
      voices.find(
        (voice) =>
          (voice.lang.startsWith("es") || voice.name.toLowerCase().includes("spanish")) &&
          (voice.name.toLowerCase().includes("female") ||
            voice.name.toLowerCase().includes("woman") ||
            voice.name.toLowerCase().includes("maria") ||
            voice.name.toLowerCase().includes("carmen") ||
            voice.name.toLowerCase().includes("sofia") ||
            voice.name.toLowerCase().includes("isabella")),
      ) ||
      voices.find(
        (voice) =>
          voice.name.toLowerCase().includes("child") ||
          voice.name.toLowerCase().includes("young") ||
          voice.name.toLowerCase().includes("high"),
      ) ||
      voices.find((voice) => voice.lang.startsWith("es")) // Final fallback to any Spanish voice

    if (funnyVoice) {
      utterance.voice = funnyVoice
    }

    utterance.onstart = () => {
      console.log("[v0] Funny welcome message started playing")
      setIsSpeaking(true)
    }
    utterance.onend = () => {
      console.log("[v0] Funny welcome message finished playing")
      setIsSpeaking(false)
    }
    utterance.onerror = (event) => {
      console.log("[v0] Funny welcome message error:", event.error)
      setIsSpeaking(false)
      setTimeout(() => {
        if (!isSpeaking) {
          window.speechSynthesis.speak(utterance)
        }
      }, 200)
    }

    console.log("[v0] Attempting to speak funny welcome message")
    window.speechSynthesis.speak(utterance)
  }

  const dismissWelcome = () => {
    setGameMode("select")
  }

  if (gameMode === "collection") {
    return <BrainrotCollection unlockedCharacters={unlockedCharacters} onClose={() => setGameMode("select")} />
  }

  if (gameMode === "welcome") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative">
        <div className="fixed inset-0 bg-gradient-to-br from-cyan-50 to-orange-50" />
        <Card className="w-full max-w-lg mx-4 bounce-in relative z-10">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <img
                src="/walking-log-baseball.png"
                alt="Tung Tung Tung Sahur"
                className={`w-32 h-32 mx-auto rounded-full border-4 border-primary shadow-lg mb-4 ${isSpeaking ? "animate-bounce" : "animate-pulse"}`}
              />
              <div className="text-6xl mb-4">🎉✨</div>
            </div>

            <h1 className="text-3xl font-heading font-bold text-primary mb-4">Ciao Max! 🇮🇹</h1>

            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-4 mb-6 border-2 border-yellow-300">
              <p className="text-xl font-body text-gray-800 leading-relaxed">
                "Hello Papacito Max, are you ready to collect Italian Brainrot Figures?"
              </p>
              <p className="text-sm text-gray-600 mt-2 font-body italic">- Tung Tung Tung Sahur, the Walking Log</p>
              {isSpeaking && (
                <div className="flex items-center justify-center mt-2 text-primary">
                  <Volume2 className="w-4 h-4 mr-1 animate-pulse" />
                  <span className="text-xs">Speaking...</span>
                </div>
              )}
              {speechSupported && (
                <Button
                  onClick={speakWelcomeMessage}
                  variant="outline"
                  size="sm"
                  className="mt-3 mx-auto flex items-center gap-2 bg-transparent"
                  disabled={isSpeaking}
                >
                  {isSpeaking ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Playing...
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4" />🔊 Play Welcome Message
                    </>
                  )}
                </Button>
              )}
            </div>

            <div className="mb-6">
              <p className="text-lg text-muted-foreground font-body mb-2">
                Learn Spanish words and unlock amazing Italian brainrot characters!
              </p>
              <div className="flex justify-center gap-2 text-sm text-muted-foreground font-body">
                <span>🦈 Tralalero Tralalá</span>
                <span>🐵 Chimpanzini Bananini</span>
                <span>🐊 Bombardiro Crocodilo</span>
              </div>
            </div>

            <Button
              onClick={dismissWelcome}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-heading text-xl px-8 py-4"
            >
              Let's Collect Brainrot! 🚀
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (gameMode === "select") {
    return (
      <div className="relative">
        <GameHeader />
        <DifficultySelector onSelectDifficulty={handleDifficultySelect} onPlayAll={handlePlayAll} />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative">
        <GameHeader />
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <h2 className="text-xl font-heading font-semibold text-foreground mb-2">Loading Game...</h2>
            <p className="text-muted-foreground font-body">Preparing your Spanish learning experience</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (words.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative">
        <GameHeader />
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <h2 className="text-xl font-heading font-semibold text-foreground mb-2">No Words Available</h2>
            <p className="text-muted-foreground font-body mb-4">
              Please check your database connection or contact support.
            </p>
            <Button onClick={backToMenu} variant="outline" className="font-body bg-transparent">
              Back to Menu
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (gameComplete) {
    const perfectGame = score === words.length
    const newCharacter = newlyUnlockedCharacter
      ? BRAINROT_CHARACTERS.find((c) => c.id === newlyUnlockedCharacter)
      : null

    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative">
        <GameHeader />
        <SoundManager
          playCorrect={playCorrectSound}
          playIncorrect={playIncorrectSound}
          playComplete={playCompleteSound}
          onSoundPlayed={handleSoundPlayed}
        />
        <Card className="w-full max-w-md text-center bounce-in">
          <CardContent className="p-8">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-heading font-bold text-foreground mb-4">¡Brainrot Completado!</h1>
            <p className="text-xl text-muted-foreground mb-4 font-body">
              You collected {score} Italian brainrot moments!
            </p>
            <div className="flex justify-center gap-4 mb-4">
              <Badge variant="secondary" className="font-body">
                Max Streak: {maxStreak}
              </Badge>
              <Badge variant="default" className="font-body">
                Characters: {unlockedCharacters.length}/{BRAINROT_CHARACTERS.length}
              </Badge>
            </div>

            {newCharacter && (
              <div className="mb-6 p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg border-2 border-yellow-300">
                <div className="text-2xl mb-2">✨ NEW CHARACTER UNLOCKED! ✨</div>
                <img
                  src={newCharacter.image || "/placeholder.svg"}
                  alt={newCharacter.name}
                  className="w-16 h-16 mx-auto rounded-full border-2 border-yellow-500 mb-2"
                />
                <h3 className="font-heading font-bold text-lg">{newCharacter.name}</h3>
                <p className="text-sm text-muted-foreground">{newCharacter.description}</p>
              </div>
            )}

            <AchievementSystem
              score={score}
              streak={maxStreak}
              totalCorrect={score}
              perfectGames={perfectGame ? 1 : 0}
            />
            <div className="space-y-4 mt-6">
              <div className="flex gap-2">
                <Button
                  onClick={resetGame}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 font-heading"
                >
                  More Brainrot!
                </Button>
                <Button onClick={showCollection} variant="outline" className="flex-1 py-3 font-heading bg-transparent">
                  View Collection
                </Button>
              </div>
              <Button onClick={backToMenu} variant="ghost" className="w-full font-heading">
                Change Level
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <GameHeader />
      <SoundManager
        playCorrect={playCorrectSound}
        playIncorrect={playIncorrectSound}
        playComplete={playCompleteSound}
        onSoundPlayed={handleSoundPlayed}
      />

      {showCharacterUnlock && newlyUnlockedCharacter && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-sm mx-4 bounce-in">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">🎉✨</div>
              <h2 className="text-2xl font-heading font-bold mb-4">NEW CHARACTER!</h2>
              {(() => {
                const character = BRAINROT_CHARACTERS.find((c) => c.id === newlyUnlockedCharacter)
                return character ? (
                  <>
                    <img
                      src={character.image || "/placeholder.svg"}
                      alt={character.name}
                      className="w-20 h-20 mx-auto rounded-full border-4 border-yellow-500 mb-4"
                    />
                    <h3 className="text-xl font-heading font-bold mb-2">{character.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{character.description}</p>
                  </>
                ) : null
              })()}
              <Button
                onClick={() => setShowCharacterUnlock(false)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-heading"
              >
                Awesome!
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <h1 className="text-4xl font-heading font-bold text-foreground">Italian Brainrot Collector</h1>
            <Button onClick={backToMenu} variant="ghost" size="sm" className="font-body">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex justify-center items-center gap-4 text-lg flex-wrap">
            <Badge variant="outline" className="px-3 py-1 font-body">
              Question {currentWordIndex + 1} of {words.length}
            </Badge>
            <Badge variant="secondary" className="px-3 py-1 font-body">
              Brainrot Points: {score}
            </Badge>
            <Badge variant="outline" className="px-3 py-1 font-body">
              Streak: {streak}
            </Badge>
            {currentWord && (
              <Badge variant="outline" className="px-3 py-1 font-body">
                Level {currentWord.difficulty}
              </Badge>
            )}
          </div>
        </div>

        {/* Game Card */}
        <Card className={`w-full ${animationClass}`}>
          <CardContent className="p-8">
            {/* Spanish Word */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-4 mb-4">
                <h2 className="text-5xl font-heading font-bold text-primary">{currentWord.spanish}</h2>
                {speechSupported && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => speakWord(currentWord.spanish)}
                    disabled={isSpeaking || !soundEnabled}
                    className="h-12 w-12 rounded-full bg-transparent hover:bg-primary/10"
                    title="Speak Spanish word"
                  >
                    {isSpeaking ? <Loader2 className="w-5 h-5 animate-spin" /> : <Volume2 className="w-5 h-5" />}
                  </Button>
                )}
              </div>
              <p className="text-lg text-muted-foreground font-body">What does this mean in Dutch?</p>
              <p className="text-sm text-muted-foreground font-body mt-1">Use keys 1-4 to select answers</p>
              <p className="text-xs text-primary font-body mt-2">✨ Collect Italian brainrot characters! ✨</p>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-2 gap-4">
              {currentWord.options.map((option, index) => {
                let buttonVariant: "default" | "secondary" | "destructive" = "secondary"

                if (showResult && selectedAnswer === option.text) {
                  buttonVariant = "default"
                } else if (showResult && option.text === currentWord.dutch) {
                  buttonVariant = "default"
                }

                const imageUrl = getImageForDutchWord(option.text)

                console.log(`[v0] Button ${index + 1} - Text: ${option.text}, Image URL: ${imageUrl}`)

                return (
                  <Button
                    key={index}
                    variant={buttonVariant}
                    size="lg"
                    onClick={() => handleAnswerSelect(option.text)} // Use option.text for selection
                    disabled={showResult}
                    className="h-20 text-lg font-semibold transition-all duration-200 hover:scale-105 font-body relative flex items-center gap-3 justify-start px-4"
                  >
                    <span className="absolute top-1 left-2 text-xs opacity-70">{index + 1}</span>
                    <img
                      src={imageUrl || "/placeholder.svg"}
                      alt={`Image for ${option.text}`}
                      className="w-12 h-12 object-cover rounded border-2 border-border/50 flex-shrink-0"
                      onLoad={() => {
                        console.log(`[v0] Image loaded successfully for: ${option.text}`)
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        console.log(`[v0] Image failed to load for: ${option.text}, trying fallback`)
                        target.src = `/placeholder.svg?height=48&width=48&text=${encodeURIComponent(option.text)}`
                      }}
                    />
                    <span className="flex-1 text-center">{option.text}</span> {/* Use option.text for display */}
                  </Button>
                )
              })}
            </div>

            {/* Result Message */}
            {showResult && (
              <div className="text-center mt-6 bounce-in">
                <p className="text-xl font-semibold font-body">
                  {isCorrect ? (
                    <span className="text-green-600">¡Brainrot Magnifico! 🎉✨</span>
                  ) : (
                    <span className="text-red-600">Oops! The correct answer was: {currentWord.dutch} 🤔</span>
                  )}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentWordIndex + 1) / words.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
