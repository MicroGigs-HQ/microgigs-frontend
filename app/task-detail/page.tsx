"use client";
import React, { useState } from "react";
import { ArrowLeft, ExternalLink, X, CheckCircle, Search } from "lucide-react";
// import MobileBottomNav from "@/components/layout/MobileNavLayout";

import abstract_waving_orange_fibers from "../../assets/abstract_waving_orange_fibers.svg";
import Image from "next/image";

const TaskDetails = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const task = {
    title: "Create a hero section for my Saas product",
    description:
      "Create a hero section for my Saas product. The project is defi project for a hackathon, and i need it made with a black #0C0C0C color for best contrast.",
    referenceLink: "https://beautifulink.com//",
    category: "Development",
    price: "1,000",
    currency: "USDC",
    postedBy: "@Demmigod",
    applicants: 23,
    dueDate: { days: 4, hours: 7 }, 
  };

  const handleApplyForGig = () => {
  
    console.log("Applying for gig...");
    setShowSuccessModal(true); 
  };

  const handleShareGig = () => {
    if (navigator.share) {
      navigator
        .share({
          title: task.title,
          text: `Check out this gig on Microgigs: ${task.title}`,
          url: window.location.href,
        })
        .then(() => {
          console.log("Successfully shared");
        })
        .catch((error) => {
          console.error("Error sharing:", error);
        });
    } else {
      // Fallback for browsers that don't support Web Share API
      alert(
        "Sharing not supported on this browser. You can copy the link manually."
      );
      console.log("Share URL:", window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans flex flex-col items-center">
      {/* Tailwind CSS Script for JIT compilation */}
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          body {
            font-family: 'Inter', sans-serif;
          }
          .scrollbar-hide::-webkit-scrollbar {
              display: none;
          }
          .scrollbar-hide {
              -ms-overflow-style: none;  /* IE and Edge */
              scrollbar-width: none;  /* Firefox */
          }
        `}
      </style>

      <div className="container mx-auto max-w-2xl bg-white rounded-xl shadow-sm p-6 lg:p-8 relative">
        {/* Top Header Section (Mobile) */}
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <div className="flex items-center gap-3">
            <img
              src="https://placehold.co/50x50/ff4d4d/ffffff?text=WG"
              alt="User Avatar"
              className="rounded-full w-12 h-12"
            />
            <div>
              <p className="text-xl font-semibold text-gray-800">Gm, Weng 👋</p>
              <p className="text-sm text-gray-500">What are we making today?</p>
            </div>
          </div>
        </div>
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

        {/* Back and Applicants Info */}
        <div className="flex items-center text-gray-600 mb-6">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors mr-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="font-medium">Task Details</span>
          <span className="ml-auto text-sm text-gray-500">
            {task.applicants} people applied to this
          </span>
        </div>

        {/* Task Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{task.title}</h1>

        {/* Description */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-500 mb-2">
            Description
          </h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            {task.description}
          </p>
          <div className="flex flex-col text-gray-600 text-sm font-medium">
            <a
              href={task.referenceLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover:underline"
            >
              look at this:
            </a>

            <a
              href={task.referenceLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 hover:underline"
            >
              {task.referenceLink} for refrence
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          </div>
        </div>

        {/* Category */}
        <div className="mb-6">
          <h2 className="text-sm text-gray-600 mb-2">Category</h2>
          <p className="text-gray-800 text-lg font-semibold inline-block">
            {task.category}
          </p>
        </div>

        {/* Price */}
        <div className="mb-6">
          <h2 className="text-sm text-gray-600 mb-2">Price</h2>
          <p className="text-2xl font-bold text-gray-800">
            {task.price}{" "}
            <span className="text-gray-500 text-base">{task.currency}</span>
          </p>
        </div>

        {/* Posted By */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Posted by
          </h2>
          <div className="flex items-center text-blue-600 text-sm font-medium">
            <a href="#" className="flex items-center hover:underline">
              {task.postedBy}
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 mb-10">
          <button
            onClick={handleApplyForGig}
            className="w-full py-3 rounded-xl bg-[#FF3C02] text-white font-semibold shadow-md hover:bg-[#FF3C02]/90 transition-colors duration-200"
          >
            Apply For This Gig
          </button>
          <button
            onClick={handleShareGig}
            className="w-full py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors duration-200"
          >
            Share the Gig
          </button>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm text-center relative overflow-hidden">
            <div className="relative h-48">
              <Image 
                src={abstract_waving_orange_fibers} 
                alt="" 
                className="w-full h-full object-cover"
                style={{ objectPosition: 'center' }}
              />
              <button
                onClick={() => setShowSuccessModal(false)}
                className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="absolute bottom-0 w-full h-16 bg-gradient-to-t from-white to-transparent" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                You've Applied Successfully
              </h3>
              <p className="text-gray-600 mb-6">
                Now you can proceed to start working on the gig
              </p>
              <p className="text-lg font-semibold text-gray-800 mb-6">
                you've got{" "}
                <span className="text-[#FF3C02]">
                  {task.dueDate.days}days,{task.dueDate.hours}hrs
                </span>{" "}
                to finish this
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    alert("Viewing Gig (placeholder)");
                    setShowSuccessModal(false);
                  }}
                  className="w-full py-3 rounded-xl bg-[#FF3C02] text-white font-semibold shadow-md hover:bg-[#FF3C02]/90 transition-colors duration-200"
                >
                  View Gig
                </button>
                <button
                  onClick={() => {
                    alert("Messaging Gig owner (placeholder)");
                    setShowSuccessModal(false);
                  }}
                  className="w-full py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors duration-200"
                >
                  Message Gig owner
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* <MobileBottomNav /> */}
    </div>
  );
};

export default TaskDetails;
