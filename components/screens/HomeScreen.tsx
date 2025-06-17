"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { useMiniKit, useAddFrame, useOpenUrl } from "@coinbase/onchainkit/minikit"
import { Name, Identity, Address, Avatar, EthBalance } from "@coinbase/onchainkit/identity"
import { ConnectWallet, Wallet, WalletDropdown, WalletDropdownDisconnect } from "@coinbase/onchainkit/wallet"
import { Search } from "lucide-react"
import Image from "next/image"
import { useRouter } from 'next/navigation'
import abstract from "../../public/waving-orange.png"
import logo from "../../public/microgigs-logo.svg"
import usdc from "../../public/USDC.svg"
import { MobileNavLayout } from "../layout/MobileNavLayout" 

const categories = [
  { id: "all", name: "All"},
  { id: "development", name: "Development"},
  { id: "design", name: "Design"},
  { id: "content", name: "Content" },
  { id: "marketing", name: "Marketing"},
  { id: "other", name: "Other"}
]

// Username Modal Component
interface UsernameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  username: string;
  setUsername: (username: string) => void;
}

const UsernameModal = ({ isOpen, onClose, onSave, username, setUsername }: UsernameModalProps) => {
  if (!isOpen) return null;

  const handleSave = () => {
    if (!username.trim()) {
      alert("Please enter a username")
      return
    }
    localStorage.setItem('microgigs_username', username)
    onSave()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Close button */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
          >
            <span className="text-gray-600 text-lg">×</span>
          </button>
        </div>

        {/* Hero Image */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={abstract}
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
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Pick A Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Pick a really cool Name..."
              className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-gray-700 placeholder-gray-400"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={!username.trim()}
            className={`w-full font-semibold py-4 px-4 rounded-xl transition-colors text-base ${
              !username.trim() 
                ? "bg-gray-300 text-gray-600 cursor-not-allowed" 
                : "bg-orange-500 hover:bg-orange-600 text-white cursor-pointer"
            }`}
          >
            Continue to Wallet Connection
          </button>

          <div className="text-center mt-6 space-y-2">
            <p className="text-xs text-gray-500">
              By using MicroGigs, you accept our{' '}
              <span className="text-blue-600 underline">Terms of Use</span> and{' '}
              <span className="text-blue-600 underline">Privacy Policy</span>,
              ensuring a safe and transparent experience.
            </p>
            
            <p className="text-xs text-gray-500 mt-4">
              Talk to the team at{' '}
              <span className="text-blue-600 underline">support@microgigs.com</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Function to truncate wallet address
const truncateAddress = (address: string | undefined): string => {
  if (!address) return ""
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export default function SimpleConnectScreen() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showUsernameModal, setShowUsernameModal] = useState(false)
  const [username, setUsername] = useState("")
  const [isFarcasterFrame, setIsFarcasterFrame] = useState(false)
  const [isEmbedded, setIsEmbedded] = useState(false)
  const [hasUsername, setHasUsername] = useState(false)
  
  const { address, isConnected } = useAccount()
  const { setFrameReady, isFrameReady, context } = useMiniKit()

  // Function to navigate to profile page
  const navigateToProfile = () => {
    router.push('/profile')
  }

  // Detect if running in Farcaster frame or embedded environment
  useEffect(() => {
    const search = window.location.search
    const isFC = search.includes('fc_user') || search.includes('frame_id')
    const isFrame = window !== window.parent

    setIsFarcasterFrame(isFC)
    setIsEmbedded(isFrame)
  }, [])

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady()
    }
  }, [setFrameReady, isFrameReady])

  // Load saved username on mount
  useEffect(() => {
    const savedUsername = localStorage.getItem('microgigs_username')
    if (savedUsername) {
      setUsername(savedUsername)
      setHasUsername(true)
    }
  }, [])

  // When user connects and has username, mark onboarding complete
  useEffect(() => {
    if (isConnected && address && hasUsername) {
      localStorage.setItem('microgigs_onboarding_complete', 'true')
      localStorage.setItem('microgigs_wallet_address', address)
      console.log("Wallet connected successfully!", address)
    }
  }, [isConnected, address, hasUsername])

  const handleConnectClick = () => {
    if (!hasUsername) {
      setShowUsernameModal(true)
    }
    // If user has username, the ConnectWallet component will handle the connection
  }

  const handleUsernameSaved = () => {
    setHasUsername(true)
  }

  return (
    <MobileNavLayout>
      <div className="min-h-screen bg-white text-gray-900">
        {/* Header */}
        <div className="px-4 pt-12 pb-6 bg-white">
          {/* Logo centered and Profile section on the left */}
          <div className="mb-6">
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
            
            {/* Profile section under logo (left aligned) */}
            {!isConnected ? (
              <div className="flex items-center gap-2">
                {!hasUsername ? (
                  <button
                    onClick={handleConnectClick}
                    className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    Get Started
                  </button>
                ) : (
                  <Wallet>
                    <ConnectWallet className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors">
                      Connect Wallet
                    </ConnectWallet>
                  </Wallet>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {/* Profile picture - now clickable */}
                <div 
                  className="w-8 h-8 rounded-full overflow-hidden bg-red-500 flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors"
                  onClick={navigateToProfile}
                  title="Go to Profile"
                >
                  <span className="text-white text-sm font-medium">
                    {username.charAt(0).toUpperCase() || 'G'}
                  </span>
                </div>
                
                {/* Username and address */}
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">
                    {username || 'Gm, Weng'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {truncateAddress(address)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Greeting text */}
          {isConnected && (
            <div className="mb-4">
              <p className="text-gray-500 text-sm">What are we making today?</p>
            </div>
          )}

          {/* Search Bar */}
          <div className="relative mb-6">
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
          
          {/* Border bottom after search bar */}
          <div className="border-b border-gray-200"></div>
        </div>

        <div className="px-4">
          {/* Section Title */}
          <h2 className="text-sm font-semibold mb-4 text-gray-900">Discover Opportunities</h2>

          {/* Tabs */}
          <div className="flex gap-6 mb-6 border-b border-gray-200">
            <button className="text-orange-500 text-sm font-medium pb-2 border-b-2 border-orange-500">
              Browse
            </button>
            <button className="text-gray-500 text-sm font-medium pb-2">
              My tasks
            </button>
            <button className="text-gray-500 text-sm font-medium pb-2">
              Tasks Applied
            </button>
          </div>

          {/* Category Pills */}
          <div className="flex gap-3 overflow-x-auto pb-2 mb-6 hide-scrollbar">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span className="font-medium text-xs">{category.name}</span>
              </button>
            ))}
          </div>

          {/* Task List - Empty state */}
          <div className="space-y-4 pb-24">
            {/* Empty state message */}
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks available</h3>
              <p className="text-gray-500 text-sm">Check back later for new opportunities or try adjusting your filters.</p>
            </div>
          </div>
        </div>

        {/* Username Modal */}
        <UsernameModal
          isOpen={showUsernameModal}
          onClose={() => setShowUsernameModal(false)}
          onSave={handleUsernameSaved}
          username={username}
          setUsername={setUsername}
        />
      </div>
    </MobileNavLayout>
  )
}