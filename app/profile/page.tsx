"use client";
import React, { useState, useRef, useEffect } from "react";
import {
    Eye,
    ArrowRight,
    CheckCircle,
    XCircle,
    HelpCircle,
    BadgeCheck,
    BadgeDollarSign,
    Camera,
    Share2,
    Edit,
    ChevronDown,
    ChevronUp,
    Home,
    Bell,
    PlusCircle,
    MessageSquare,
    Settings,
    Image,
    Copy,
    User,
    Calendar,
    ClipboardCheck,
    Send,
    Wallet,
    Gift,
    Twitter,
    Facebook,
    Linkedin,
    Mail,
} from "lucide-react";
import MobileBottomNav from "@/components/layout/mobile-bottom-nav";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const Profile = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isStatsCollapsed, setIsStatsCollapsed] = useState(false); 
  const [activeNavItem, setActiveNavItem] = useState("More");

  // State for modals
  const [showShareModal, setShowShareModal] = useState(false);
  const [showImageUploadOptions, setShowImageUploadOptions] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false); 

  // User details state, pre-filled with mock data
  const [userDetails, setUserDetails] = useState({
    name: "Weng Ibrahim",
    memberSince: "Dec 25, 2023",
    taskComplete: 24,
    taskPosted: 24,
    totalSpent: 24,
    totalEarned: 24,
    walletAddress: "0x94ED6...0C64",
  });

  // Refs for hidden file input elements
  const galleryInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const activities = [
    {
      id: 1,
      title:
        "Build in Public, Get Roasted in Public: Colosseum Breakout Edition",
      taskBy: "TheWeb3God",
      amount: "1,000",
      currency: "USDC",
      status: "verified",
      dueDate: "2Days",
      image: "https://placehold.co/60x60/a0a0a0/ffffff?text=Task",
    },
    {
      id: 2,
      title:
        "Build in Public, Get Roasted in Public: Colosseum Breakout Edition",
      taskBy: "TheWeb3God",
      amount: "1,000",
      currency: "USDC",
      status: "verified",
      dueDate: "2Days",
      image: "https://placehold.co/60x60/a0a0a0/ffffff?text=Task",
    },
    {
      id: 3,
      title:
        "Build in Public, Get Roasted in Public: Colosseum Breakout Edition",
      taskBy: "TheWeb3God",
      amount: "1,000",
      currency: "USDC",
      status: "verified",
      dueDate: "2Days",
      image: "https://placehold.co/60x60/a0a0a0/ffffff?text=Task",
    },
    {
      id: 4,
      title:
        "Build in Public, Get Roasted in Public: Colosseum Breakout Edition",
      taskBy: "TheWeb3God",
      amount: "1,000",
      currency: "USDC",
      status: "verified",
      dueDate: "2Days",
      image: "https://placehold.co/60x60/a0a0a0/ffffff?text=Task",
    },
    {
      id: 5,
      title:
        "Build in Public, Get Roasted in Public: Colosseum Breakout Edition",
      taskBy: "TheWeb3God",
      amount: "1,000",
      currency: "USDC",
      status: "verified",
      dueDate: "2Days",
      image: "https://placehold.co/60x60/a0a0a0/ffffff?text=Task",
    },
  ];

  const notificationItems = [
    {
      id: 1,
      amount: "230",
      currency: "USDC",
      message: "Recieved",
      time: "15m",
      detail: "TaskMayor just approved your task",
      image: "https://placehold.co/40x40/007bff/ffffff?text=N",
    },
    {
      id: 2,
      amount: "230",
      currency: "USDC",
      message: "Recieved",
      time: "15m",
      detail: "TaskMayor just approved your task",
      image: "https://placehold.co/40x40/007bff/ffffff?text=N",
    },
    {
      id: 3,
      amount: "230",
      currency: "USDC",
      message: "Recieved",
      time: "15m",
      detail: "TaskMayor just approved your task",
      image: "https://placehold.co/40x40/007bff/ffffff?text=N",
    },
    {
      id: 4,
      amount: "230",
      currency: "USDC",
      message: "Recieved",
      time: "15m",
      detail: "TaskMayor just approved your task",
      image: "https://placehold.co/40x40/007bff/ffffff?text=N",
    },
    {
      id: 5,
      amount: "230",
      currency: "USDC",
      message: "Recieved",
      time: "15m",
      detail: "TaskMayor just approved your task",
      image: "https://placehold.co/40x40/007bff/ffffff?text=N",
    },
  ];

  const taskCategories = ["All", "Development", "Content", "Design", "Other"];

  // Navigation items for the mobile bottom nav
