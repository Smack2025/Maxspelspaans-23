"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles, Star } from "lucide-react"

export interface BrainrotCharacter {
  id: string
  name: string
  description: string
  rarity: "common" | "rare" | "epic" | "legendary"
  image: string
  unlocked: boolean
  unlockedAt?: Date
}

const BRAINROT_CHARACTERS: BrainrotCharacter[] = [
  {
    id: "tralalero",
    name: "Tralalero Tralalá",
    description: "The sneaker-wearing shark who dances through neon dreams! 🦈👟",
    rarity: "legendary",
    image: "/dancing-shark-sneakers-neon.png",
    unlocked: false,
  },
  {
    id: "chimpanzini",
    name: "Chimpanzini Bananini",
    description: "Half banana, half monkey, fully unhinged! 🍌🐵",
    rarity: "epic",
    image: "/monkey-banana-hybrid.png",
    unlocked: false,
  },
  {
    id: "sahur",
    name: "Tung Tung Tung Sahur",
    description: "The walking log with hypnotic eyes and a baseball bat! 👁️🏏",
    rarity: "rare",
    image: "/walking-log-baseball-bat.png",
    unlocked: false,
  },
  {
    id: "bombardiro",
    name: "Bombardiro Crocodilo",
    description: "Fighter jet crocodile who dances in tutus! ✈️🐊🩰",
    rarity: "epic",
    image: "/crocodile-fighter-jet-tutu-dancing.png",
    unlocked: false,
  },
  {
    id: "lirili",
    name: "Lirilì Larilà",
    description: "Towering elephant-cactus hybrid with oversized sandals! 🐘🌵👡",
    rarity: "legendary",
    image: "/elephant-cactus-sandals.png",
    unlocked: false,
  },
  {
    id: "gigachadini",
    name: "Gigachadini Maximus",
    description: "The ultimate Italian alpha with pasta muscles! 💪🍝",
    rarity: "legendary",
    image: "/gigachad-pasta-muscles.png",
    unlocked: false,
  },
  {
    id: "wojakkino",
    name: "Wojakkino Sadini",
    description: "Crying Italian wojak with pizza tears! 😭🍕",
    rarity: "common",
    image: "/wojak-crying-pizza-tears-italian.png",
    unlocked: false,
  },
  {
    id: "pepperoni",
    name: "Pepperoni Pepe",
    description: "Rare Pepe made of pepperoni slices! 🐸🍕",
    rarity: "rare",
    image: "/pepe-pepperoni.png",
    unlocked: false,
  },
  {
    id: "dogecoin",
    name: "Dogecoin Italiano",
    description: "Much wow, very pasta, such meatball! 🐕💰",
    rarity: "epic",
    image: "/doge-pasta.png",
    unlocked: false,
  },
  {
    id: "karenzini",
    name: "Karenzini Complainer",
    description: "Wants to speak to the pasta manager! 👩‍🦳🍝",
    rarity: "common",
    image: "/karen-haircut-pasta-manager.png",
    unlocked: false,
  },
  {
    id: "simpini",
    name: "Simpini Donator",
    description: "Donates all his euros for e-girl attention! 💸👧",
    rarity: "common",
    image: "/placeholder.svg?height=200&width=200",
    unlocked: false,
  },
  {
    id: "chadwick",
    name: "Chadwick Spaghetti",
    description: "Sigma male who only eats protein pasta! 🗿🍝",
    rarity: "epic",
    image: "/placeholder.svg?height=200&width=200",
    unlocked: false,
  },
  {
    id: "amogus",
    name: "Amogus Italiano",
    description: "Sus crewmate hiding in the pizza kitchen! 🔴🍕",
    rarity: "rare",
    image: "/placeholder.svg?height=200&width=200",
    unlocked: false,
  },
  {
    id: "rickroll",
    name: "Rickrollini Astley",
    description: "Never gonna give you up... or down! 🎵🕺",
    rarity: "legendary",
    image: "/placeholder.svg?height=200&width=200",
    unlocked: false,
  },
  {
    id: "nyan",
    name: "Nyan Gatto Italiano",
    description: "Rainbow trail cat powered by espresso! 🌈☕",
    rarity: "epic",
    image: "/placeholder.svg?height=200&width=200",
    unlocked: false,
  },
  {
    id: "trollface",
    name: "Trollfaccia Italiana",
    description: "Problem? No, just more pasta! 😈🍝",
    rarity: "rare",
    image: "/placeholder.svg?height=200&width=200",
    unlocked: false,
  },
  {
    id: "grumpy",
    name: "Grumpy Gatto Arrabbiato",
    description: "Hates Mondays, loves lasagna! 😾🍝",
    rarity: "common",
    image: "/placeholder.svg?height=200&width=200",
    unlocked: false,
  },
  {
    id: "distracted",
    name: "Distracto Boyfriend",
    description: "Looking at other pasta while holding spaghetti! 👀🍝",
    rarity: "rare",
    image: "/placeholder.svg?height=200&width=200",
    unlocked: false,
  },
  {
    id: "drake",
    name: "Drako Pointing",
    description: "No to pineapple pizza, yes to pepperoni! 👎🍕",
    rarity: "common",
    image: "/placeholder.svg?height=200&width=200",
    unlocked: false,
  },
  {
    id: "expanding",
    name: "Expanding Braino",
    description: "Brain gets bigger with each pasta fact! 🧠🍝",
    rarity: "epic",
    image: "/placeholder.svg?height=200&width=200",
    unlocked: false,
  },
  {
    id: "stonks",
    name: "Stonks Investore",
    description: "Pasta stocks only go up! 📈🍝",
    rarity: "rare",
    image: "/placeholder.svg?height=200&width=200",
    unlocked: false,
  },
  {
    id: "surprised",
    name: "Surprised Pikachu Italiano",
    description: "Shocked by how good the pasta tastes! ⚡😮",
    rarity: "common",
    image: "/placeholder.svg?height=200&width=200",
    unlocked: false,
  },
  {
    id: "woman",
    name: "Woman Yelling Italiana",
    description: "Screaming about overcooked spaghetti! 😤🍝",
    rarity: "rare",
    image: "/placeholder.svg?height=200&width=200",
    unlocked: false,
  },
  {
    id: "this",
    name: "This Is Fine Pizzaiolo",
    description: "Kitchen on fire but pizza still cooking! 🔥🍕",
    rarity: "epic",
    image: "/placeholder.svg?height=200&width=200",
    unlocked: false,
  },
  {
    id: "galaxy",
    name: "Galaxy Brain Pasta",
    description: "Transcended to pasta enlightenment! 🌌🍝",
    rarity: "legendary",
    image: "/placeholder.svg?height=200&width=200",
    unlocked: false,
  },
  {
    id: "coffin",
    name: "Coffin Dance Spaghetti",
    description: "Dancing pallbearers carrying overcooked pasta! ⚰️💃",
    rarity: "epic",
    image: "/placeholder.svg?height=200&width=200",
    unlocked: false,
  },
  {
    id: "hide",
    name: "Hide the Pain Italiano",
    description: "Smiling while eating pineapple pizza! 😬🍕",
    rarity: "rare",
    image: "/placeholder.svg?height=200&width=200",
    unlocked: false,
  },
  {
    id: "success",
    name: "Success Kid Pasta",
    description: "Successfully ate entire bowl of spaghetti! 👶✊",
    rarity: "common",
    image: "/placeholder.svg?height=200&width=200",
    unlocked: false,
  },
  {
    id: "disaster",
    name: "Disaster Girl Pizzeria",
    description: "Smiling while pizzeria burns behind her! 👧🔥",
    rarity: "epic",
    image: "/placeholder.svg?height=200&width=200",
    unlocked: false,
  },
  {
    id: "philosoraptor",
    name: "Philosoraptor Pasta",
    description: "If spaghetti is long pasta, is penne short pasta? 🦕🤔",
    rarity: "rare",
    image: "/placeholder.svg?height=200&width=200",
    unlocked: false,
  },
]

