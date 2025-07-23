import React, { useState, useEffect, useRef, useCallback } from "react"
import { X } from "lucide-react"
import Image from "next/image"
import abstract from "../../public/waving-orange.png"

interface WelcomeModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  username: string
  setUsername: (username: string) => void
}

const WelcomeModal = ({ isOpen, onClose, onSave, username, setUsername }: WelcomeModalProps) => {
  const [usernameError, setUsernameError] = useState<string>("")
  const modalRef = useRef<HTMLDivElement>(null)
  const initialFocusRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      initialFocusRef.current?.focus()
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value)
    if (usernameError && e.target.value) {
      setUsernameError("")
    }
  }

  const handleSave = () => {
    if (!username.trim()) {
      setUsernameError("Please enter a username")
      return
    }
    setUsernameError("")
    localStorage.setItem("microgigs_username", username)
    onSave()
    onClose()
  }

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isOpen) return

      if (event.key === "Escape") {
        onClose()
      }

      if (event.key === "Enter") {
        handleSave()
      }

      if (event.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as NodeListOf<HTMLElement>
        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement?.focus()
            event.preventDefault()
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement?.focus()
            event.preventDefault()
          }
        }
      }
    },
    [isOpen, onClose, username]
  )

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleKeyDown])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-sm md:max-w-[400px] bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            aria-label="Close welcome modal"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Hero Image */}
        <div className="relative h-48 overflow-hidden">
          <Image 
            src={abstract || "/placeholder.svg"} 
            alt="Abstract illustration" 
            fill 
            className="object-cover" 
          />
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <div className="w-2 h-2 bg-white/50 rounded-full"></div>
            <div className="w-2 h-2 bg-white/50 rounded-full"></div>
          </div>
        </div>

        {/* Modal content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-md font-bold text-gray-900 mb-2">Welcome to MicroGigs</h3>
            <p className="text-sm text-gray-500">Turn your skills into rewards and join a thriving community</p>
          </div>

          <div className="mb-6">
            <label 
              htmlFor="username" 
              className="block text-sm font-medium text-gray-700 mb-3"
            >
              Pick A Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={handleUsernameChange}
              ref={initialFocusRef}
              placeholder="Pick a really cool Name..."
              className={`w-full px-4 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-gray-700 placeholder-gray-400 ${
                usernameError ? "border-red-500" : "border-gray-200"
              }`}
              aria-invalid={!!usernameError}
              aria-describedby={usernameError ? "username-error" : undefined}
            />
            {usernameError && (
              <p id="username-error" className="text-red-500 text-xs mt-2">
                {usernameError}
              </p>
            )}
          </div>

          <button
            onClick={handleSave}
            disabled={!username.trim()}
            className={`w-full font-semibold py-4 px-4 rounded-xl transition-colors text-base focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${
              !username.trim()
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600 text-white cursor-pointer shadow-md hover:shadow-lg"
            }`}
          >
            Continue to Wallet Connection
          </button>

          <div className="text-center mt-6 space-y-2">
            <p className="text-xs text-gray-500">
              By using MicroGigs, you accept our{" "}
              <a 
                href="#" 
                className="text-blue-600 underline hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Terms of Use
              </a>{" "}
              and{" "}
              <a 
                href="#" 
                className="text-blue-600 underline hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Privacy Policy
              </a>
              , ensuring a safe and transparent experience.
            </p>

            <p className="text-xs text-gray-500 mt-4">
              Talk to the team at{" "}
              <a 
                href="mailto:support@microgigs.com" 
                className="text-blue-600 underline hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                support@microgigs.com
              </a>
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

export default WelcomeModal