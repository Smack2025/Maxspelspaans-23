"use client"

import { useEffect, useState } from "react"
import { getUserStats } from "@/lib/database"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Trophy, Target, TrendingUp, Clock, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface UserStats {
  totalWords: number
  masteredWords: number
  learningWords: number
  accuracy: number
  recentSessions: any[]
}

export default function StatsPage() {
  const router = useRouter()
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState<string>("guest")

  useEffect(() => {
    const loadStats = async () => {
      const userId = localStorage.getItem("spanish-game-user") || "guest"
      setUsername(userId)

      try {
        const userStats = await getUserStats(userId)
        setStats(userStats)
      } catch (error) {
        console.error("Error loading stats:", error)
        setStats({
          totalWords: 0,
          masteredWords: 0,
          learningWords: 0,
          accuracy: 0,
          recentSessions: [],
        })
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground font-body">Loading your stats...</p>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground font-body mb-4">Unable to load stats</p>
          <Link href="/">
            <Button variant="outline" className="font-body bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Game
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <User className="w-5 h-5 text-primary" />
              <span className="text-lg font-body text-muted-foreground">{username}</span>
            </div>
            <h1 className="text-3xl font-heading font-bold text-foreground">Your Progress</h1>
            <p className="text-muted-foreground font-body">Track your Spanish learning journey</p>
          </div>
          <Link href="/">
            <Button variant="outline" className="font-body bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Game
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-body">Words Learned</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-heading">{stats.totalWords}</div>
              <p className="text-xs text-muted-foreground font-body">{stats.masteredWords} mastered</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-body">Accuracy</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-heading">{stats.accuracy}%</div>
              <p className="text-xs text-muted-foreground font-body">Overall performance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-body">Mastered Words</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-heading">{stats.masteredWords}</div>
              <p className="text-xs text-muted-foreground font-body">Ready for review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-body">Learning</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-heading">{stats.learningWords}</div>
              <p className="text-xs text-muted-foreground font-body">In progress</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Recent Game Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentSessions.length === 0 ? (
              <p className="text-muted-foreground font-body">
                No game sessions yet. Start playing to see your progress!
              </p>
            ) : (
              <div className="space-y-4">
                {stats.recentSessions.map((session, index) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="font-body">
                        Game {stats.recentSessions.length - index}
                      </Badge>
                      <div>
                        <p className="font-semibold font-body">
                          {session.correct_answers}/{session.total_questions} correct
                        </p>
                        <p className="text-sm text-muted-foreground font-body">
                          {new Date(session.completed_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold font-heading">Score: {session.score}</p>
                      {session.session_duration && (
                        <p className="text-sm text-muted-foreground font-body">
                          {Math.round(session.session_duration / 60)}m {session.session_duration % 60}s
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
