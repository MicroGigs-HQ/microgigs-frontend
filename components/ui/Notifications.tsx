"use client";
import Image from "next/image";
import { ShoppingBag, Scan, Check } from "lucide-react";
import { formatDistanceToNowStrict } from "date-fns";
import { useAccount } from "wagmi";
import { Address } from "viem";

import { useUserNotifications } from "@/hooks/useUserNotification";

// 👉 put your deployed NotificationHub contract address here
const HUB_ADDRESS = "0xYourNotificationHub...";

export default function Notifications() {
  const { address } = useAccount();

  const {
    notifications,
    loadingNotifications,
    errorNotifications,
    unreadCount,
    markAsRead,
  } = useUserNotifications(HUB_ADDRESS as Address, address);

  return (
    <div className="min-h-screen w-full bg-white flex justify-center">
      <div className="w-full max-w-[420px] flex flex-col">
        {/* ------- Header -------- */}
        <header className="flex items-center justify-center gap-1 py-4 border-b">
          <ShoppingBag className="w-6 h-6 shrink-0" />
          <span className="text-2xl font-semibold tracking-tight">
            MicroGigs
          </span>
        </header>

        <main className="flex-1 mt-6 overflow-y-auto">
          <div className="px-6 mb-3">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              Notification
              {unreadCount > 0 && (
                <span className="h-5 min-w-[1.25rem] px-[6px] rounded-full bg-red-600 text-[11px] text-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </h2>
            <p className="text-xs text-gray-500">Member since Dec 25, 2023</p>
          </div>

          {/* Loading skeleton */}
          {loadingNotifications && (
            <ul className="space-y-4 animate-pulse px-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <li key={i} className="flex gap-4">
                  <div className="w-14 h-14 bg-gray-200 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Error */}
          {errorNotifications && (
            <p className="text-center text-sm text-red-500">
              {errorNotifications}
            </p>
          )}

          {/* Real notifications */}
          {!loadingNotifications && !errorNotifications && (
            <ul className="space-y-4">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className="flex items-start gap-4 px-6 cursor-pointer"
                  onClick={() => markAsRead(n.id)}
                >
                  {/* thumbnail */}
                  <div className="w-14 h-14 rounded-md overflow-hidden flex-shrink-0">
                    {n.icon ? (
                      <Image
                        src={n.icon}
                        alt=""
                        width={56}
                        height={56}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-600" />
                    )}
                  </div>

                  {/* content */}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 flex items-center gap-1">
                      {n.title}
                      {n.read && <Check className="w-3 h-3 text-green-600" />}
                      <span className="mx-1 text-gray-400">•</span>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNowStrict(Number(n.timestamp) * 1000, {
                          addSuffix: true,
                        })}
                      </span>
                    </p>
                    <p className="text-sm text-gray-500">{n.body}</p>
                  </div>
                </li>
              ))}

              {notifications.length === 0 && (
                <p className="text-center text-gray-400 py-10">
                  You’re all caught up ✨
                </p>
              )}
            </ul>
          )}
        </main>
      </div>
    </div>
  );
}
