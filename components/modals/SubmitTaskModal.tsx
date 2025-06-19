"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { SubmitTaskModalProps } from "@/models/types"
import { useSubmitWorkHook } from "@/hooks/useSubmitWork"
import toast from "react-hot-toast"

export default function SubmitTaskModal({
  isOpen,
  onClose,
  taskAddress,
  title = "Add Your Message",
  placeholder = "Type your message here...",
  submitText = "Submit",
  cancelText = "Cancel",
  maxLength = 500,
}: SubmitTaskModalProps) {
  const [text, setText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { submitWork } = useSubmitWorkHook(taskAddress as `0x${string}`);
  
  if (!isOpen) return null

  const handleSubmit = async () => {
    if (!text.trim()) {
      toast.error("Please enter some text before submitting")
      return
    }

    setIsSubmitting(true)
    try {
      await submitWork(taskAddress as `0x${string}`, text.trim());
      setText("")
      onClose()
    } catch (error) {
        console.error("Error submitting:", error);
        toast.error("Failed to submit. Please try again.");
    } finally {
        setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setText("")
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Close button */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={handleClose}
            className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Header */}
        <div className="relative h-32 overflow-hidden bg-gradient-to-br from-orange-400 via-orange-500 to-red-500">
          <div className="absolute inset-0 opacity-20">
            <svg viewBox="0 0 400 128" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="headerSwirl" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
                </linearGradient>
              </defs>
              <path
                d="M50,64 Q150,32 250,64 T450,64"
                stroke="url(#headerSwirl)"
                strokeWidth="2"
                fill="none"
                opacity="0.6"
              />
              <path
                d="M0,96 Q100,64 200,96 T400,96"
                stroke="url(#headerSwirl)"
                strokeWidth="1.5"
                fill="none"
                opacity="0.4"
              />
              <circle cx="320" cy="48" r="24" fill="rgba(255,255,255,0.1)" />
              <circle cx="80" cy="80" r="16" fill="rgba(255,255,255,0.15)" />
            </svg>
          </div>
        </div>

        {/* Modal content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
          </div>

          {/* Textarea */}
          <div className="mb-6">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={placeholder}
              maxLength={maxLength}
              rows={6}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-gray-700 placeholder-gray-400 resize-none"
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-400">
                {text.length}/{maxLength} characters
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-4 px-4 rounded-xl border border-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelText}
            </button>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !text.trim()}
              className={`flex-1 font-semibold py-4 px-4 rounded-xl transition-colors ${
                isSubmitting || !text.trim()
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600 text-white cursor-pointer"
              }`}
            >
              {isSubmitting ? "Submitting..." : submitText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}