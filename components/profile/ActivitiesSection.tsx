import React, { useState } from "react";
import { ClipboardCheck, BadgeCheck } from "lucide-react";

interface Activity {
    id: string;
    thumbnail: string;
    title: string;
    description: string;
    creatorInfo: string;
    isVerified: boolean;
    paymentAmount: string;
    status: 'Ongoing' | 'Completed' | 'Pending' | 'In Review' | 'Draft';
    deadline: string;
    category: 'Development' | 'Content' | 'Design' | 'Other';
    type: 'My tasks' | 'Tasks Applied';
}

interface ActivitiesSectionProps {
    activities: Activity[]; 
}

export const ActivitiesSection: React.FC<ActivitiesSectionProps> = ({
    activities,
}) => {
    const [activeTab, setActiveTab] = useState("My tasks");
    const [activeCategory, setActiveCategory] = useState("All");

    const taskCategories = ["All", "Development", "Content", "Design", "Other"];

    // Dummy data for task cards if `activities` is empty for demonstration
    const dummyActivities: Activity[] = [
        {
            id: "task_001",
            thumbnail: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=150&h=150&fit=crop",
            title: "Build E-commerce Website with React",
            description: "Develop a full-featured e-commerce platform with product catalog, shopping cart, and payment integration using React and Node.js.",
            creatorInfo: "TechCorp Solutions",
            isVerified: true,
            paymentAmount: "1200 USDC",
            status: "Ongoing",
            deadline: "2025-08-15",
            category: "Development",
            type: "My tasks"
        },
        {
            id: "task_002",
            thumbnail: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=150&h=150&fit=crop",
            title: "Social Media Content Strategy",
            description: "Create a comprehensive 30-day content calendar with engaging posts, stories, and video content for Instagram and TikTok.",
            creatorInfo: "Digital Marketing Pro",
            isVerified: true,
            paymentAmount: "450 USDC",
            status: "In Review",
            deadline: "2025-07-30",
            category: "Content",
            type: "My tasks"
        },
        {
            id: "task_003",
            thumbnail: "https://images.unsplash.com/photo-1541462608143-67571c6738dd?w=150&h=150&fit=crop",
            title: "Mobile App UI/UX Design",
            description: "Design complete user interface and user experience for a fitness tracking mobile application with modern, clean aesthetics.",
            creatorInfo: "StartupXYZ",
            isVerified: false,
            paymentAmount: "800 USDC",
            status: "Completed",
            deadline: "2025-07-20",
            category: "Design",
            type: "My tasks"
        },
        {
            id: "task_006",
            thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=150&h=150&fit=crop",
            title: "WordPress Plugin Development",
            description: "Develop a custom WordPress plugin for automated social media posting with advanced scheduling and analytics features.",
            creatorInfo: "WebDev Agency",
            isVerified: true,
            paymentAmount: "900 USDC",
            status: "Pending",
            deadline: "2025-09-01",
            category: "Development",
            type: "Tasks Applied"
        },
        {
            id: "task_007",
            thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=150&h=150&fit=crop",
            title: "Brand Identity Design Package",
            description: "Create complete brand identity including logo, color palette, typography, and brand guidelines for a new fintech startup.",
            creatorInfo: "FinTech Innovations",
            isVerified: false,
            paymentAmount: "750 USDC",
            status: "In Review",
            deadline: "2025-08-25",
            category: "Design",
            type: "Tasks Applied"
        },
        {
            id: "task_008",
            thumbnail: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=150&h=150&fit=crop",
            title: "SEO Content Optimization",
            description: "Optimize existing website content for search engines, conduct keyword research, and improve site structure for better rankings.",
            creatorInfo: "Growth Marketing Team",
            isVerified: true,
            paymentAmount: "400 USDC",
            status: "Pending",
            deadline: "2025-08-20",
            category: "Content",
            type: "Tasks Applied"
        }
    ];

    const displayedActivities = activities.length > 0 ? activities : dummyActivities;

    // Filter activities based on active tab and category
    const filteredActivities = displayedActivities
        .filter(activity => activity.type === activeTab)
        .filter(activity => activeCategory === "All" || activity.category === activeCategory);

    const getStatusColor = (status: Activity['status']): string => {
        switch (status) {
            case 'Completed': return 'text-green-600 bg-green-100';
            case 'Ongoing': return 'text-blue-600 bg-blue-100';
            case 'Pending': return 'text-yellow-600 bg-yellow-100';
            case 'In Review': return 'text-purple-600 bg-purple-100';
            case 'Draft': return 'text-gray-600 bg-gray-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 lg:hidden">
                Discover Opportunities
            </h3>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 hidden lg:block">
                Your activities
            </h3>
            
            {/* Main Tabs */}
            <div className="flex space-x-8 border-b border-gray-200 mb-6">
                {["My tasks", "Tasks Applied"].map((tab) => (
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
                        className={`px-4 py-2 rounded-full text-xs font-medium transition-colors duration-200 ${
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

            <div className="space-y-4">
                {filteredActivities.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <ClipboardCheck className="w-8 h-8 text-gray-400" />
                        </div>
                        <h4 className="text-lg font-medium text-gray-900 mb-2">
                            No activities yet
                        </h4>
                        <p className="text-gray-500 text-sm">
                            Start by browsing and applying to tasks.
                        </p>
                    </div>
                ) : (
                    filteredActivities.map((activity) => (
                        <div
                            key={activity.id}
                            className="flex items-start bg-gray-50 p-4 rounded-xl hover:bg-gray-100 transition duration-200 cursor-pointer"
                        >
                            <img 
                                src={activity.thumbnail} 
                                alt="Task thumbnail" 
                                className="w-16 h-16 rounded-lg object-cover flex-shrink-0 mr-4" 
                            />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-2">
                                    <h5 className="font-semibold text-gray-800 text-sm leading-tight">
                                        {activity.title}
                                    </h5>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${getStatusColor(activity.status)}`}>
                                        {activity.status}
                                    </span>
                                </div>
                                
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                    {activity.description}
                                </p>
                                
                                <div className="flex items-center text-xs text-gray-500 mb-3">
                                    <span>{activity.creatorInfo}</span>
                                    {activity.isVerified && (
                                        <BadgeCheck className="w-3 h-3 ml-1 text-blue-500" />
                                    )}
                                </div>
                                
                                <div className="flex items-center justify-between">
                                    <span className="text-green-600 font-bold text-sm">
                                        {activity.paymentAmount}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        Due: {formatDate(activity.deadline)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};