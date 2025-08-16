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
    image: "/dancing-shark.png",
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
    image: "/walking-log-baseball.png",
    unlocked: false,
  },
  {
    id: "bombardiro",
    name: "Bombardiro Crocodilo",
    description: "Fighter jet crocodile who dances in tutus! ✈️🐊🩰",
    rarity: "epic",
    image: "/crocodile-fighter-jet.png",
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
]

interface BrainrotCollectionProps {
  unlockedCharacters: string[]
  onClose: () => void
}

export function BrainrotCollection({ unlockedCharacters, onClose }: BrainrotCollectionProps) {
  const [characters, setCharacters] = useState<BrainrotCharacter[]>([])

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
                className={`relative overflow-hidden transition-all duration-300 ${
                  character.unlocked
                    ? `border-2 ${getRarityColor(character.rarity)} shadow-lg hover:scale-105`
                    : "opacity-50 grayscale"
                }`}
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
                      className="w-24 h-24 mx-auto rounded-full border-4 border-border object-cover"
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

  // Weight by rarity (common more likely, legendary less likely)
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
