import React from "react";
import { UserDetails } from "../../app/profile/page"; 
import {
  User,
  Calendar,
  ClipboardCheck,
  Send,
  Wallet,
  Gift,
} from "lucide-react";

interface EditProfileModalProps {
  userDetails: UserDetails;
  onUserDetailsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  userDetails,
  onUserDetailsChange,
  onSave,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md overflow-y-auto max-h-[90vh] scrollbar-hide">
        <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
          Edit Profile
        </h3>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSave();
          }}
        >
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              <User className="inline-block w-4 h-4 mr-1 text-gray-500" /> Full
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={userDetails.name}
              onChange={onUserDetailsChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label
              htmlFor="memberSince"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              <Calendar className="inline-block w-4 h-4 mr-1 text-gray-500" />{" "}
              Member Since
            </label>
            <input
              type="text"
              id="memberSince"
              name="memberSince"
              value={userDetails.memberSince}
              onChange={onUserDetailsChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
              disabled // Typically, this is not editable by the user
            />
          </div>
          <div>
            <label
              htmlFor="walletAddress"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              <Wallet className="inline-block w-4 h-4 mr-1 text-gray-500" />{" "}
              Wallet Address
            </label>
            <input
              type="text"
              id="walletAddress"
              name="walletAddress"
              value={userDetails.walletAddress}
              onChange={onUserDetailsChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
              disabled // Wallet address should not be directly editable
            />
          </div>
          {/* Editable stats for demonstration - in a real app these would be derived */}
          <div>
            <label
              htmlFor="taskComplete"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              <ClipboardCheck className="inline-block w-4 h-4 mr-1 text-gray-500" />{" "}
              Tasks Completed
            </label>
            <input
              type="number"
              id="taskComplete"
              name="taskComplete"
              value={userDetails.taskComplete}
              onChange={onUserDetailsChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="taskPosted"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              <Send className="inline-block w-4 h-4 mr-1 text-gray-500" /> Tasks
              Posted
            </label>
            <input
              type="number"
              id="taskPosted"
              name="taskPosted"
              value={userDetails.taskPosted}
              onChange={onUserDetailsChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="totalSpent"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              <Gift className="inline-block w-4 h-4 mr-1 text-gray-500" /> Total
              Spent
            </label>
            <input
              type="number"
              id="totalSpent"
              name="totalSpent"
              value={userDetails.totalSpent}
              onChange={onUserDetailsChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="totalEarned"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              <Gift className="inline-block w-4 h-4 mr-1 text-gray-500" /> Total
              Earned
            </label>
            <input
              type="number"
              id="totalEarned"
              name="totalEarned"
              value={userDetails.totalEarned}
              onChange={onUserDetailsChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