interface NavItem {
    name: string;
    icon: (active: boolean) => React.ReactNode;
}

const navItems: NavItem[] = [
    {
        name: "Home",
        icon: (active: boolean) => (
            <Home
                className={`w-6 h-6 ${active ? "text-blue-500" : "text-gray-500"}`}
            />
        ),
    },
    {
        name: "Notification",
        icon: (active: boolean) => (
            <Bell
                className={`w-6 h-6 ${active ? "text-blue-500" : "text-gray-500"}`}
            />
        ),
    },
    {
        name: "Create Task",
        icon: (active: boolean) => (
            <PlusCircle
                className={`w-6 h-6 ${active ? "text-blue-500" : "text-gray-500"}`}
            />
        ),
    },
    {
        name: "Chat",
        icon: (active: boolean) => (
            <MessageSquare
                className={`w-6 h-6 ${active ? "text-blue-500" : "text-gray-500"}`}
            />
        ),
    },
    {
        name: "More",
        icon: (active: boolean) => (
            <Settings
                className={`w-6 h-6 ${active ? "text-orange-500" : "text-gray-500"}`}
            />
        ),
    },
];

  // Function to handle showing image upload options
  const handleImageUploadClick = () => {
    setShowImageUploadOptions(true);
  };

  // Function to handle image selection from gallery
  const handleSelectFromGallery = () => {
    setShowImageUploadOptions(false); 
    if (galleryInputRef.current) {
      (galleryInputRef.current as HTMLInputElement).click(); 
    }
  };

  // Function to handle image capture from camera
  const handleCaptureFromCamera = () => {
    setShowImageUploadOptions(false);
    if (cameraInputRef.current) {
      (cameraInputRef.current as HTMLInputElement).click(); 
    }
  };

  // Handle file input change (for both gallery and camera)
interface FileChangeEvent extends React.ChangeEvent<HTMLInputElement> {
    target: HTMLInputElement & EventTarget;
}

