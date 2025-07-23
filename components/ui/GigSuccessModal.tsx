"use client";

import React from "react";
import { X } from "lucide-react";
import Image from "next/image";

interface GigSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewGig: () => void;
  onPostAnother: () => void;
}

const GigSuccessModal: React.FC<GigSuccessModalProps> = ({
  isOpen,
  onClose,
  onViewGig,
  onPostAnother,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        {/* Modal */}
        <div className="bg-white rounded-2xl w-full max-w-sm mx-auto relative overflow-hidden">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-1 text-gray-900 hover:bg-mobile-primary hover:text-white rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-md" />
          </button>

          {/* Modal Content */}
          <div className="p-6 pb-4">
            {/* Title and Description */}
            <div className="mb-6">
              <h2 className="text-md font-semibold text-gray-900 mb-2">
                Gig Successfully Posted
              </h2>
              <p className="text-mobile-form-title text-xs leading-relaxed">
                This post will be made public, workers can see and apply for it.
              </p>
            </div>

            <div className="w-full min-h-[155px] rounded-lg relative overflow-hidden mb-6">
              <Image src={"waving-orange.png"} alt={"gig image"} width={500} height={200} className="w-full" />
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 mt-14">
              <button
                onClick={onViewGig}
                className="w-full bg-gradient-to-r from-[#FF3C02] to-[#FF6D47] text-white py-2 rounded-xl font-semibold text-base hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
              >
                View Gig
              </button>
              <button
                onClick={onPostAnother}
                className="w-full bg-white text-gray-700 py-2 rounded-xl font-semibold text-base border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Post another Gig
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GigSuccessModal;
