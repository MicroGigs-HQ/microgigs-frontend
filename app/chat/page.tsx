"use client";
import { ArrowLeft, Search, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { MobileNavLayout } from "@/components/layout/MobileNavLayout";
import Image from "next/image";
import logo from "../../public/microgigs-logo.svg";
import { useAccount } from "wagmi";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { useState } from "react";
import { ConnectWallet } from "@coinbase/onchainkit/wallet";
import { truncateAddress } from "@/components/screens/HomeScreen";

export default function ChatPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [username, setUsername] = useState("");
  const [isFarcasterFrame, setIsFarcasterFrame] = useState(false);
  const [isEmbedded, setIsEmbedded] = useState(false);
  const [hasUsername, setHasUsername] = useState(false);

  const { address, isConnected } = useAccount();
  const { setFrameReady, isFrameReady, context } = useMiniKit();

  const handleConnectClick = () => {
    if (!hasUsername) {
      setShowUsernameModal(true);
    }
    // If user has username, the ConnectWallet component will handle the connection
  };

  const handleUsernameSaved = () => {
    setHasUsername(true);
  };
  const chats = [
    {
      avatarSrc: "/placeholder-user.jpg",
      username: "RandomG",
      time: "15m",
      lastMessage: "Send the updated wallet address",
      unread: false,
    },
    {
      avatarSrc: "/profile.png",
      username: "DemmyGod",
      time: "15m",
      lastMessage: "Are you done with the fixes?",
      unread: false,
    },
    {
      avatarSrc: "/placeholder-user.jpg",
      username: "Sanctumofficial",
      time: "15m",
      lastMessage: "What is taking so long bro?",
      unread: false,
    },
    {
      avatarSrc: "/placeholder-user.jpg",
      username: "smoothguy",
      time: "15m",
      lastMessage: "Happy to meet you too man!",
      unread: false,
    },
    {
      avatarSrc: "/profile.png",
      username: "bigAunt",
      time: "15m",
      lastMessage: "Sent!",
      unread: false,
    },
  ];

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
                {/* Profile picture */}
                <div className="w-8 h-8 rounded-full overflow-hidden bg-red-500 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {username.charAt(0).toUpperCase() || "G"}
                  </span>
                </div>

                {/* Username and address */}
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">
                    {username || "Gm, Weng"}
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
        <div className="px-4 flex flex-col gap-2">
          <ArrowLeft className="h-[6px]w-[6px]" />
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Chats</h2>

          <div className="flex flex-col gap-3">
            {chats.map((chat, index) => (
              <div key={index} className="flex gap-2 items-center">
                <div className="w-[80px] h-[48px] overflow-hidden rounded-xl relative">
                  <Image src="/og.png" alt="" fill />
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <h5 className="text-sm text-[#62748E] font-semibold">
                      RandomG
                    </h5>
                    <h5 className="text-sm text-[#62748E] font-semibold">.</h5>

                    <p className="text-xs text-[#90A1B9]">15m</p>
                  </div>
                  <p className="text-sm text-[#99A1AF]">
                    Send the updated wallet address
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MobileNavLayout>
  );
}
