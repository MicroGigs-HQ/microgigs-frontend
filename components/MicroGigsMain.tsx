"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import SimpleConnectScreen from "./screens/OnboardScreen"
import ExistingUserHomeScreen from "./screens/HomeScreen"
import { SplashScreen } from "@/components/splash-screen"

export default function MicroGigsMain() {
  const [showSplash, setShowSplash] = useState(true)
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false)
  
  const { isConnected, address } = useAccount()

  useEffect(() => {
    // Check if running in frame/mini app
    const search = window.location.search
    const isFC = search.includes('fc_user') || search.includes('frame_id')
    const isFrame = window !== window.parent

    // Skip splash for frames/mini apps
    if (isFC || isFrame) {
      setShowSplash(false)
    }

    // Check onboarding status
    const onboardingComplete = localStorage.getItem('microgigs_onboarding_complete')
    if (onboardingComplete && isConnected) {
      setHasCompletedOnboarding(true)
    }
  }, [isConnected])

  // Update when wallet connects
  useEffect(() => {
    if (isConnected && address) {
      const onboardingComplete = localStorage.getItem('microgigs_onboarding_complete')
      if (onboardingComplete) {
        setHasCompletedOnboarding(true)
      }
    }
  }, [isConnected, address])

  // Handle splash screen completion
  const handleSplashComplete = () => {
    setShowSplash(false)
  }

  // Show splash screen first
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />
  }

  // Show the appropriate light-themed screen
  if (hasCompletedOnboarding && isConnected) {
    return <ExistingUserHomeScreen />
  }

  return <SimpleConnectScreen />
}