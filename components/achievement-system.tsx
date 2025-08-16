"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Target, Zap, Star, Award, Crown } from "lucide-react"

interface Achievement {
  id: string
  name: string
  description: string
  icon: any
  unlocked: boolean
  progress?: number
  target?: number
}

interface AchievementSystemProps {
  score: number
  streak: number
  totalCorrect: number
  perfectGames: number
}

export function AchievementSystem({ score, streak, totalCorrect, perfectGames }: AchievementSystemProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [newUnlocks, setNewUnlocks] = useState<Achievement[]>([])

  useEffect(() => {
    const achievementList: Achievement[] = [
      {
        id: "first_correct",
        name: "First Steps",
        description: "Get your first answer correct",
        icon: Star,
        unlocked: totalCorrect >= 1,
      },
      {
        id: "streak_5",
        name: "On Fire",
        description: "Get 5 answers in a row",
        icon: Zap,
        unlocked: streak >= 5,
        progress: Math.min(streak, 5),
        target: 5,
      },
      {
        id: "perfect_game",
        name: "Perfectionist",
        description: "Complete a game with 100% accuracy",
        icon: Trophy,
        unlocked: perfectGames >= 1,
      },
      {
        id: "total_50",
        name: "Scholar",
        description: "Answer 50 questions correctly",
        icon: Target,
        unlocked: totalCorrect >= 50,
        progress: Math.min(totalCorrect, 50),
        target: 50,
      },
      {
        id: "streak_10",
        name: "Unstoppable",
        description: "Get 10 answers in a row",
        icon: Award,
        unlocked: streak >= 10,
        progress: Math.min(streak, 10),
        target: 10,
      },
      {
        id: "total_100",
        name: "Master",
        description: "Answer 100 questions correctly",
        icon: Crown,
        unlocked: totalCorrect >= 100,
        progress: Math.min(totalCorrect, 100),
        target: 100,
      },
    ]

    // Check for new unlocks
    const previouslyUnlocked = achievements.filter((a) => a.unlocked).map((a) => a.id)
    const newlyUnlocked = achievementList.filter((a) => a.unlocked && !previouslyUnlocked.includes(a.id))

    setAchievements(achievementList)
    if (newlyUnlocked.length > 0) {
      setNewUnlocks(newlyUnlocked)
      // Clear new unlocks after showing them
      setTimeout(() => setNewUnlocks([]), 3000)
    }
  }, [score, streak, totalCorrect, perfectGames])

  if (newUnlocks.length > 0) {
    return (
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        {newUnlocks.map((achievement) => {
          const Icon = achievement.icon
          return (
            <Card key={achievement.id} className="mb-2 bg-primary text-primary-foreground animate-bounce">
              <CardContent className="p-4 flex items-center gap-3">
                <Icon className="w-6 h-6" />
                <div>
                  <p className="font-semibold font-heading">Achievement Unlocked!</p>
                  <p className="text-sm font-body">{achievement.name}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
      {achievements.slice(0, 6).map((achievement) => {
        const Icon = achievement.icon
        return (
          <div
            key={achievement.id}
            className={`flex items-center gap-2 p-2 rounded-lg border ${
              achievement.unlocked
                ? "bg-primary/10 border-primary/20 text-primary"
                : "bg-muted/50 border-muted text-muted-foreground"
            }`}
          >
            <Icon className="w-4 h-4" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate font-body">{achievement.name}</p>
              {achievement.target && (
                <div className="w-full bg-muted rounded-full h-1 mt-1">
                  <div
                    className="bg-primary h-1 rounded-full transition-all duration-300"
                    style={{ width: `${((achievement.progress || 0) / achievement.target) * 100}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
