// components/profile/ProfileHeader.tsx
import React from "react";
import { Camera, Eye, Share2 } from "lucide-react";
import { UserDetails } from "../../app/profile/page";

interface ProfileHeaderProps {
  username: string;
  userDetails: UserDetails;
  setShowImageUploadOptions: (show: boolean) => void;
  setShowShareModal: (show: boolean) => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  username,
  userDetails,
  setShowImageUploadOptions,
  setShowShareModal,
}) => {
  return (
    <>
      {/* Profile Header (Mobile View) */}
      <div className="lg:hidden bg-white p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-red-500 flex items-center justify-center">
              <span className="text-white text-lg font-medium">
                {username.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            <button
              onClick={() => setShowImageUploadOptions(true)}
              className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1 text-xs shadow-md hover:bg-blue-600 transition-colors duration-200"
              aria-label="Upload profile picture"
            >
              <Camera className="w-3 h-3" />
            </button>
          </div>
          <div>
            <p className="text-xl font-semibold text-gray-800">
              Gm, {username || "User"} 👋
            </p>
            <p className="text-sm text-gray-500">What are we making today?</p>
          </div>
        </div>
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Ask your Ai assistant anything"
            className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            inputMode="search"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-200 text-xs font-bold bg-[#FF3C02] rounded-lg w-9 h-7 flex items-center justify-center shadow-md hover:bg-[#FF3C02]/90 transition-colors duration-200">
            O
          </button>
        </div>
        <div className="flex items-center justify-between text-blue-600 text-sm font-medium">
          <div className="flex items-center">
            <Eye className="h-4 w-4 mr-1" />
            <span>{userDetails.walletAddress}</span>
          </div>
          <button
            onClick={() => setShowShareModal(true)}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            aria-label="Share profile"
          >
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* User Profile Card (Desktop View) */}
      <div className="hidden lg:flex bg-white p-6 rounded-xl shadow-sm items-center gap-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-red-500 flex items-center justify-center">
            <span className="text-white text-2xl font-medium">
              {username.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
          <button
            onClick={() => setShowImageUploadOptions(true)}
            className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1.5 text-xs shadow-md hover:bg-blue-600 transition-colors duration-200"
            aria-label="Upload profile picture"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800">
            {userDetails.name || username || "User"}
          </h2>
          <p className="text-sm text-gray-500">
            Member since {userDetails.memberSince}
          </p>
          <p className="text-sm text-blue-600 mt-1">
            {userDetails.walletAddress}
          </p>
        </div>
        <button
          onClick={() => setShowShareModal(true)}
          className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
          aria-label="Share profile"
        >
          <Share2 className="h-6 w-6" />
        </button>
      </div>
    </>
  );
};
