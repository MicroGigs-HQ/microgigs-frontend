"use client";
import React, { useState } from "react";
import { Home, Bell, PlusCircle, MessageCircle, Settings } from "lucide-react";

const MobileBottomNav = () => {
  const [activeNavItem, setActiveNavItem] = useState("More");

interface NavItem {
    name: string;
    icon: (active: boolean) => React.ReactNode;
}

const navItems: NavItem[] = [
    {
        name: "Home 1",
        icon: (active: boolean) => (
            <Home className={`w-6 h-6 ${active ? "text-[#FF3C02]" : "text-muted-foreground"}`} />
        ),
    },
    {
        name: "Notification",
        icon: (active: boolean) => (
            <Bell className={`w-6 h-6 ${active ? "text-[#FF3C02]" : "text-muted-foreground"}`} />
        ),
    },
    {
        name: "Create Task",
        icon: (active: boolean) => (
            <PlusCircle className={`w-6 h-6 ${active ? "text-[#FF3C02]" : "text-muted-foreground"}`} />
        ),
    },
    {
        name: "Chat",
        icon: (active: boolean) => (
            <MessageCircle className={`w-6 h-6 ${active ? "text-[#FF3C02]" : "text-muted-foreground"}`} />
        ),
    },
    {
        name: "More",
        icon: (active: boolean) => (
            <Settings className={`w-6 h-6 ${active ? "text-[#FF3C02]" : "text-muted-foreground"}`} />
        ),
    },
];

return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border lg:hidden shadow-lg z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <button
            key={item.name}
            className="flex flex-col items-center justify-center p-2 text-xs font-medium"
            onClick={() => setActiveNavItem(item.name)}
          >
            {item.icon(activeNavItem === item.name)}
            <span
              className={`mt-1 ${activeNavItem === item.name ? "text-[#FF3C02]" : "text-muted-foreground"}`}
            >
              {item.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileBottomNav;
