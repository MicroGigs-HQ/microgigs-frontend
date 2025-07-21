"use client";

import React from "react";
import { X } from "lucide-react";

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
      {/* Backdrop with blur */}
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        {/* Modal */}
        <div className="bg-white rounded-2xl w-full max-w-sm mx-auto relative overflow-hidden shadow-xl md:max-w-md md:rounded-3xl md:my-12">
          {/* Orange Gradient Header */}
          <div className="w-full h-20 bg-gradient-to-r from-[#FF3C02] to-[#FF6D47] flex items-center px-6 relative">
            <h2 className="text-lg md:text-xl font-semibold text-white">Gig Successfully Posted</h2>
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 z-10 p-1 hover:bg-white/20 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
          {/* Modal Content */}
          <div className="p-6 pb-4">
            {/* Description */}
            <p className="text-gray-600 text-sm leading-relaxed mb-6 text-center">
              This post will be made public, workers can see and apply for it.
            </p>
            {/* Success Illustration */}
            <div className="mb-6">
              <div className="w-full h-32 bg-gradient-to-br from-orange-200 via-orange-300 to-orange-500 rounded-lg relative overflow-hidden">
                {/* Abstract design elements */}
                <div className="absolute inset-0">
                  {/* Main curved shape */}
                  <div className="absolute top-4 right-4 w-20 h-20 bg-white bg-opacity-20 rounded-full"></div>
                  <div className="absolute bottom-6 left-6 w-16 h-16 bg-white bg-opacity-10 rounded-full"></div>
                  {/* Curved lines/waves */}
                  <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 200 100"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0,50 Q50,20 100,40 T200,30"
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth="2"
                      fill="none"
                    />
                    <path
                      d="M0,70 Q50,45 100,60 T200,50"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="1.5"
                      fill="none"
                    />
                  </svg>
                  {/* Additional decorative elements */}
                  <div className="absolute top-8 left-12 w-3 h-3 bg-white bg-opacity-30 rounded-full"></div>
                  <div className="absolute bottom-8 right-16 w-2 h-2 bg-white bg-opacity-40 rounded-full"></div>
                </div>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={onViewGig}
                className="w-full bg-gradient-to-r from-[#FF3C02] to-[#FF6D47] text-white py-3.5 rounded-lg font-medium text-base hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                View Gig
              </button>
              <button
                onClick={onPostAnother}
                className="w-full bg-white text-gray-700 py-3.5 rounded-lg font-medium text-base border border-gray-300 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-200"
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
