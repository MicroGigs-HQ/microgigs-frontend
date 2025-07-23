"use client";
import React, { useState, useEffect, useRef } from "react";
import { useAccount } from "wagmi";
import { MobileNavLayout } from "../../components/layout/MobileNavLayout"; 

// Import your new components
import { ProfileHeader } from "../../components/profile/ProfileHeader";
import { StatsGrid } from "../../components/profile/StatsGrid";
import { ActivityOverviewChart } from "../../components/profile/ActivityOverviewChart";
import { ActivitiesSection } from "../../components/profile/ActivitiesSection";
import { NotificationsPanel } from "../../components/profile/NotificationsPanel";
import { ShareProfileModal } from "../../components/profile/ShareProfileModal";
import { ImageUploadOptionsModal } from "../../components/profile/ImageUploadOptionsModal";
import { EditProfileModal } from "../../components/profile/EditProfileModal";

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
    const [userDetails, setUserDetails] = useState<UserDetails>({
        name: "",
        memberSince: "Dec 25, 2023",
        taskComplete: 24,
        taskPosted: 12,
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

    // Load user data on component mount or address change
    useEffect(() => {
        const savedUsername = localStorage.getItem("microgigs_username") || "";
        setUsername(savedUsername);

        setUserDetails((prev) => ({
            ...prev,
            name: savedUsername || "User",
            walletAddress: address ? truncateAddress(address) : "",
        }));
    }, [address]);

    // Handle file input change (for both gallery and camera)
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : undefined;
        if (file) {
            console.log("Selected file:", file.name, file.type);
            alert(`Selected file: ${file.name}.`);
            // Here you would typically upload the file to a server
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

    // Dummy data for activities and notifications (replace with real data fetches)
    const activities: any[] = [];
    const notificationItems: any[] = [];

    if (!isConnected) {
        return (
            <MobileNavLayout>
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
            </MobileNavLayout>
        );
    }

    return (
        <MobileNavLayout>
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

                            <ActivityOverviewChart />

                            <ActivitiesSection activities={activities} />
                        </div>

                        {/* Right Column - Notification Card (Hidden on mobile) */}
                        <div className="hidden lg:block w-full lg:w-96 flex-shrink-0">
                            <NotificationsPanel
                                memberSince={userDetails.memberSince}
                                notificationItems={notificationItems}
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
        </MobileNavLayout>
    );
};

export default UserProfilePage;