import React from "react";
import { ArrowRight, Bell, HelpCircle, MessageCircle, DollarSign, AlertCircle, Settings } from "lucide-react";

interface NotificationItem {
    id: string;
    type: 'task_update' | 'payment' | 'message' | 'system';
    title: string;
    message: string;
    timestamp: string;
    isRead: boolean;
    avatar?: string;
    actionUrl?: string;
}

interface NotificationsPanelProps {
    memberSince: string;
    notificationItems: NotificationItem[];
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
    memberSince,
    notificationItems,
}) => {
    const getNotificationIcon = (type: NotificationItem['type']) => {
        switch (type) {
            case 'task_update':
                return <AlertCircle className="w-4 h-4 text-blue-500" />;
            case 'payment':
                return <DollarSign className="w-4 h-4 text-green-500" />;
            case 'message':
                return <MessageCircle className="w-4 h-4 text-purple-500" />;
            case 'system':
                return <Settings className="w-4 h-4 text-gray-500" />;
            default:
                return <Bell className="w-4 h-4 text-gray-400" />;
        }
    };

    const handleNotificationClick = (item: NotificationItem) => {
        if (item.actionUrl) {
            window.location.href = item.actionUrl;
        }
        // Mark as read logic would go here
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                {notificationItems.length > 0 && (
                    <a
                        href="/notifications"
                        className="text-[#FF3C02] text-sm font-medium flex items-center hover:text-[#e6350a] transition-colors"
                    >
                        View All
                        <ArrowRight className="h-4 w-4 ml-1" />
                    </a>
                )}
            </div>
            <p className="text-xs text-gray-500 mb-4">Member since {memberSince}</p>

            <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
                {notificationItems.length === 0 ? (
                    <div className="text-center py-8">
                        <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p className="text-gray-500 text-sm mb-2">No notifications yet</p>
                        <p className="text-gray-400 text-xs">
                            You'll receive notifications about task updates, payments, and messages here.
                        </p>
                    </div>
                ) : (
                    notificationItems.slice(0, 5).map((item) => (
                        <div 
                            key={item.id} 
                            className={`flex items-start space-x-3 p-3 rounded-lg transition-colors cursor-pointer ${
                                !item.isRead ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-50'
                            }`}
                            onClick={() => handleNotificationClick(item)}
                        >
                            <div className="flex-shrink-0 mt-1">
                                {item.avatar ? (
                                    <img 
                                        src={item.avatar} 
                                        alt="Avatar" 
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                        {getNotificationIcon(item.type)}
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {item.title}
                                    </p>
                                    {!item.isRead && (
                                        <div className="w-2 h-2 bg-[#FF3C02] rounded-full flex-shrink-0 ml-2"></div>
                                    )}
                                </div>
                                
                                <p className="text-xs text-gray-600 line-clamp-2 mb-1">
                                    {item.message}
                                </p>
                                
                                <p className="text-xs text-gray-400">
                                    {item.timestamp}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Help Links */}
            <div className="space-y-3 text-sm text-blue-600 border-t border-gray-100 pt-4">
                <a 
                    href="/help/payments" 
                    className="flex items-center hover:underline transition-colors"
                >
                    How to receive payment?
                    <HelpCircle className="h-4 w-4 ml-1" />
                </a>
                <a 
                    href="/help/submitting" 
                    className="flex items-center hover:underline transition-colors"
                >
                    Submitting a task
                    <HelpCircle className="h-4 w-4 ml-1" />
                </a>
                <a 
                    href="/help/creating" 
                    className="flex items-center hover:underline transition-colors"
                >
                    How to create new tasks
                    <HelpCircle className="h-4 w-4 ml-1" />
                </a>
            </div>

            {/* Quick Actions */}
            <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex space-x-2">
                    <button
                        onClick={() => window.location.href = '/create-gig'}
                        className="flex-1 px-3 py-2 bg-[#FF3C02] text-white text-xs font-medium rounded-lg hover:bg-[#e6350a] transition-colors"
                    >
                        Post Task
                    </button>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Browse Tasks
                    </button>
                </div>
            </div>
        </div>
    );
};