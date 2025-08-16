"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sparkles } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SignUpForm() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!username.trim()) {
      setError("Username is required")
      return
    }

    if (username.trim().length < 3) {
      setError("Username must be at least 3 characters long")
      return
    }

    localStorage.setItem("spanish-game-user", username.trim())
    setSuccess("Account created successfully!")

    setTimeout(() => {
      router.push("/")
    }, 1000)
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="space-y-4 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
          <Sparkles className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground font-heading">¡Hola! Let's Start</h1>
        <p className="text-lg text-muted-foreground font-body">Create your username to begin learning Spanish</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl font-body">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-primary/10 border border-primary/20 text-primary px-4 py-3 rounded-xl font-body">
            {success}
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-medium text-foreground font-body">
              Username
            </label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="bg-card border-border text-foreground placeholder:text-muted-foreground h-12 rounded-xl font-body"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-medium rounded-xl h-[60px] font-heading"
        >
          <Sparkles className="mr-2 h-5 w-5" />
          Start Your Journey
        </Button>

        <div className="text-center text-muted-foreground font-body">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-primary hover:text-primary/80 font-medium">
            Log in
          </Link>
        </div>
      </form>
    </div>
  )
}
