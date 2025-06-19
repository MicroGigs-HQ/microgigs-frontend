"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { ArrowLeft, Search, ExternalLink, Share2 } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import logo from "../public/microgigs-logo.svg"
import eth from "../public/ETH.png"
import { MobileNavLayout } from "@/components/layout/MobileNavLayout"
import { useGetTask } from "@/hooks/useGetTaskDetails"
import { TaskDetailPageProps } from "@/models/types"
import { truncateAddress, taskStatus, daysFromNow } from "@/lib/utils"
import ApplicationSuccessModal from "@/components/modals/GigApplicationSuccessModal";
import { useApplyTaskHook } from "@/hooks/useApplyTask"
import toast from "react-hot-toast"
import { useSubmitWorkHook } from "@/hooks/useSubmitWork"
import SubmitTaskModal from "./modals/SubmitTaskModal"

export default function TaskDetailPage({ taskId }: TaskDetailPageProps) {
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const [username, setUsername] = useState("")
  const [hasApplied, setHasApplied] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showSubmissionModal, setShowSubmissionModal] = useState(false)

  const { task, loading, error } = useGetTask(taskId as `0x${string}`)
  const { applyTask, isPendingTask, isSuccessTask, isConfirmingTask, isErrorTask } = useApplyTaskHook(taskId as `0x${string}`);
  const { submitWork, isPendingSubmit, isConfirmingSubmit, isSuccessSubmit } = useSubmitWorkHook(taskId as `0x${string}`);

  useEffect(() => {
    const savedUsername = localStorage.getItem("microgigs_username")
    if (savedUsername) {
      setUsername(savedUsername)
    }
  }, [])

  const handleBack = () => {
    router.back()
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: task?.title ?? "Task on MicroGigs",
          text: `Check out this gig: ${task?.title}`,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  useEffect(() => {
    if(isSuccessTask) {
      setShowSuccessModal(true);
    }
  }, [isSuccessTask])

  const navigateToProfile = () => {
    router.push("/profile")
  }

  return (
    <MobileNavLayout>
      <div className="min-h-screen bg-white text-gray-900">
        {/* Header */}
        <div className="px-4 pt-4 pb-1 bg-white">
          <div className="flex justify-center items-center mb-6">
            <Image src={logo} alt="MicroGigs Logo" width={120} height={32} className="h-8 w-auto object-contain" />
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-8 h-8 rounded-full overflow-hidden bg-red-500 flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors"
              onClick={navigateToProfile}
              title="Go to Profile"
            >
              <span className="text-white text-sm font-medium">{username.charAt(0).toUpperCase() || "G"}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">Gm, {username || "Gm"} 👋</span>
              <span className="text-xs text-gray-500">What are we making today?</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Ask your AI assistant anything"
              className="w-full text-sm bg-gray-100 border border-gray-200 rounded-xl pl-10 pr-12 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-orange-500 hover:bg-orange-600 p-1.5 rounded-lg transition-colors">
              <Search className="w-3 h-3 text-white" />
            </button>
          </div>
        </div>

        <hr/>

        {/* Content */}
        <div className="px-4 pb-4">
          {loading && 
            <div className="text-center mt-60">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading task details...</p>
            </div>
          }
          {error && <p className="text-center text-sm text-red-500">{error}</p>}

          {!loading && !task && !error && (
            <p className="text-center text-sm text-gray-500">No task found with this address.</p>
          )}

          {!loading && task && (
            <>
              {/* Navigation */}
              <div className="flex items-center gap-3 mb-2">
                <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="text-sm text-gray-500">Task Details</div>
              </div>

              {/* Task Title */}
              <h1 className="text-lg font-bold text-gray-700 mb-2 leading-tight">{task.title}</h1>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-sm font-medium text-gray-500 mb-2">Description</h2>
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{task.description}</div>
              </div>

              {/* Category */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Category</h3>
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                  {task.category ?? "Uncategorized"}
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Reward</h3>
                <div className="flex items-center gap-2">
                  <Image src={eth} alt="ETH" width={20} height={20} className="w-5 h-5" />
                  <span className="text-lg font-bold text-gray-600">{Number(task.reward) / 1e18}</span>
                  <span className="text-sm text-gray-500">ETH</span>
                </div>
              </div>

              {/* Posted By */}
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Posted by</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-blue-600 break-all">{truncateAddress(task.poster)}</span>
                  <ExternalLink className="w-6 h-6" />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {taskStatus(Number(task.status)) === "OPEN" && task.poster !== address && (
                <button
                  onClick={
                    () => applyTask((taskId as any))
                  }
                  disabled={isPendingTask || isConfirmingTask || isSuccessTask}
                  className={`w-full py-3 px-4 rounded-2xl font-semibold text-base transition-colors ${
                    !isConnected
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : isPendingTask || isConfirmingTask || isSuccessTask
                      ? "bg-orange-400 text-white cursor-not-allowed"
                      : "bg-orange-500 hover:bg-orange-600 text-white cursor-pointer"
                  }`}
                >
                  {!isConnected ? "Connect Wallet to Apply" : isPendingTask || isConfirmingTask ? "Applying..." : isSuccessTask ? "Applied Successfully ✓" : "Apply For This Gig"}
                </button>
                )}

                {(taskStatus(Number(task.status)) === "ASSIGNED" || taskStatus(Number(task.status)) === "IN_PROGRESS" ) && task.completer == address && (
                  <button
                  onClick={()=> setShowSubmissionModal(true)}
                  disabled={isPendingTask || isConfirmingTask || isSuccessSubmit}
                  className={`w-full py-3 px-4 rounded-2xl font-semibold text-base transition-colors ${
                      isPendingSubmit || isConfirmingSubmit || isSuccessSubmit
                      ? "bg-orange-400 text-white cursor-not-allowed"
                      : "bg-green-500 hover:bg-orange-600 text-white cursor-pointer"
                  }`}
                >
                  {isPendingSubmit || isConfirmingSubmit ? "Submitting..." : isSuccessSubmit ? "Submitted Successfully ✓" : "Submit Work"}
                </button>
                )}

                <button
                  onClick={handleShare}
                  className="w-full py-3 px-4 rounded-2xl font-semibold text-base border border-gray-500 text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Share the Gig
                </button>
              </div>

              {!isConnected && (
                <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-sm text-orange-800">
                    Connect your wallet to apply for this gig and start earning!
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {/* Application Success Modal */}
      <ApplicationSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        timeRemaining={`${daysFromNow(task?.deadline)} days`}
        onViewGig={() => {
          setShowSuccessModal(false)
        }}
        onMessageOwner={() => {
          setShowSuccessModal(false)
          toast.success("Messaging feature coming soon!")
        }}
      />

      <SubmitTaskModal
        isOpen={showSubmissionModal}
        onClose={() => setShowSubmissionModal(false)}
        taskAddress={task?.taskAddress}
        title="Submit Task"
        placeholder="Details here..."
        submitText="Submit"
        cancelText="Cancel"
        maxLength={500}
      />
    </MobileNavLayout>
  )
}
