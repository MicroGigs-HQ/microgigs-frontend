import React from "react";
import {
  Home,
  Bell,
  Plus,
  MessageCircle,
  Settings,
  ExternalLink,
  Github,
  X,
  Users,
  Copy,
} from "lucide-react";
import Image from "next/image";

const MorePage = () => {
  const DiscordIcon = ({ size = 20, className = "" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.019 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z" />
    </svg>
  );
  return (
    <div className="min-h-screen mx-auto">

     {/* logo */}
     <div className="my-4">
        <Image
          src="/logo2.png"
          alt="Logo"
          width={100}
          height={50}
          className="mx-auto mt-4"
        />  
     </div>
      {/* Header Section */}
      <div className="bg-white px-4 pt-4 pb-6">
        {/* Profile Section */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12  rounded-full flex items-center justify-center">
             <Image
              src="/profile.png"
              alt="Profile Picture"
              width={48}
              height={48}
              className="rounded-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Gm, Weng</h2>
            <p className="text-[10px] text-gray-500">What are we making today?</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Ask your Ai assistant anything"
            className="w-full bg-gray-100 rounded-lg px-4 py-3 pr-12 text-sm placeholder-gray-500 focus:outline-none focus:ring-2  focus:bg-white"
          />
          <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-t from-[#FF6D47] to-[#FF3C02] h-8  hover:bg-orange-600 text-white px-2 rounded-lg">
            <span className="h-full text-center font-medium">GO</span>
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-4 py-4 space-y-6">
        {/* Wallet/ID Section */}
        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center bg-[#9F9F9F33] rounded-md w-[50%] p-3  space-x-2 text-gray-500 mb-3">
            <Copy size={16} />
            <span className="text-sm font-mono">0x94eD6...0C64</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center">
              <span className="text-gray-400 text-sm">
                How to receive payment
              </span>
              <ExternalLink size={16} className="text-black ml-4 h-5 w-7" />
            </div>
            <div className="flex items-center ">
              <span className="text-gray-400 text-sm">Submitting a task</span>
              <ExternalLink size={16} className="text-black w-8 h-5 ml-4" />
            </div>
            <div className="flex items-center ">
              <span className="text-gray-400 text-sm">
                How to create new tasks
              </span>
              <ExternalLink size={16} className="text-black w-8 h-5 ml-4" />
            </div>
          </div>
        </div>

        {/* Opportunities Section */}
        <div className="bg-white rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
            OPPORTUNITIES
          </h3>
          <div className="space-y-3">
            <div className="">
              <span className="text-gray-600 text-sm">Task Listing</span>
            </div>
            <div className="">
              <span className="text-gray-600 text-sm">Gigs Challenge</span>
            </div>
            <div className="">
              <span className="text-gray-600 text-sm">Community projects</span>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="bg-white rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
            CATEGORIES
          </h3>
          <div className="space-y-3">
            <div className="">
              <span className="text-gray-600 text-sm">Content</span>
            </div>
            <div className="">
              <span className="text-gray-600 text-sm">Design</span>
            </div>
            <div className="">
              <span className="text-gray-600 text-sm">Development</span>
            </div>
            <div className="">
              <span className="text-gray-600 text-sm">Others</span>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
            ABOUT
          </h3>
          <div className="space-y-3">
            <div className="">
              <span className="text-gray-600 text-sm">FAQ</span>
            </div>
            <div className="">
              <span className="text-gray-600 text-sm">Terms</span>
            </div>
            <div className="">
              <span className="text-gray-600 text-sm">Privacy Policy</span>
            </div>
            <div className="">
              <span className="text-gray-600 text-sm">Changelog</span>
            </div>
            <div className="">
              <span className="text-gray-600 text-sm">Contact Us</span>
            </div>
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex items-center space-x-4 px-4 py-2">
          <Github size={20} className="text-gray-400" />
          <X size={20} className="text-gray-400" />
          <DiscordIcon size={20} className="text-gray-400" />
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full  bg-white border-t border-gray-200">
        <div className="flex items-center justify-around py-2">
          <div className="flex flex-col items-center py-2">
            <Home size={20} className="text-gray-400 mb-1" />
            <span className="text-xs text-gray-400">Home</span>
          </div>
          <div className="flex flex-col items-center py-2">
            <Bell size={20} className="text-gray-400 mb-1" />
            <span className="text-xs text-gray-400">Notification</span>
          </div>
          <div className="flex flex-col items-center py-2">
            <Plus size={20} className="text-gray-400 mb-1" />
            <span className="text-xs text-gray-400">Create Task</span>
          </div>
          <div className="flex flex-col items-center py-2">
            <MessageCircle size={20} className="text-gray-400 mb-1" />
            <span className="text-xs text-gray-400">Chat</span>
          </div>
          <div className="flex flex-col items-center py-2">
            <Settings size={20} className="text-orange-500 mb-1" />
            <span className="text-xs text-orange-500 font-medium">More</span>
          </div>
        </div>
      </div>

      {/* Add padding bottom to account for fixed navigation */}
      <div className="h-20"></div>
    </div>
  );
};

export default MorePage;
