"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Zap } from "lucide-react"

interface DifficultySelectorProps {
  onSelectDifficulty: (level: number) => void
  onPlayAll: () => void
}

export function DifficultySelector({ onSelectDifficulty, onPlayAll }: DifficultySelectorProps) {
  const difficulties = [
    {
      level: 1,
      name: "Beginner",
      description: "Basic everyday words",
      icon: Star,
      color: "text-green-600",
      bgColor: "bg-green-50 hover:bg-green-100",
      borderColor: "border-green-200",
    },
    {
      level: 2,
      name: "Intermediate",
      description: "More complex vocabulary",
      icon: Zap,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 hover:bg-yellow-100",
      borderColor: "border-yellow-200",
    },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-heading font-bold text-foreground mb-4">Choose Your Level</h1>
          <p className="text-lg text-muted-foreground font-body">Select a difficulty level to start learning</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {difficulties.map((difficulty) => {
            const Icon = difficulty.icon
            return (
              <Card
                key={difficulty.level}
                className={`cursor-pointer transition-all duration-200 hover:scale-105 ${difficulty.borderColor} ${difficulty.bgColor}`}
                onClick={() => onSelectDifficulty(difficulty.level)}
              >
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-2">
                    <Icon className={`w-8 h-8 ${difficulty.color}`} />
                  </div>
                  <CardTitle className="font-heading">{difficulty.name}</CardTitle>
                  <Badge variant="outline" className="w-fit mx-auto font-body">
                    Level {difficulty.level}
                  </Badge>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground font-body">{difficulty.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center">
          <Button
            onClick={onPlayAll}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-heading px-8 py-3"
          >
            Play All Levels
          </Button>
          <p className="text-sm text-muted-foreground mt-2 font-body">Mix words from all difficulty levels</p>
        </div>
      </div>
    </div>
  )
}
