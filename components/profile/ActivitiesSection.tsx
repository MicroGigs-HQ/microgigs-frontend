import React, { useState } from "react";
import { ClipboardCheck, BadgeCheck, ExternalLink } from "lucide-react";

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
    category: 'Development' | 'Content' | 'Design' | 'Marketing' | 'Translation' | 'Other';
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

    const taskCategories = ["All", "Development", "Content", "Design", "Marketing", "Translation", "Other"];

    // Filter activities based on active tab and category
    const filteredActivities = activities
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

    // Get category-specific thumbnail
    const getCategoryThumbnail = (category: string): string => {
        const thumbnails = {
            'Development': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=150&h=150&fit=crop',
            'Content': 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=150&h=150&fit=crop',
            'Design': 'https://images.unsplash.com/photo-1541462608143-67571c6738dd?w=150&h=150&fit=crop',
            'Marketing': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=150&h=150&fit=crop',
            'Translation': 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=150&h=150&fit=crop',
            'Other': 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=150&h=150&fit=crop'
        };
        return thumbnails[category as keyof typeof thumbnails] || thumbnails['Other'];
    };

    // Handle activity click to navigate to task details
    const handleActivityClick = (activityId: string) => {
        window.location.href = `/task/${activityId}`;
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 lg:hidden">
                Your Activities
            </h3>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 hidden lg:block">
                Your Activities
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
                        {tab} ({activities.filter(a => a.type === tab).length})
                    </div>
                ))}
            </div>

            {/* Task Categories (Desktop only) */}
            <div className="hidden lg:flex space-x-3 mb-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
                {taskCategories.map((category) => {
                    const count = activities.filter(a => 
                        a.type === activeTab && 
                        (category === "All" || a.category === category)
                    ).length;
                    
                    return (
                        <button
                            key={category}
                            className={`px-4 py-2 rounded-full text-xs font-medium transition-colors duration-200 ${
                                activeCategory === category
                                    ? "bg-[#FF3C02] text-white shadow-md"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                            onClick={() => setActiveCategory(category)}
                        >
                            {category} ({count})
                        </button>
                    );
                })}
            </div>

            <div className="space-y-4">
                {filteredActivities.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <ClipboardCheck className="w-8 h-8 text-gray-400" />
                        </div>
                        <h4 className="text-lg font-medium text-gray-900 mb-2">
                            {activeTab === "My tasks" ? "No tasks posted yet" : "No applications yet"}
                        </h4>
                        <p className="text-gray-500 text-sm">
                            {activeTab === "My tasks" 
                                ? "Start by creating your first task to get work done." 
                                : "Browse available tasks and apply to start earning."}
                        </p>
                        <button
                            onClick={() => window.location.href = activeTab === "My tasks" ? "/create-gig" : "/"}
                            className="mt-4 px-6 py-2 bg-[#FF3C02] text-white rounded-lg hover:bg-[#e6350a] transition-colors"
                        >
                            {activeTab === "My tasks" ? "Post a Task" : "Browse Tasks"}
                        </button>
                    </div>
                ) : (
                    filteredActivities.map((activity) => (
                        <div
                            key={activity.id}
                            className="flex items-start bg-gray-50 p-4 rounded-xl hover:bg-gray-100 transition duration-200 cursor-pointer group"
                            onClick={() => handleActivityClick(activity.id)}
                        >
                            <img 
                                src={getCategoryThumbnail(activity.category)} 
                                alt={`${activity.category} task`} 
                                className="w-16 h-16 rounded-lg object-cover flex-shrink-0 mr-4" 
                            />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-2">
                                    <h5 className="font-semibold text-gray-800 text-sm leading-tight group-hover:text-[#FF3C02] transition-colors">
                                        {activity.title}
                                        <ExternalLink className="inline-block w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </h5>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 flex-shrink-0 ${getStatusColor(activity.status)}`}>
                                        {activity.status}
                                    </span>
                                </div>
                                
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                    {activity.description}
                                </p>
                                
                                <div className="flex items-center text-xs text-gray-500 mb-3">
                                    <span className="inline-block px-2 py-1 bg-gray-200 rounded-full mr-2">
                                        {activity.category}
                                    </span>
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

            {/* Summary Stats */}
            {activities.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                            <p className="text-2xl font-bold text-gray-800">
                                {activities.filter(a => a.type === "My tasks").length}
                            </p>
                            <p className="text-sm text-gray-500">Tasks Posted</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-800">
                                {activities.filter(a => a.type === "Tasks Applied").length}
                            </p>
                            <p className="text-sm text-gray-500">Applications</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};