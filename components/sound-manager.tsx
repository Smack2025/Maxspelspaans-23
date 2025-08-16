"use client"

import { useEffect, useRef } from "react"

interface SoundManagerProps {
  playCorrect: boolean
  playIncorrect: boolean
  playComplete: boolean
  onSoundPlayed: () => void
}

export function SoundManager({ playCorrect, playIncorrect, playComplete, onSoundPlayed }: SoundManagerProps) {
  const correctSoundRef = useRef<HTMLAudioElement | null>(null)
  const incorrectSoundRef = useRef<HTMLAudioElement | null>(null)
  const completeSoundRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Create audio elements
    correctSoundRef.current = new Audio()
    incorrectSoundRef.current = new Audio()
    completeSoundRef.current = new Audio()

    // Set audio sources (using data URLs for simple beep sounds)
    correctSoundRef.current.src =
      "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"
    incorrectSoundRef.current.src =
      "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"
    completeSoundRef.current.src =
      "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"

    return () => {
      // Cleanup
      correctSoundRef.current = null
      incorrectSoundRef.current = null
      completeSoundRef.current = null
    }
  }, [])

  useEffect(() => {
    if (playCorrect && correctSoundRef.current) {
      correctSoundRef.current.play().catch(() => {
        // Ignore audio play errors (user interaction required)
      })
      onSoundPlayed()
    }
  }, [playCorrect, onSoundPlayed])

  useEffect(() => {
    if (playIncorrect && incorrectSoundRef.current) {
      incorrectSoundRef.current.play().catch(() => {
        // Ignore audio play errors
      })
      onSoundPlayed()
    }
  }, [playIncorrect, onSoundPlayed])

  useEffect(() => {
    if (playComplete && completeSoundRef.current) {
      completeSoundRef.current.play().catch(() => {
        // Ignore audio play errors
      })
      onSoundPlayed()
    }
  }, [playComplete, onSoundPlayed])

  return null // This component doesn't render anything
}
