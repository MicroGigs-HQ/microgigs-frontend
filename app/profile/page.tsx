"use client";
import React, { useState, useEffect, useRef } from "react";
import { useAccount } from "wagmi";
import ResponsiveNavbar from "../../components/layout/ResponsiveNavbar";

// Import your new components
import { ProfileHeader } from "../../components/profile/ProfileHeader";
import { StatsGrid } from "../../components/profile/StatsGrid";
import { ActivityOverviewChart } from "../../components/profile/ActivityOverviewChart";
import { ActivitiesSection } from "../../components/profile/ActivitiesSection";
import { NotificationsPanel } from "../../components/profile/NotificationsPanel";
import { ShareProfileModal } from "../../components/profile/ShareProfileModal";
import { ImageUploadOptionsModal } from "../../components/profile/ImageUploadOptionsModal";
import { EditProfileModal } from "../../components/profile/EditProfileModal";

// Import hooks for real data
import { useGetUserProfile } from "../../hooks/useGetUserProfile";
import { usePostedTasks } from "../../hooks/useGetUserPostedTasks";
import { useAssignedTasks } from "../../hooks/useGetUserAssignedTasks";
import { formatEther } from "viem";

import { Edit } from "lucide-react";

const truncateAddress = (address: string | undefined): string => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export interface UserDetails {
    name: string;
    memberSince: string;
    taskComplete: number;
    taskPosted: number;
    totalSpent: number;
    totalEarned: number;
    walletAddress: string;
}

