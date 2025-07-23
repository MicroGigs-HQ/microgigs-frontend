import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { UserDetails } from "../../app/profile/page"; 

interface StatsGridProps {
    userDetails: UserDetails;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ userDetails }) => {
    const [isStatsCollapsed, setIsStatsCollapsed] = useState(false);

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Your Stats</h3>
                <button
                    onClick={() => setIsStatsCollapsed(!isStatsCollapsed)}
                    className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    aria-label={isStatsCollapsed ? "Expand stats" : "Collapse stats"}
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
    );
};