const handleFileChange = (event: FileChangeEvent) => {
    const file: File | undefined = event.target.files ? event.target.files[0] : undefined;
    if (file) {
        console.log("Selected file:", file.name, file.type);
        alert(
            `Selected file: ${file.name}.`
        );
    }
};

  // Function to handle share profile
  const handleShareProfile = () => {
    if (navigator.share) {
      // Use Web Share API if available
      navigator
        .share({
          title: "Weng Ibrahim's Microgigs Profile",
          text: "Check out my profile on Microgigs!",
          url: window.location.href, // Or a specific profile URL
        })
        .then(() => {
          console.log("Successfully shared");
        })
        .catch((error) => {
          console.error("Error sharing:", error);
        });
    } else {
      // Fallback: show custom share options modal
      setShowShareModal(true);
    }
  };

  // Function to copy profile link to clipboard
  const copyProfileLink = () => {
    const profileLink = window.location.href; // Or your actual profile URL
    const textArea = document.createElement("textarea");
    textArea.value = profileLink;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      alert("Profile link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
      alert("Could not copy link. Please copy it manually: " + profileLink);
    }
    document.body.removeChild(textArea);
    setShowShareModal(false);
  };

  // Share to social media functions
  const shareToTwitter = () => {
    const text = encodeURIComponent("Check out my Microgigs profile!");
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      "_blank"
    );
    setShowShareModal(false);
  };

  const shareToFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      "_blank"
    );
    setShowShareModal(false);
  };

  const shareToLinkedin = () => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent("Microgigs Profile");
    const summary = encodeURIComponent(
      "Check out my Microgigs profile and activities!"
    );
    window.open(
      `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}&summary=${summary}`,
      "_blank"
    );
    setShowShareModal(false);
  };

  const shareToEmail = () => {
    const subject = encodeURIComponent("Check out my Microgigs Profile");
    const body = encodeURIComponent(
      `Hey, check out my Microgigs profile here: ${window.location.href}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
    setShowShareModal(false);
  };

  const shareToWhatsapp = () => {
    const text = encodeURIComponent(
      `Check out my Microgigs profile: ${window.location.href}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
    setShowShareModal(false);
  };

  // Handle changes in the edit profile form
interface UserDetails {
    name: string;
    memberSince: string;
    taskComplete: number;
    taskPosted: number;
    totalSpent: number;
    totalEarned: number;
    walletAddress: string;
}

interface UserDetailsChangeEvent extends React.ChangeEvent<HTMLInputElement> {
    target: HTMLInputElement & {
        name: keyof UserDetails;
        value: string;
    };
}

const handleUserDetailsChange = (e: UserDetailsChangeEvent) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
        ...prevDetails,
        [name]: name === "taskComplete" || name === "taskPosted" || name === "totalSpent" || name === "totalEarned"
            ? Number(value)
            : value,
    }));
};

  // Handle saving the edited profile details
  const handleSaveProfile = () => {
    console.log("Saving user details:", userDetails);
    // In a real application, you would send this data to your backend
    alert("Profile updated successfully (demo)!");
    setShowEditProfileModal(false); // Close modal after saving
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans flex flex-col justify-center pb-20 lg:pb-4">
      {/* Custom CSS for scrollbar-hide */}
      <style>
        {`
          .scrollbar-hide::-webkit-scrollbar {
              display: none;
          }
          .scrollbar-hide {
              -ms-overflow-style: none;  /* IE and Edge */
              scrollbar-width: none;  /* Firefox */
          }
        `}
      </style>

      {/* Hidden file inputs for image upload */}
      <input
        type="file"
        ref={galleryInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={cameraInputRef}
        onChange={handleFileChange}
        accept="image/*"
        capture="environment" // 'user' for front camera, 'environment' for rear camera
        className="hidden"
      />

      {/* Main Container */}
      <div className="container mx-auto flex flex-col lg:flex-row gap-6 lg:gap-8 max-w-7xl">
        {/* Left Column - Profile and Activities */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Profile Header (Mobile View) */}
          <div className="lg:hidden bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <img
                  src="https://placehold.co/50x50/ff4d4d/ffffff?text=WG"
                  alt="User Avatar"
                  className="rounded-full w-12 h-12 object-cover"
                />
                {/* Image upload icon */}
                <button
                  onClick={handleImageUploadClick}
                  className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1 text-xs shadow-md hover:bg-blue-600 transition-colors duration-200"
                  aria-label="Upload profile picture"
                >
                  <Camera className="w-3 h-3" />
                </button>
              </div>
              <div>
                <p className="text-xl font-semibold text-gray-800">
                  Gm, Weng 👋
                </p>
                <p className="text-sm text-gray-500">
                  What are we making today?
                </p>
              </div>
            </div>
            <div className="relative mb-4">
              {/* Touch-friendly forms with mobile keyboards: inputMode="search" for better mobile keyboard hint */}
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
              {/* Share profile functionality (Mobile) */}
              <button
                onClick={handleShareProfile}
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
              <img
                src="https://placehold.co/80x80/ff4d4d/ffffff?text=WG"
                alt="User Avatar"
                className="rounded-full w-20 h-20 object-cover"
              />
              {/* Image upload icon (Desktop) */}
              <button
                onClick={handleImageUploadClick}
                className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1.5 text-xs shadow-md hover:bg-blue-600 transition-colors duration-200"
                aria-label="Upload profile picture"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800">
                {userDetails.name}
              </h2>
              <p className="text-sm text-gray-500">
                Member since {userDetails.memberSince}
              </p>
            </div>
            {/* Share profile functionality (Desktop) */}
            <button
              onClick={handleShareProfile}
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              aria-label="Share profile"
            >
              <Share2 className="h-6 w-6" />
            </button>
          </div>

          {/* Stats Grid (Collapsible) */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Your Stats
              </h3>
              <button
                onClick={() => setIsStatsCollapsed(!isStatsCollapsed)}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                aria-label={
                  isStatsCollapsed ? "Expand stats" : "Collapse stats"
                }
              >
                {isStatsCollapsed ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronUp className="h-5 w-5" />
                )}
              </button>
            </div>
            {!isStatsCollapsed && (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 text-sm">Task Complete</p>
                  <p className="text-xl font-semibold text-gray-800">
                    {userDetails.taskComplete}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 text-sm">Task Posted</p>
                  <p className="text-xl font-semibold text-gray-800">
                    {userDetails.taskPosted}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 text-sm">Total Spent</p>
                  <p className="text-xl font-semibold text-gray-800">
                    {userDetails.totalSpent}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 text-sm">Total Earned</p>
                  <p className="text-xl font-semibold text-gray-800">
                    {userDetails.totalEarned}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Activity Overview with Recharts */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Activity Overview
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'Jan', tasks: 20, earnings: 400, spending: 240 },
                    { name: 'Feb', tasks: 15, earnings: 300, spending: 220 },
                    { name: 'Mar', tasks: 30, earnings: 600, spending: 260 },
                    { name: 'Apr', tasks: 25, earnings: 500, spending: 280 },
                    { name: 'May', tasks: 40, earnings: 800, spending: 300 },
                    { name: 'Jun', tasks: 35, earnings: 700, spending: 340 },
                  ]}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #ccc',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="tasks" fill="#3B82F6" name="Tasks Completed" />
                  <Bar dataKey="earnings" fill="#10B981" name="Earnings (USDC)" />
                  <Bar dataKey="spending" fill="#F59E0B" name="Spending (USDC)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Activities Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 lg:hidden">
              Discover Opportunities
            </h3>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 hidden lg:block">
              Your activities
            </h3>
            {/* Main Tabs */}
            <div className="flex space-x-8 border-b border-gray-200 mb-6">
              {["All", "My tasks", "Tasks Applied"].map((tab) => (
                <div
                  key={tab}
                  className={`cursor-pointer pb-2 text-sm font-medium transition-colors duration-200 ${
                    activeTab === tab
                      ? "border-b-2 border-[#FF3C02] text-[#FF3C02]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </div>
              ))}
            </div>

            {/* Task Categories (Desktop only) */}
            <div className="hidden lg:flex space-x-3 mb-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
              {taskCategories.map((category) => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-full text-xs font-medium ${
                    activeCategory === category
                      ? "bg-[#FF3C02] text-white shadow-md"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Activities List */}
            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center bg-gray-50 p-4 rounded-xl hover:bg-gray-100 transition duration-200"
                >
                  <img
                    src={activity.image}
                    alt="Task thumbnail"
                    className="w-16 h-16 rounded-lg mr-4 object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 mb-1">
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-500 mb-1">
                      Task By{" "}
                      <span className="font-semibold">{activity.taskBy}</span>
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <BadgeDollarSign className="h-3 w-3 mr-1 text-blue-900" />
                      <span>
                        {activity.amount} {activity.currency}
                      </span>
                      {activity.status === "verified" ? (
                        <BadgeCheck className="h-4 w-4 text-[#FF3C02] ml-2" />
                      ) : (
                        <XCircle className="h-4 w-4 text-[#FF3C02] ml-2" />
                      )}
                      <span className="ml-2 text-gray-600">
                        Due in {activity.dueDate}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition duration-200 flex items-center justify-center">
              View more
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          </div>
        </div>

        {/* Right Column - Notification Card (Hidden on mobile) */}
        <div className="hidden lg:block w-full lg:w-96 flex-shrink-0">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Notification
              </h3>
              <a
                href="#"
                className="text-[#FF3C02] text-sm font-medium flex items-center"
              >
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </a>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Member since {userDetails.memberSince}
            </p>

            <div className="space-y-4 mb-6">
              {notificationItems.map((item) => (
                <div key={item.id} className="flex items-start">
                  <img
                    src={item.image}
                    alt="Notification icon"
                    className="w-10 h-10 rounded-full mr-3 object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      <span className="font-bold">
                        {item.amount} {item.currency}
                      </span>{" "}
                      {item.message}
                    </p>
                    <p className="text-xs text-gray-500">{item.detail}</p>
                  </div>
                  <span className="text-xs text-gray-500">{item.time}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 text-sm text-blue-600">
              <a href="#" className="flex items-center hover:underline">
                How to receive payment?
                <HelpCircle className="h-4 w-4 ml-1" />
              </a>
              <a href="#" className="flex items-center hover:underline">
                Submitting a task
                <HelpCircle className="h-4 w-4 ml-1" />
              </a>
              <a href="#" className="flex items-center hover:underline">
                How to create new tasks
                <HelpCircle className="h-4 w-4 ml-1" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button for Quick Edit (Mobile and Tablet) */}
      <button
        onClick={() => setShowEditProfileModal(true)} // Open edit modal
        className="fixed bottom-24 right-4 bg-orange-500 text-white rounded-full p-4 shadow-lg lg:bottom-8 lg:right-8 hover:bg-orange-600 transition-colors duration-200 z-40 flex items-center justify-center"
        aria-label="Quick edit"
      >
        <Edit className="w-6 h-6" />
      </button>

      {/* Share Options Modal (visible when Web Share API is not supported) */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Share Profile
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <button
                onClick={copyProfileLink}
                className="flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors duration-200 text-sm"
              >
                <Copy className="w-5 h-5" /> Copy Link
              </button>
              <button
                onClick={shareToTwitter}
                className="flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors duration-200 text-sm"
              >
                <Twitter className="w-5 h-5" /> Twitter
              </button>
              <button
                onClick={shareToFacebook}
                className="flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors duration-200 text-sm"
              >
                <Facebook className="w-5 h-5" /> Facebook
              </button>
              <button
                onClick={shareToLinkedin}
                className="flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors duration-200 text-sm"
              >
                <Linkedin className="w-5 h-5" /> LinkedIn
              </button>
              <button
                onClick={shareToEmail}
                className="flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors duration-200 text-sm"
              >
                <Mail className="w-5 h-5" /> Email
              </button>
              <button
                onClick={shareToWhatsapp}
                className="flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors duration-200 text-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.52 3.42 1.49 4.87L2.05 22l5.06-1.48c1.37.74 2.92 1.15 4.93 1.15 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm3.89 13.06c-.15.26-.5.35-.86.13-.36-.22-1.27-.78-1.47-.86-.2-.08-.34-.08-.48.09-.14.17-.54.66-.66.8-.12.14-.23.16-.44.06-.2-.09-.85-.31-1.61-.99-.6-.54-1-1.2-1.12-1.37-.12-.17-.01-.26.09-.45.1-.19.23-.46.34-.69.11-.23.06-.43-.02-.6-.08-.18-.75-1.78-1.03-2.4-.28-.62-.57-.52-.78-.53-.2-.01-.44-.01-.68.01-.24.02-.63.09-.96.44-.33.35-1.27 1.23-1.27 2.96 0 1.73 1.3 3.4 1.49 3.63.19.23 2.53 4.14 6.2 5.51 3.67 1.37 3.67.97 4.34.91.68-.06 1.87-.76 2.15-1.5.28-.74.28-1.37.2-1.5.08-.14-.26-.22-.54-.36z" />
                </svg>
                WhatsApp
              </button>
            </div>
            <button
              onClick={() => setShowShareModal(false)}
              className="mt-4 w-full py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Image Upload Options Modal */}
      {showImageUploadOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Upload Profile Picture
            </h3>
            <div className="space-y-4">
              <button
                onClick={handleSelectFromGallery}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors duration-200"
              >
                <Image className="w-5 h-5" /> Select from Gallery
              </button>
              <button
                onClick={handleCaptureFromCamera}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors duration-200"
              >
                <Camera className="w-5 h-5" /> Take Photo
              </button>
            </div>
            <button
              onClick={() => setShowImageUploadOptions(false)}
              className="mt-6 w-full py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md overflow-y-auto max-h-[90vh] scrollbar-hide">
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
              Edit Profile
            </h3>
            <form className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <User className="inline-block w-4 h-4 mr-1 text-gray-500" />{" "}
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={userDetails.name}
                  onChange={handleUserDetailsChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  onChange={handleUserDetailsChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
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
                  onChange={handleUserDetailsChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="taskPosted"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <Send className="inline-block w-4 h-4 mr-1 text-gray-500" />{" "}
                  Tasks Posted
                </label>
                <input
                  type="number"
                  id="taskPosted"
                  name="taskPosted"
                  value={userDetails.taskPosted}
                  onChange={handleUserDetailsChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="totalSpent"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <Wallet className="inline-block w-4 h-4 mr-1 text-gray-500" />{" "}
                  Total Spent
                </label>
                <input
                  type="number"
                  id="totalSpent"
                  name="totalSpent"
                  value={userDetails.totalSpent}
                  onChange={handleUserDetailsChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="totalEarned"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <Gift className="inline-block w-4 h-4 mr-1 text-gray-500" />{" "}
                  Total Earned
                </label>
                <input
                  type="number"
                  id="totalEarned"
                  name="totalEarned"
                  value={userDetails.totalEarned}
                  onChange={handleUserDetailsChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="walletAddress"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <Eye className="inline-block w-4 h-4 mr-1 text-gray-500" />{" "}
                  Wallet Address
                </label>
                <input
                  type="text"
                  id="walletAddress"
                  name="walletAddress"
                  value={userDetails.walletAddress}
                  onChange={handleUserDetailsChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="px-4 py-2 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors duration-200"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bottom Navigation (Mobile Only) */}
      <MobileBottomNav />
    </div>
  );
};

export default Profile;