const UserProfilePage = () => {
    const { address, isConnected } = useAccount();

    const [username, setUsername] = useState<string>("");
    const [hasUsername, setHasUsername] = useState(false);
    const [userDetails, setUserDetails] = useState<UserDetails>({
        name: "",
        memberSince: "Dec 25, 2023",
        taskComplete: 0,
        taskPosted: 0,
        totalSpent: 0,
        totalEarned: 0,
        walletAddress: "",
    });

    // Modals state
    const [showShareModal, setShowShareModal] = useState(false);
    const [showImageUploadOptions, setShowImageUploadOptions] = useState(false);
    const [showEditProfileModal, setShowEditProfileModal] = useState(false);

    // Refs for hidden file input elements
    const galleryInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);

    // Contract addresses
    const factoryAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

    // Real contract data hooks - CORRECTED PROPERTY NAMES
    const { profile, profileLoading, profileError } = useGetUserProfile(address);
    const { tasksPosted, refreshPostedTasks } = usePostedTasks(factoryAddress, address);
    const { tasksAssigned, loadingAssignedTasks, errorAssignedTasks } = useAssignedTasks(factoryAddress, address);

    // Load user data on component mount or address change
    useEffect(() => {
        const savedUsername = localStorage.getItem("microgigs_username") || "";
        setUsername(savedUsername);
        setHasUsername(!!savedUsername);

        setUserDetails((prev) => ({
            ...prev,
            name: savedUsername || "User",
            walletAddress: address ? truncateAddress(address) : "",
        }));
    }, [address]);

    // Update user details when contract data loads
    useEffect(() => {
        if (profile && !profileLoading) {
            console.log("Profile data loaded:", profile);
            
            // Format member since date
            const memberSinceDate = new Date(Number(profile.memberSince) * 1000);
            const formattedDate = memberSinceDate.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
            });

            setUserDetails(prev => ({
                ...prev,
                taskComplete: Number(profile.tasksCompleted),
                taskPosted: Number(profile.tasksPosted),
                totalSpent: Number(formatEther(profile.totalSpent)),
                totalEarned: Number(formatEther(profile.totalEarned)),
                memberSince: formattedDate,
            }));
        }
    }, [profile, profileLoading]);

    // Combine tasks for activities section
    const allActivities = React.useMemo(() => {
        const activities: any[] = [];

        // Add posted tasks as "My tasks"
        if (tasksPosted && tasksPosted.length > 0) {
            tasksPosted.forEach(task => {
                activities.push({
                    id: task.taskAddress,
                    thumbnail: `https://images.unsplash.com/photo-1551650975-87deedd944c3?w=150&h=150&fit=crop`,
                    title: task.title,
                    description: task.description,
                    creatorInfo: "You",
                    isVerified: true,
                    paymentAmount: `${Number(task.reward) / 1e18} ETH`,
                    status: getTaskStatus(task.status),
                    deadline: new Date(Number(task.deadline) * 1000).toISOString().split('T')[0],
                    category: task.category || "Other",
                    type: "My tasks"
                });
            });
        }

        // Add assigned tasks as "Tasks Applied"
        if (tasksAssigned && tasksAssigned.length > 0) {
            tasksAssigned.forEach(task => {
                activities.push({
                    id: task.taskAddress,
                    thumbnail: `https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=150&h=150&fit=crop`,
                    title: task.title,
                    description: task.description,
                    creatorInfo: truncateAddress(task.poster),
                    isVerified: false,
                    paymentAmount: `${Number(task.reward) / 1e18} ETH`,
                    status: getTaskStatus(task.status),
                    deadline: new Date(Number(task.deadline) * 1000).toISOString().split('T')[0],
                    category: task.category || "Other",
                    type: "Tasks Applied"
                });
            });
        }

        return activities;
    }, [tasksPosted, tasksAssigned]);

    // Helper function to convert status number to readable status
    function getTaskStatus(status: number): 'Ongoing' | 'Completed' | 'Pending' | 'In Review' | 'Draft' {
        switch (status) {
            case 0: return 'Pending'; // OPEN
            case 1: return 'In Review'; // ASSIGNED
            case 2: return 'Ongoing'; // IN_PROGRESS
            case 3: return 'Completed'; // COMPLETED
            case 4: return 'Completed'; // DISPUTE_RESOLVED
            case 5: return 'Draft'; // CANCELED
            default: return 'Pending';
        }
    }

    // Handle file input change (for both gallery and camera)
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : undefined;
        if (file) {
            console.log("Selected file:", file.name, file.type);
            alert(`Selected file: ${file.name}.`);
        }
    };

    // Handle changes in the edit profile form
    const handleUserDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserDetails((prevDetails) => ({
            ...prevDetails,
            [name]:
                name === "taskComplete" ||
                name === "taskPosted" ||
                name === "totalSpent" ||
                name === "totalEarned"
                    ? Number(value)
                    : value,
        }));
    };

    // Handle saving the edited profile details
    const handleSaveProfile = () => {
        if (userDetails.name !== username) {
            localStorage.setItem("microgigs_username", userDetails.name);
            setUsername(userDetails.name);
        }
        console.log("Saving user details:", userDetails);
        alert("Profile updated successfully!");
        setShowEditProfileModal(false);
    };

    // Handle Get Started click (for navbar)
    const handleGetStartedClick = () => {
        // You can implement welcome modal or redirect logic here
        console.log("Get Started clicked from profile page");
    };

    // Add a state to track if we've checked the connection status
    const [hasCheckedConnection, setHasCheckedConnection] = useState(false);

    // Check connection status after component mounts
    useEffect(() => {
        const timer = setTimeout(() => {
            setHasCheckedConnection(true);
        }, 1000); // Give wagmi time to check connection status

        return () => clearTimeout(timer);
    }, []);

    // Only show connection prompt after we've checked and confirmed not connected
    if (hasCheckedConnection && !isConnected) {
        return (
            <ResponsiveNavbar 
                username={username}
                hasUsername={hasUsername}
                handleGetStartedClick={handleGetStartedClick}
            >
                <div className="min-h-screen bg-gray-100 text-gray-900 font-sans flex items-center justify-center p-4">
                    <div className="bg-white p-8 rounded-xl shadow-sm text-center max-w-md">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Connect Your Wallet
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Please connect your wallet to view your profile.
                        </p>
                        <button
                            onClick={() => (window.location.href = "/")}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl transition-colors"
                        >
                            Go to Home
                        </button>
                    </div>
                </div>
            </ResponsiveNavbar>
        );
    }

    // Show loading while checking connection or fetching data
    if (!hasCheckedConnection || (isConnected && (profileLoading || loadingAssignedTasks))) {
        return (
            <ResponsiveNavbar 
                username={username}
                hasUsername={hasUsername}
                handleGetStartedClick={handleGetStartedClick}
            >
                <div className="min-h-screen bg-gray-100 text-gray-900 font-sans flex items-center justify-center p-4">
                    <div className="bg-white p-8 rounded-xl shadow-sm text-center max-w-md">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Loading Profile
                        </h2>
                        <p className="text-gray-600">
                            Fetching your data from the blockchain...
                        </p>
                    </div>
                </div>
            </ResponsiveNavbar>
        );
    }

    // Show error if there's an issue loading data
    if (profileError || errorAssignedTasks) {
        return (
            <ResponsiveNavbar 
                username={username}
                hasUsername={hasUsername}
                handleGetStartedClick={handleGetStartedClick}
            >
                <div className="min-h-screen bg-gray-100 text-gray-900 font-sans flex items-center justify-center p-4">
                    <div className="bg-white p-8 rounded-xl shadow-sm text-center max-w-md">
                        <h2 className="text-xl font-semibold text-red-600 mb-4">
                            Error Loading Profile
                        </h2>
                        <p className="text-gray-600 mb-6">
                            {profileError || errorAssignedTasks}
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </ResponsiveNavbar>
        );
    }

    return (
        <ResponsiveNavbar 
            username={username}
            hasUsername={hasUsername}
            handleGetStartedClick={handleGetStartedClick}
        >
            <div className="min-h-screen bg-gray-100 text-gray-900 font-sans">
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
                    capture="environment"
                    className="hidden"
                />

                {/* Debug info - remove this after testing */}
                {/* <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg m-4">
                    <h4 className="font-bold text-yellow-800">Debug Info:</h4>
                    <p className="text-sm text-yellow-700">
                        Profile: {profile ? 'Loaded' : 'Not loaded'} | 
                        Posted Tasks: {tasksPosted?.length || 0} | 
                        Assigned Tasks: {tasksAssigned?.length || 0} |
                        Total Activities: {allActivities.length}
                    </p>
                </div> */}

                {/* Main Container */}
                <div className="p-4">
                    <div className="container mx-auto flex flex-col lg:flex-row gap-6 lg:gap-8 max-w-7xl">
                        {/* Left Column */}
                        <div className="flex-1 flex flex-col gap-6">
                            <ProfileHeader
                                username={username}
                                userDetails={userDetails}
                                setShowImageUploadOptions={setShowImageUploadOptions}
                                setShowShareModal={setShowShareModal}
                            />

                            <StatsGrid userDetails={userDetails} />

                            <ActivityOverviewChart activities={allActivities} />

                            <ActivitiesSection activities={allActivities} />
                        </div>

                        {/* Right Column - Notification Card (Hidden on mobile) */}
                        <div className="hidden lg:block w-full lg:w-96 flex-shrink-0">
                            <NotificationsPanel
                                memberSince={userDetails.memberSince}
                                notificationItems={[]}
                            />
                        </div>
                    </div>

                    {/* Floating Action Button for Quick Edit */}
                    <button
                        onClick={() => setShowEditProfileModal(true)}
                        className="fixed bottom-24 right-4 bg-orange-500 text-white rounded-full p-4 shadow-lg lg:bottom-8 lg:right-8 hover:bg-orange-600 transition-colors duration-200 z-40 flex items-center justify-center"
                        aria-label="Quick edit"
                    >
                        <Edit className="w-6 h-6" />
                    </button>

                    {/* Modals */}
                    {showShareModal && (
                        <ShareProfileModal onClose={() => setShowShareModal(false)} />
                    )}

                    {showImageUploadOptions && (
                        <ImageUploadOptionsModal
                            onSelectFromGallery={() => {
                                setShowImageUploadOptions(false);
                                galleryInputRef.current?.click();
                            }}
                            onCaptureFromCamera={() => {
                                setShowImageUploadOptions(false);
                                cameraInputRef.current?.click();
                            }}
                            onClose={() => setShowImageUploadOptions(false)}
                        />
                    )}

                    {showEditProfileModal && (
                        <EditProfileModal
                            userDetails={userDetails}
                            onUserDetailsChange={handleUserDetailsChange}
                            onSave={handleSaveProfile}
                            onClose={() => setShowEditProfileModal(false)}
                        />
                    )}
                </div>
            </div>
        </ResponsiveNavbar>
    );
};

export default UserProfilePage;