interface BrainrotCollectionProps {
  unlockedCharacters: string[]
  onClose: () => void
}

export function BrainrotCollection({ unlockedCharacters, onClose }: BrainrotCollectionProps) {
  const [characters, setCharacters] = useState<BrainrotCharacter[]>([])
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null)

  useEffect(() => {
    const updatedCharacters = BRAINROT_CHARACTERS.map((char) => ({
      ...char,
      unlocked: unlockedCharacters.includes(char.id),
    }))
    setCharacters(updatedCharacters)
  }, [unlockedCharacters])

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return "text-yellow-500 border-yellow-500"
      case "epic":
        return "text-purple-500 border-purple-500"
      case "rare":
        return "text-blue-500 border-blue-500"
      default:
        return "text-gray-500 border-gray-500"
    }
  }

  const speakCharacterName = (characterName: string) => {
    if ("speechSynthesis" in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(characterName)

      // Use Spanish-accented voice settings
      utterance.lang = "es-US"
      utterance.rate = 0.9
      utterance.pitch = 1.8

      // Try to find a Spanish female voice
      const voices = window.speechSynthesis.getVoices()
      const spanishVoice = voices.find(
        (voice) =>
          voice.lang.startsWith("es") &&
          (voice.name.toLowerCase().includes("maria") ||
            voice.name.toLowerCase().includes("carmen") ||
            voice.name.toLowerCase().includes("sofia") ||
            voice.name.toLowerCase().includes("isabella") ||
            voice.name.toLowerCase().includes("female")),
      )

      if (spanishVoice) {
        utterance.voice = spanishVoice
      }

      console.log(`[v0] Speaking character name: ${characterName}`)
      window.speechSynthesis.speak(utterance)
    }
  }

  const handleCharacterSelect = (characterId: string) => {
    if (selectedCharacter === characterId) {
      setSelectedCharacter(null) // Deselect if already selected
    } else {
      setSelectedCharacter(characterId)

      const character = characters.find((c) => c.id === characterId)
      if (character) {
        speakCharacterName(character.name)
      }

      setTimeout(() => {
        setSelectedCharacter(null)
      }, 2000)
    }
  }

  const unlockedCount = characters.filter((c) => c.unlocked).length

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-heading font-bold text-foreground mb-4 flex items-center justify-center gap-2">
              <Sparkles className="w-8 h-8 text-primary" />
              Italian Brainrot Collection
              <Sparkles className="w-8 h-8 text-primary" />
            </h1>
            <p className="text-lg text-muted-foreground font-body mb-4">
              Collect all the legendary Italian brainrot characters!
            </p>
            <Badge variant="secondary" className="text-lg px-4 py-2 font-body">
              {unlockedCount} / {characters.length} Collected
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {characters.map((character) => (
              <Card
                key={character.id}
                className={`relative overflow-hidden transition-all duration-300 cursor-pointer ${
                  character.unlocked
                    ? `border-2 ${getRarityColor(character.rarity)} shadow-lg hover:scale-105 ${
                        selectedCharacter === character.id
                          ? "animate-spin scale-110 shadow-2xl ring-4 ring-primary/50"
                          : ""
                      }`
                    : "opacity-50 grayscale"
                }`}
                onClick={() => character.unlocked && handleCharacterSelect(character.id)}
              >
                <CardContent className="p-6 text-center">
                  {character.unlocked && (
                    <div className="absolute top-2 right-2">
                      <Star className="w-6 h-6 text-yellow-500 fill-current" />
                    </div>
                  )}

                  <div className="mb-4">
                    <img
                      src={character.image || "/placeholder.svg"}
                      alt={character.name}
                      className={`w-24 h-24 mx-auto rounded-full border-4 border-border object-cover transition-transform duration-300 ${
                        selectedCharacter === character.id ? "animate-bounce scale-125" : ""
                      }`}
                    />
                  </div>

                  <h3 className="text-xl font-heading font-bold text-foreground mb-2">
                    {character.unlocked ? character.name : "???"}
                  </h3>

                  <Badge variant="outline" className={`mb-3 ${getRarityColor(character.rarity)} font-body`}>
                    {character.rarity.toUpperCase()}
                  </Badge>

                  <p className="text-sm text-muted-foreground font-body">
                    {character.unlocked ? character.description : "Keep playing to unlock!"}
                  </p>

                  {selectedCharacter === character.id && character.unlocked && (
                    <div className="absolute inset-0 bg-primary/10 rounded-lg flex items-center justify-center">
                      <div className="text-4xl animate-pulse">✨</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button
              onClick={onClose}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-8 font-heading"
            >
              Continue Playing
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function getRandomCharacterToUnlock(alreadyUnlocked: string[]): string | null {
  const availableCharacters = BRAINROT_CHARACTERS.filter((char) => !alreadyUnlocked.includes(char.id))

  if (availableCharacters.length === 0) return null

  const weights = availableCharacters.map((char) => {
    switch (char.rarity) {
      case "legendary":
        return 1
      case "epic":
        return 3
      case "rare":
        return 5
      default:
        return 10
    }
  })

  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0)
  let random = Math.random() * totalWeight

  for (let i = 0; i < availableCharacters.length; i++) {
    random -= weights[i]
    if (random <= 0) {
      return availableCharacters[i].id
    }
  }

  return availableCharacters[0].id
}

export { BRAINROT_CHARACTERS }
