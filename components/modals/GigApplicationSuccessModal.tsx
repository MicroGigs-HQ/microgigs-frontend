"use client"

import { X } from "lucide-react"
import { ApplicationSuccessModalProps } from "@/models/types"

export default function ApplicationSuccessModal({
  isOpen,
  onClose,
  timeRemaining,
  onViewGig,
  onMessageOwner,
}: ApplicationSuccessModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Close button */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Hero Image with Orange Gradient */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-orange-400 via-orange-500 to-red-500">
          {/* Abstract swirl pattern overlay */}
          <div className="absolute inset-0 opacity-30">
            <svg viewBox="0 0 400 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="swirl" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
                </linearGradient>
              </defs>
              <path
                d="M50,100 Q150,50 250,100 T450,100"
                stroke="url(#swirl)"
                strokeWidth="3"
                fill="none"
                opacity="0.6"
              />
              <path
                d="M0,150 Q100,100 200,150 T400,150"
                stroke="url(#swirl)"
                strokeWidth="2"
                fill="none"
                opacity="0.4"
              />
              <circle cx="300" cy="80" r="40" fill="rgba(255,255,255,0.1)" />
              <circle cx="100" cy="120" r="25" fill="rgba(255,255,255,0.15)" />
            </svg>
          </div>
        </div>

        {/* Modal content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-bold text-[#170F49] mb-2">You've Applied Successfully</h3>
            <p className="text-sm text-[#6F6C8F]">Now you can proceed to start working on the gig</p>
          </div>

          {/* Time remaining */}
          <div className="text-center mb-6 mx-12">
            <span className="text-md text-[#170F49] mb-1">you've got </span>
            <span className="text-lg font-bold text-[#170F49]">{timeRemaining}</span>
            <span className="text-md text-[#170F49]"> to finish this</span>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <button
              onClick={onViewGig}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-2xl transition-colors"
            >
              View Gig
            </button>

            <button
              onClick={onMessageOwner}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-2xl border border-gray-500 transition-colors"
            >
              Message Gig owner
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
