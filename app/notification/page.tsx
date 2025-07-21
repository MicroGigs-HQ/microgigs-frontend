"use client";
import React, { useRef, useState, useCallback } from "react";
import Notifications from "@/components/ui/Notifications";
import { Home, Bell, Plus, MessageCircle, MoreHorizontal } from "lucide-react";
import Image from "next/image";

// Placeholder user data
const user = {
  name: "Weng",
  avatar: "/weng.png",
  memberSince: "Dec 25, 2023",
};

export default function NotificationPage() {
  // Pull-to-refresh state
  const [refreshing, setRefreshing] = useState(false);
  // Infinite scroll state (simulate with a ref for now)
  const listRef = useRef<HTMLDivElement>(null);

  // Pull-to-refresh handler
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  // Infinite scroll handler (simulate)
  const handleScroll = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 40) {
      // Simulate loading more notifications
      // You can trigger a fetch here
    }
  }, []);

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center">
      {/* User Profile Header */}
      <div className="w-full max-w-[420px] px-4 pt-6 pb-2 flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <Image
            src={user.avatar}
            alt="User avatar"
            width={44}
            height={44}
            className="rounded-full object-cover border border-gray-200"
          />
          <div className="flex-1">
            <div className="font-semibold text-base text-gray-900">
              Gm, {user.name} <span className="text-lg">🌙</span>
            </div>
            <div className="text-xs text-gray-500">What are we making today?</div>
          </div>
        </div>
        {/* AI Assistant Input */}
        <div className="flex items-center gap-2 mt-2">
          <input
            type="text"
            placeholder="Ask your AI assistant anything"
            className="flex-1 px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
          />
          <button className="bg-gradient-to-r from-[#FF3C02] to-[#FF6D47] text-white px-4 py-2 rounded-lg font-semibold text-sm shadow hover:scale-105 transition-transform">
            Ask
          </button>
        </div>
        <div className="text-xs text-gray-400 mt-1">Member since {user.memberSince}</div>
      </div>

      {/* Pull-to-refresh indicator */}
      {refreshing && (
        <div className="w-full max-w-[420px] text-center text-xs text-orange-500 py-2 animate-pulse">
          Refreshing...
        </div>
      )}

      {/* Notification List with pull-to-refresh and infinite scroll */}
      <div
        ref={listRef}
        onScroll={handleScroll}
        onTouchStart={(e) => {
          const startY = e.touches[0].clientY;
          const handleTouchMove = (moveEvent: TouchEvent) => {
            if (listRef.current && listRef.current.scrollTop === 0) {
              const moveY = moveEvent.touches[0].clientY;
              if (moveY - startY > 60 && !refreshing) {
                handleRefresh();
                document.removeEventListener("touchmove", handleTouchMove);
              }
            }
          };
          document.addEventListener("touchmove", handleTouchMove);
          document.addEventListener(
            "touchend",
            () => document.removeEventListener("touchmove", handleTouchMove),
            { once: true }
          );
        }}
        className="flex-1 w-full max-w-[420px] overflow-y-auto"
        style={{ minHeight: 0 }}
      >
        <Notifications />
      </div>

      {/* Bottom Navigation */}
      <nav className="w-full max-w-[420px] bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between sticky bottom-0 z-10">
        <button className="flex flex-col items-center space-y-1 p-2">
          <Home className="w-5 h-5 text-gray-400" />
          <span className="text-xs text-gray-400">Home</span>
        </button>
        <button className="flex flex-col items-center space-y-1 p-2">
          <Bell className="w-5 h-5 text-purple-600" />
          <span className="text-xs text-purple-600 font-semibold">Notification</span>
        </button>
        <button className="flex flex-col items-center space-y-1 p-2">
          <div className="w-5 h-5 bg-[#FF3C02] rounded-full flex items-center justify-center">
            <Plus className="w-3 h-3 text-white" />
          </div>
          <span className="text-xs text-[#FF3C02] font-medium">Create Task</span>
        </button>
        <button className="flex flex-col items-center space-y-1 p-2">
          <MessageCircle className="w-5 h-5 text-gray-400" />
          <span className="text-xs text-gray-400">Chat</span>
        </button>
        <button className="flex flex-col items-center space-y-1 p-2">
          <MoreHorizontal className="w-5 h-5 text-gray-400" />
          <span className="text-xs text-gray-400">More</span>
        </button>
      </nav>
    </div>
  );
} 