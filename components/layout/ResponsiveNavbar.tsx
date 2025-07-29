"use client"

import { ReactNode, useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Home, Bell, CirclePlus, MessageCircle, Settings } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useAccount } from "wagmi"
import { ConnectWallet, Wallet, WalletDropdown, WalletDropdownDisconnect } from "@coinbase/onchainkit/wallet"
import { Name, Identity, Address, Avatar, EthBalance } from "@coinbase/onchainkit/identity"
import { truncateAddress } from "@/lib/utils"
import logo from "../../public/microgigs-logo.svg"
import DesktopFooter from './DesktopFooter'
import CreateGigModal from '../../components/modals/CreateGigModal'

interface ResponsiveNavbarProps {
  children: ReactNode
  username?: string
  hasUsername?: boolean
  handleGetStartedClick?: () => void
}

interface NavItem {
  href?: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  badge?: number
  onClick?: () => void
}

// Desktop Navigation Header
const DesktopHeader = ({ 
  username, 
  hasUsername, 
  handleGetStartedClick,
  onCreateTaskClick
}: {
  username?: string
  hasUsername?: boolean
  handleGetStartedClick?: () => void
  onCreateTaskClick: () => void
}) => {
  const { address, isConnected } = useAccount()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleProfileClick = () => {
    router.push('/profile')
  }

  // Prevent hydration errors by not rendering wallet-dependent content until mounted
  if (!mounted) {
    return (
      <header className="hidden lg:block bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src={logo}
              alt="MicroGigs Logo"
              width={120}
              height={32}
              className="h-8 w-auto object-contain"
            />
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Home
            </Link>
            <Link href="/tasks" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Tasks
            </Link>
            <Link href="/community" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Community
            </Link>
            <Link href="/resources" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Resources
            </Link>
          </nav>

          {/* Loading state for right side */}
          <div className="flex items-center gap-4">
            <div className="w-32 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="hidden lg:block bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src={logo}
            alt="MicroGigs Logo"
            width={120}
            height={32}
            className="h-8 w-auto object-contain"
          />
        </Link>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          <Link href="/" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
            Home
          </Link>
          <Link href="/tasks" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
            Tasks
          </Link>
          <Link href="/community" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
            Community
          </Link>
          <Link href="/resources" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
            Resources
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {!isConnected ? (
            <div className="flex items-center gap-3">
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
            <div className="flex items-center gap-4">
              <button
                onClick={onCreateTaskClick}
                className="px-6 py-3 rounded-xl text-white font-medium shadow-lg hover:shadow-xl active:shadow-inner transition-all duration-200 inline-block"
                style={{
                  background: 'linear-gradient(to bottom, #FF6D47, #FF3C02)'
                }}
              >
                Create New Task
              </button>
              
              <Wallet className="z-10">
                <div 
                  className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center cursor-pointer hover:bg-red-700 transition-colors"
                  onClick={handleProfileClick}
                >
                  <span className="text-white text-sm font-medium">
                    {username?.charAt(0).toUpperCase() || "W"}
                  </span>
                </div>
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
        </div>
      </div>
    </header>
  )
}

// Mobile Bottom Navigation
const MobileBottomNav = ({ 
  navItems, 
  onCreateTaskClick 
}: { 
  navItems: NavItem[]
  onCreateTaskClick: () => void 
}) => {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const hideNavbar = pathname === '/onboarding' || pathname === '/splash'
  
  if (hideNavbar || !mounted) return null

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg z-50">
      <div className="flex items-center justify-around px-4 py-2 max-w-md mx-auto">
        {navItems.map((item, index) => {
          const Icon = item.icon
          const isActive = item.href ? pathname === item.href : false
          
          return (
            item.href ? (
              <Link
                key={item.href || index}
                href={item.href}
                className={`relative flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 rounded-lg transition-colors ${
                  isActive 
                    ? 'text-orange-500' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-xs mt-0.5 font-medium">{item.label}</span>
              </Link>
            ) : (
              <button
                key={item.href || index}
                onClick={item.onClick || (() => {})}
                className={`relative flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 rounded-lg transition-colors ${
                  isActive 
                    ? 'text-orange-500' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-xs mt-0.5 font-medium">{item.label}</span>
              </button>
            )
          )
        })}
      </div>
      
      {/* Safe area for iPhone home indicator */}
      <div className="h-safe-bottom bg-white/95" />
    </nav>
  )
}

export default function ResponsiveNavbar({ 
  children, 
  username, 
  hasUsername, 
  handleGetStartedClick 
}: ResponsiveNavbarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const hideNavbar = pathname === '/onboarding' || pathname === '/splash'
  
  // Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleCreateTaskClick = () => {
    setIsCreateModalOpen(true)
  }

  const handleCreateTaskSuccess = () => {
    // Optional: Add any success handling logic here
    // For example, you could refresh a task list or show a notification
    console.log('Task created successfully!')
  }

  // Define nav items with the create task action
  const navItems: NavItem[] = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/notifications', icon: Bell, label: 'Notification', badge: 3 },
    { icon: CirclePlus, label: 'Create Task', onClick: handleCreateTaskClick },
    { href: '/chat', icon: MessageCircle, label: 'Chat', badge: 2 },
    { href: '/profile', icon: Settings, label: 'More' },
  ]

  // Don't render anything until mounted to prevent hydration errors
  if (!mounted) {
    return (
      <div className="min-h-screen bg-white text-gray-900 flex flex-col">
        <main className="flex-1">
          {children}
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* Desktop Header */}
      {!hideNavbar && (
        <DesktopHeader 
          username={username}
          hasUsername={hasUsername}
          handleGetStartedClick={handleGetStartedClick}
          onCreateTaskClick={handleCreateTaskClick}
        />
      )}

      {/* Main Content */}
      <main className={`flex-1 ${!hideNavbar ? 'lg:pb-0 pb-20' : ''}`}>
        {children}
      </main>

      {/* Desktop Footer - Import the separate component */}
      {!hideNavbar && <DesktopFooter />}

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav 
        navItems={navItems}
        onCreateTaskClick={handleCreateTaskClick}
      />

      {/* Create Gig Modal */}
      <CreateGigModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateTaskSuccess}
      />
    </div>
  )
}