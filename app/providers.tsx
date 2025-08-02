"use client";

import { type ReactNode, useState, useEffect } from "react";
import { http, createConfig, WagmiProvider } from 'wagmi'
import { baseSepolia } from "wagmi/chains";
import { MiniKitProvider } from "@coinbase/onchainkit/minikit";
import { Toaster } from "react-hot-toast";
import { farcasterFrame as miniAppConnector } from '@farcaster/frame-wagmi-connector'

// Create wagmi config outside of component
export const config = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(),
  },
  connectors: [
    miniAppConnector()
  ],
})

function WagmiProviderWrapper({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Return children without WagmiProvider during SSR
    return <>{children}</>
  }

  return (
    <WagmiProvider config={config}>
      {children}
    </WagmiProvider>
  )
}

export function Providers(props: { children: ReactNode }) {
  return (
    <MiniKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={baseSepolia}
      config={{
        appearance: {
          mode: "dark",
          theme: "mini-app-theme",
          name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
          logo: process.env.NEXT_PUBLIC_ICON_URL,
        },
        wallet: { 
          display: 'modal',
        },
      }}
    >
      <WagmiProviderWrapper>
        {props.children}
      </WagmiProviderWrapper>
      <Toaster position="top-right" />
    </MiniKitProvider>
  );
}