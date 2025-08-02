// app/home/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { useMiniKit } from "@coinbase/onchainkit/minikit"
import { ConnectWallet, Wallet, WalletDropdown, WalletDropdownDisconnect } from "@coinbase/onchainkit/wallet"
import { Name, Identity, Address, Avatar, EthBalance } from "@coinbase/onchainkit/identity"
import { Search } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import logo from "../../public/microgigs-logo.svg"
import type { Task } from "@/models/types"
import { useAllTasks } from "@/hooks/useGetAllTasks"
import { taskStatus, truncateAddress, daysFromNow } from "@/lib/utils"
import SearchBar from "@/components/ui/search-bar"
import WelcomeModal from "../../components/modals/WelcomeModal"
import ResponsiveNavbar from "../../components/layout/ResponsiveNavbar"
import { Button } from "@/components/ui/button"
import TaskRewardDisplay from "@/components/TaskRewardDisplay"
import {useGetUncompletedTasks} from "@/hooks/useGetUncompletedTasks";

const categories = [
  { id: "all", name: "All" },
  { id: "development", name: "Development" },
  { id: "design", name: "Design" },
  { id: "content", name: "Content" },
  { id: "marketing", name: "Marketing" },
  { id: "other", name: "Other" },
]

export default function UnifiedHomePage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  const [username, setUsername] = useState("")
  const [hasUsername, setHasUsername] = useState(false)
  const [activeTab, setActiveTab] = useState<"browse"| "available-tasks" | "my-tasks" | "tasks-applied">("browse")
  const [mounted, setMounted] = useState(false)

  const { address, isConnected } = useAccount()
  const { setFrameReady, isFrameReady } = useMiniKit()

  const { tasks, loading, error } = useAllTasks(
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
  )

  const filteredTasks = selectedCategory === "all" ? tasks : tasks.filter((task) => task.category === selectedCategory)

  const {
    tasks: uncompletedTasks,
    loading: uncompletedLoading,
    error: uncompletedError,
    refresh: refreshUncompleted
  } = useGetUncompletedTasks(
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
  )

  const getTasksForTab = () => {
    switch (activeTab) {
      case "browse":
        return selectedCategory === "all"
            ? tasks
            : tasks.filter(task => task.category === selectedCategory)
      case "available-tasks":
        return uncompletedTasks
      case "my-tasks":
        return tasks.filter(task => task.owner === address)
      case "tasks-applied":
        return tasks.filter(task => task.assignee === address)
      default:
        return []
    }
  }

  const tasksToShow = getTasksForTab()
  const isLoadingForTab = activeTab === "available-tasks"
      ? uncompletedLoading
      : loading

  // Prevent hydration errors by ensuring client-side only rendering
  useEffect(() => {
    setMounted(true)
  }, [])

  // Debug logging
  console.log("Debug Info:", {
    totalTasks: tasks.length,
    filteredTasks: filteredTasks.length,
    selectedCategory,
    loading,
    error,
    contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
  })

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady()
    }
  }, [setFrameReady, isFrameReady])

  useEffect(() => {
    if (mounted) {
      const savedUsername = localStorage.getItem("microgigs_username")
      if (savedUsername) {
        setUsername(savedUsername)
        setHasUsername(true)
      }
    }
  }, [mounted])

  useEffect(() => {
    if (mounted && isConnected && address && hasUsername) {
      localStorage.setItem("microgigs_onboarding_complete", "true")
      localStorage.setItem("microgigs_wallet_address", address)
      console.log("Wallet connected successfully!", address)
    }
  }, [mounted, isConnected, address, hasUsername])

  const handleGetStartedClick = () => {
    if (!hasUsername) {
      setShowWelcomeModal(true)
    }
  }

  const handleUsernameSaved = () => {
    setHasUsername(true)
  }

  // Don't render wallet-dependent content until mounted
  if (!mounted) {
    return (
        <ResponsiveNavbar
            username=""
            hasUsername={false}
            handleGetStartedClick={() => {}}
        >
          {/* Loading skeleton */}
          <div className="min-h-screen bg-gray-100">
            <div className="hidden lg:block max-w-7xl mx-auto px-6 py-8">
              <div className="grid grid-cols-12 gap-8">
                <div className="col-span-8">
                  <div className="bg-gray-200 rounded-2xl h-64 mb-8 animate-pulse"></div>
                  <div className="space-y-4">
                    <div className="bg-gray-200 rounded-xl h-32 animate-pulse"></div>
                    <div className="bg-gray-200 rounded-xl h-32 animate-pulse"></div>
                    <div className="bg-gray-200 rounded-xl h-32 animate-pulse"></div>
                  </div>
                </div>
                <div className="col-span-4">
                  <div className="bg-gray-200 rounded-xl h-48 mb-6 animate-pulse"></div>
                  <div className="bg-gray-200 rounded-xl h-48 animate-pulse"></div>
                </div>
              </div>
            </div>
            <div className="lg:hidden px-4 py-8">
              <div className="space-y-4">
                <div className="bg-gray-200 rounded-xl h-20 animate-pulse"></div>
                <div className="bg-gray-200 rounded-xl h-20 animate-pulse"></div>
                <div className="bg-gray-200 rounded-xl h-20 animate-pulse"></div>
              </div>
            </div>
          </div>
        </ResponsiveNavbar>
    )
  }

  return (
      <ResponsiveNavbar
          username={username}
          hasUsername={hasUsername}
          handleGetStartedClick={handleGetStartedClick}
      >
        {/* Desktop Layout */}
        <div className="hidden lg:block max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-12 gap-8">
            {/* Main Content */}
            <div className="col-span-8">
              {/* Hero Section */}
              <div
                  className="rounded-2xl p-8 mb-8 text-white relative overflow-hidden"
                  style={{
                    background: `
                  radial-gradient(circle at top right, #FF3C02 0%, rgba(255, 60, 2, 0.6) 15%, rgba(255, 60, 2, 0.2) 25%, transparent 35%),
                  radial-gradient(circle at bottom left, #FF3C02 0%, rgba(255, 60, 2, 0.6) 15%, rgba(255, 60, 2, 0.2) 25%, transparent 35%),
                  #000000
                `
                  }}
              >
                <div className="relative z-10">
                  <h1 className="text-3xl font-bold mb-2">
                    GM {username || "Weng"} 👋
                  </h1>
                  <p className="text-xl mb-6">What are we making today?</p>
                  <p className="text-white/90 mb-8">
                    MicroGigs connects you to a global network of talent for decentralized microtasks.
                  </p>

                  <div className="flex gap-4">
                    <div className="flex-1 relative">
                      <input
                          type="text"
                          placeholder="Ask your AI assistant anything"
                          className="w-full px-4 py-3 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                      />
                    </div>
                    <button
                        className="px-6 py-3 rounded-xl text-white font-medium shadow-lg hover:shadow-xl active:shadow-inner transition-all duration-200"
                        style={{
                          background: 'linear-gradient(to bottom, #FF6D47, #FF3C02)'
                        }}
                    >
                      Answer me
                    </button>
                  </div>
                </div>
              </div>

              {/* Discover Opportunities */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Discover Opportunities</h2>

                {/* Tabs */}
                <div className="flex gap-8 mb-6 border-b border-gray-200">
                  <button
                      onClick={() => setActiveTab("browse")}
                      className={`text-lg font-medium pb-4 transition-colors ${
                          activeTab === "browse"
                              ? "text-orange-500 border-b-2 border-orange-500"
                              : "text-gray-500 hover:text-gray-700"
                      }`}
                  >
                    Browse
                  </button>
                  <button
                      onClick={() => setActiveTab("available-tasks")}
                      className={`text-lg font-medium pb-4 transition-colors ${
                          activeTab === "available-tasks"
                              ? "text-orange-500 border-b-2 border-orange-500"
                              : "text-gray-500 hover:text-gray-700"
                      }`}
                  >
                    Available tasks
                  </button>
                  <button
                      onClick={() => setActiveTab("my-tasks")}
                      className={`text-lg font-medium pb-4 transition-colors ${
                          activeTab === "my-tasks"
                              ? "text-orange-500 border-b-2 border-orange-500"
                              : "text-gray-500 hover:text-gray-700"
                      }`}
                  >
                    My tasks
                  </button>
                  <button
                      onClick={() => setActiveTab("tasks-applied")}
                      className={`text-lg font-medium pb-4 transition-colors ${
                          activeTab === "tasks-applied"
                              ? "text-orange-500 border-b-2 border-orange-500"
                              : "text-gray-500 hover:text-gray-700"
                      }`}
                  >
                    Tasks Applied
                  </button>
                </div>

                {/* Category Pills */}
                {activeTab === "browse" && (
                    <div className="flex gap-4 mb-8">
                      {categories.map((category) => (
                          <button
                              key={category.id}
                              onClick={() => setSelectedCategory(category.id)}
                              className={`px-4 py-2 rounded-full transition-colors ${
                                  selectedCategory === category.id
                                      ? "bg-orange-500 text-white"
                                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                          >
                            {category.name}
                          </button>
                      ))}
                    </div>
                )}

                {/* Task Grid */}
                <div className="grid grid-cols-1 gap-6">
                  {loading || isLoadingForTab ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center animate-pulse">
                          <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500">Loading opportunities...</p>
                      </div>
                  ) : error ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                          <Search className="w-8 h-8 text-red-400" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">Error loading tasks</h3>
                        <p className="text-gray-500 mb-4">
                          {typeof error === 'string' ? error : error?.message || "Something went wrong while fetching tasks"}
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="text-orange-500 hover:text-orange-600 font-medium"
                        >
                          Try again
                        </button>
                      </div>
                  ) : tasksToShow.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                          <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">
                          {activeTab === "my-tasks"
                              ? "No tasks created"
                              : activeTab === "tasks-applied"
                                  ? "No tasks applied to"
                                  : tasks.length === 0
                                      ? "No tasks available"
                                      : `No ${selectedCategory} tasks`
                          }
                        </h3>
                        <p className="text-gray-500">
                          {activeTab === "my-tasks"
                              ? "You haven't created any tasks yet. Start by posting a new task."
                              : activeTab === "tasks-applied"
                                  ? "You haven't applied to any tasks yet. Browse available tasks to get started."
                                  : tasks.length === 0
                                      ? "Check back later for new opportunities or try refreshing the page."
                                      : `Try selecting "All" or a different category to see more tasks.`
                          }
                        </p>
                        {activeTab === "browse" && tasks.length > 0 && selectedCategory !== "all" && (
                            <button
                                onClick={() => setSelectedCategory("all")}
                                className="mt-4 text-orange-500 hover:text-orange-600 font-medium"
                            >
                              Show all tasks
                            </button>
                        )}
                        {activeTab === "my-tasks" && (
                            <button
                                onClick={() => router.push("/create-task")} // Adjust this route as needed
                                className="mt-4 px-6 py-3 rounded-xl text-white font-medium shadow-lg hover:shadow-xl active:shadow-inner transition-all duration-200"
                                style={{
                                  background: 'linear-gradient(to bottom, #FF6D47, #FF3C02)'
                                }}
                            >
                              Create Your First Task
                            </button>
                        )}
                      </div>
                  ) : (
                      tasksToShow.map((task) => {
                        // Debug each task
                        console.log("Rendering task:", {
                          id: task.taskAddress,
                          title: task.title,
                          status: task.status,
                          statusParsed: taskStatus(task.status),
                          category: task.category
                        })

                        // Show ALL tasks, not just OPEN ones for debugging
                        return (
                            <div
                                key={task.taskAddress}
                                className="flex items-start gap-4 p-6 border border-gray-200 rounded-xl cursor-pointer hover:border-orange-200 hover:shadow-md transition-all"
                                onClick={() => router.push(`/gig/${task.taskAddress}`)}
                            >
                              {/* Task Image */}
                              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                <Image
                                    src="/gig-placeholder.png"
                                    alt="Task thumbnail"
                                    width={64}
                                    height={64}
                                    className="w-full h-full object-cover"
                                />
                              </div>

                              {/* Task Content */}
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <h3 className="font-semibold text-lg text-gray-900">{task.title}</h3>
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                      taskStatus(task.status) === "OPEN"
                                          ? "bg-green-100 text-green-800"
                                          : "bg-gray-100 text-gray-800"
                                  }`}>
                              {taskStatus(task.status)}
                            </span>
                                </div>

                                <div className="flex items-center gap-2 mb-3">
                                  <span className="text-sm text-gray-500">Task By</span>
                                  <span className="text-sm font-medium text-gray-700">{truncateAddress(task.owner)}</span>
                                  <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                                  <span className="text-xs text-gray-500">Category: {task.category || "other"}</span>
                                </div>

                                <TaskRewardDisplay task={task}  />
                              </div>
                            </div>
                        )
                      })
                  )}
                </div>

                {/* View More */}
                {filteredTasks.length > 10 && (
                    <div className="text-center mt-8">
                      <button className="text-orange-500 hover:text-orange-600 font-medium">
                        View more →
                      </button>
                    </div>
                )}
              </div>
            </div>

            {/* Desktop Sidebar */}
            <div className="col-span-4">
              {/* User Stats */}
              {isConnected && (
                  <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
                        <span className="text-white font-medium">{username.charAt(0).toUpperCase() || "W"}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{username || "Weng Ibrahim"}</h3>
                        <p className="text-sm text-gray-500">Member since Oct 2024</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">24</p>
                        <p className="text-sm text-gray-500">Task Complete</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">24</p>
                        <p className="text-sm text-gray-500">Task Posted</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">24</p>
                        <p className="text-sm text-gray-500">Total Spent</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">24</p>
                        <p className="text-sm text-gray-500">Total Earned</p>
                      </div>
                    </div>
                  </div>
              )}

              {/* Chats */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Chats</h3>
                  <button className="text-orange-500 text-sm">View All</button>
                </div>

                <div className="space-y-3">
                  {[
                    { name: "RandomG", time: "11m", message: "Send the updated wallet address" },
                    { name: "DemmyGod", time: "8m", message: "Are you done with the fixes?" },
                    { name: "Sanctumofficial", time: "16h", message: "What is taking so long bro?" },
                  ].map((chat, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900">{chat.name}</span>
                            <span className="text-xs text-gray-500">{chat.time}</span>
                          </div>
                          <p className="text-xs text-gray-600 truncate">{chat.message}</p>
                        </div>
                      </div>
                  ))}
                </div>
              </div>

              {/* Notifications */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  <button className="text-orange-500 text-sm">View All</button>
                </div>

                <div className="space-y-3">
                  {[
                    { amount: "230 USDC", action: "Received", time: "1m" },
                    { amount: "230 USDC", action: "Received", time: "9m" },
                    { amount: "230 USDC", action: "Received", time: "12m" },
                  ].map((notification, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center">
                          <div className="w-4 h-4 bg-blue-500 rounded"></div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{notification.amount} {notification.action}</p>
                          <p className="text-xs text-gray-500">TaskMaybe just approved your task</p>
                        </div>
                        <span className="text-xs text-gray-500">{notification.time}</span>
                      </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          {/* Mobile Header */}
          <div className="px-4 pt-12 pb-6 bg-white">
            {/* Logo centered */}
            <div className="flex justify-center items-center mb-3">
              <Image
                  src={logo}
                  alt="MicroGigs Logo"
                  width={120}
                  height={32}
                  className="h-8 w-auto object-contain"
              />
            </div>

            {/* Profile section */}
            {!isConnected ? (
                <div className="flex items-center gap-2 mb-4">
                  {!hasUsername ? (
                      <button
                          onClick={handleGetStartedClick}
                          className="px-6 py-3 rounded-xl text-white font-medium shadow-lg hover:shadow-xl active:shadow-inner transition-all duration-200"
                          style={{
                            background: 'linear-gradient(to bottom, #FF6D47, #FF3C02)'
                          }}
                      >
                        Get Started
                      </button>
                  ) : (
                      <div
                          className="rounded-xl shadow-lg hover:shadow-xl active:shadow-inner transition-all duration-200"
                          style={{
                            background: 'linear-gradient(to bottom, #FF6D47, #FF3C02)'
                          }}
                      >
                        <Wallet>
                          <ConnectWallet className="!bg-transparent !shadow-none !border-none !text-white !px-6 !py-3 !rounded-xl font-medium">
                            Connect Wallet
                          </ConnectWallet>
                        </Wallet>
                      </div>
                  )}
                </div>
            ) : (
                <div className="flex items-center gap-3 mb-4">
                  <Wallet className="z-10">
                    <ConnectWallet className="bg-gradient-to-r from-[#FF3C02] to-[#FF6D47] text-white py-3 px-6 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-white flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors">
                        <span className="text-black text-sm font-medium">{username.charAt(0).toUpperCase() || "G"}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">{`Gm, ${username}` || "Gm, Weng"}</span>
                        <span className="text-xs text-white">{truncateAddress(address)}</span>
                      </div>
                    </ConnectWallet>
                    <WalletDropdown>
                      <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                        <Avatar />
                        <Name />
                        <Address />
                        <EthBalance />
                      </Identity>
                      <WalletDropdownDisconnect />
                    </WalletDropdown>
                  </Wallet>
                </div>
            )}

            {/* Greeting text */}
            {isConnected && (
                <div className="mb-4">
                  <p className="text-gray-500 text-sm">What are we making today?</p>
                </div>
            )}

            {/* Search Bar */}
            <SearchBar />

            {/* Border bottom after search bar */}
            <div className="border-b border-gray-200"></div>
          </div>

          {/* Mobile Content */}
          <div className="px-4">
            {/* Section Title */}
            <h2 className="text-sm font-semibold mb-4 text-gray-900">Discover Opportunities</h2>

            {/* Tabs */}
            <div className="flex gap-6 mb-6 border-b border-gray-200">
              <button
                  onClick={() => setActiveTab("browse")}
                  className={`text-sm font-medium pb-2 transition-colors ${
                      activeTab === "browse"
                          ? "text-orange-500 border-b-2 border-orange-500"
                          : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                Browse
              </button>
              <button
                  onClick={() => setActiveTab("available-tasks")}
                  className={`text-sm font-medium pb-2 transition-colors ${
                      activeTab === "available-tasks"
                          ? "text-orange-500 border-b-2 border-orange-500"
                          : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                Available Tasks
              </button>
              <button
                  onClick={() => setActiveTab("my-tasks")}
                  className={`text-sm font-medium pb-2 transition-colors ${
                      activeTab === "my-tasks"
                          ? "text-orange-500 border-b-2 border-orange-500"
                          : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                My tasks
              </button>
              <button
                  onClick={() => setActiveTab("tasks-applied")}
                  className={`text-sm font-medium pb-2 transition-colors ${
                      activeTab === "tasks-applied"
                          ? "text-orange-500 border-b-2 border-orange-500"
                          : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                Tasks Applied
              </button>
            </div>

            {/* Category Pills */}
            {activeTab === "browse" && (
                <div className="flex gap-3 overflow-x-auto pb-2 mb-6 hide-scrollbar">
                  {categories.map((category) => (
                      <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${
                              selectedCategory === category.id
                                  ? "bg-orange-500 text-white"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                      >
                        <span className="font-medium text-xs">{category.name}</span>
                      </button>
                  ))}
                </div>
            )}

            {/* Mobile Task List */}
            <div className="space-y-4 pb-24">
              {loading ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center animate-pulse">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm">Loading opportunities...</p>
                  </div>
              ) : tasksToShow.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks available</h3>
                    <p className="text-gray-500 text-sm">
                      Check back later for new opportunities or try adjusting your filters.
                    </p>
                  </div>
              ) : (
                  <>
                    {tasksToShow.slice(0, 10).map((task) => (
                        <div
                            key={task.taskAddress}
                            className="flex items-start gap-3 p-0 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
                            onClick={() => router.push(`/gig/${task.taskAddress}`)}
                        >
                          {/* Task Image */}
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            <Image
                                src="/gig-placeholder.png"
                                alt="Task thumbnail"
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Task Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-medium text-sm text-gray-900 line-clamp-2 flex-1 mr-2">{task.title}</h3>
                              <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                                  taskStatus(task.status) === "OPEN"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-gray-100 text-gray-800"
                              }`}>
                          {taskStatus(task.status)}
                        </span>
                            </div>

                            <div className="flex items-center gap-1 mb-1">
                              <span className="text-xs text-gray-500">Task By</span>
                              <span className="text-xs font-medium text-gray-700">{truncateAddress(task.owner)}</span>
                              <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                            </div>

                            <div className="mb-2">
                              <span className="text-xs text-gray-500">Category: {task.category || "other"}</span>
                            </div>

                            {/* Mobile version of TaskRewardDisplay - compact version */}
                            <div className="flex items-center justify-between">
                              <TaskRewardDisplay
                                  task={task}

                                  compact={true}
                              />
                            </div>
                          </div>
                        </div>
                    ))}

                    {/* View More Button */}
                    {filteredTasks.length > 5 && (
                        <div className="pt-4">
                          <button className="w-full py-3 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                            View more
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                              <path fill="currentColor" d="M17.92 11.62a1 1 0 0 0-.21-.33l-5-5a1 1 0 0 0-1.42 1.42l3.3 3.29H7a1 1 0 0 0 0 2h7.59l-3.3 3.29a1 1 0 0 0 0 1.42a1 1 0 0 0 1.42 0l5-5a1 1 0 0 0 .21-.33a1 1 0 0 0 0-.76"/>
                            </svg>
                          </button>
                        </div>
                    )}
                  </>
              )}
            </div>
          </div>
        </div>

        {/* Welcome Modal */}
        <WelcomeModal
            isOpen={showWelcomeModal}
            onClose={() => setShowWelcomeModal(false)}
            onSave={handleUsernameSaved}
            username={username}
            setUsername={setUsername}
        />
      </ResponsiveNavbar>
  )
}