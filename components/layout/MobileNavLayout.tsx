"use client"

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { Home, Bell, CirclePlus, MessageCircle, Settings } from 'lucide-react'
import Link from 'next/link'

interface LayoutProps {
  children: ReactNode
}

interface NavItem {
  href: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  badge?: number
}

const navItems: NavItem[] = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/notifications', icon: Bell, label: 'Notification', badge: 3 },
  { href: '/create', icon: CirclePlus, label: 'Create Task' },
  { href: '/chat', icon: MessageCircle, label: 'Chat', badge: 2 },
  { href: '/more', icon: Settings, label: 'More' },
]

export function MobileNavLayout({ children }: LayoutProps) {
  const pathname = usePathname()
  
  const hideNavbar = pathname === '/onboarding' || pathname === '/splash'
  
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      {/* Main Content */}
      <main className={`flex-1 ${!hideNavbar ? 'pb-20' : ''}`}>
        {children}
      </main>
      
      {/* Bottom Navigation */}
      {!hideNavbar && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg">
          <div className="flex items-center justify-around px-4 py-2 max-w-md mx-auto">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.href}
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
              )
            })}
          </div>
          
          {/* Safe area for iPhone home indicator */}
          <div className="h-safe-bottom bg-white/95" />
        </nav>
      )}
    </div>
  )
}

// Header component for pages that need it
interface MobileHeaderProps {
  title?: string
  showBack?: boolean
  rightAction?: ReactNode
  className?: string
}

export function MobileHeader({ 
  title, 
  showBack = false, 
  rightAction, 
  className = "" 
}: MobileHeaderProps) {
  return (
    <header className={`sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 ${className}`}>
      <div className="flex items-center justify-between px-4 py-3 max-w-md mx-auto">
        <div className="flex items-center gap-3">
          {showBack && (
            <button 
              onClick={() => window.history.back()}
              className="p-2 -ml-2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          {title && (
            <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
          )}
        </div>
        
        {rightAction && (
          <div className="flex items-center">
            {rightAction}
          </div>
        )}
      </div>
    </header>
  )
}