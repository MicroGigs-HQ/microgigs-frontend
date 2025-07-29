"use client"

import { useState, useEffect } from "react"
import { SplashScreen } from "@/components/splash-screen"
import UnifiedHomePage from "../app/home/page"

export default function MicroGigsMain() {
  const [showSplash, setShowSplash] = useState(false)
  const [hasShownSplash, setHasShownSplash] = useState(false)

  useEffect(() => {
   
    const splashShown = sessionStorage.getItem('microgigs_splash_shown')
    const search = window.location.search
    const isFC = search.includes('fc_user') || search.includes('frame_id')
    const isFrame = window !== window.parent


    if (!splashShown && !isFC && !isFrame && !hasShownSplash) {
      setShowSplash(true)
      setHasShownSplash(true)
    
      sessionStorage.setItem('microgigs_splash_shown', 'true')
    }
  }, [hasShownSplash])

  const handleSplashComplete = () => {
    setShowSplash(false)
  }

 
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />
  }

  // Always show the unified home page
  return <UnifiedHomePage />
}