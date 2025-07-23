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
    // Dummy data for notifications if empty
    const dummyNotifications: NotificationItem[] = [
        {
            id: "notif_001",
            type: "task_update",
            title: "Task Completed",
            message: "Your 'Mobile App UI/UX Design' task has been marked as completed. Payment will be processed within 24 hours.",
            timestamp: "2 hours ago",
            isRead: false,
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
            actionUrl: "/tasks/task_003"
        },
        {
            id: "notif_002",
            type: "payment",
            title: "Payment Received",
            message: "You've received 800 USDC for completing the Mobile App UI/UX Design project.",
            timestamp: "4 hours ago",
            isRead: false,
            actionUrl: "/wallet/transactions"
        },
        {
            id: "notif_003",
            type: "message",
            title: "New Message",
            message: "TechCorp Solutions sent you a message about the E-commerce Website project.",
            timestamp: "6 hours ago",
            isRead: true,
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=40&h=40&fit=crop&crop=face",
            actionUrl: "/messages/techcorp"
        },
        {
            id: "notif_004",
            type: "task_update",
            title: "Application Status Update",
            message: "Your application for 'WordPress Plugin Development' is under review.",
            timestamp: "1 day ago",
            isRead: true,
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
            actionUrl: "/tasks/task_006"
        },
        {
            id: "notif_005",
            type: "system",
            title: "Profile Verification",
            message: "Complete your profile verification to increase your chances of getting hired.",
            timestamp: "2 days ago",
            isRead: true,
            actionUrl: "/profile/verification"
        }
    ];

    const displayedNotifications = notificationItems.length > 0 ? notificationItems : dummyNotifications;

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

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                <a
                    href="#"
                    className="text-[#FF3C02] text-sm font-medium flex items-center hover:text-[#e6350a] transition-colors"
                >
                    View All
                    <ArrowRight className="h-4 w-4 ml-1" />
                </a>
            </div>
            <p className="text-xs text-gray-500 mb-4">Member since {memberSince}</p>

            <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
                {displayedNotifications.length === 0 ? (
                    <div className="text-center py-8">
                        <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p className="text-gray-500 text-sm">No notifications yet</p>
                    </div>
                ) : (
                    displayedNotifications.slice(0, 5).map((item) => (
                        <div 
                            key={item.id} 
                            className={`flex items-start space-x-3 p-3 rounded-lg transition-colors cursor-pointer ${
                                !item.isRead ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-50'
                            }`}
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

            <div className="space-y-3 text-sm text-blue-600 border-t border-gray-100 pt-4">
                <a href="#" className="flex items-center hover:underline transition-colors">
                    How to receive payment?
                    <HelpCircle className="h-4 w-4 ml-1" />
                </a>
                <a href="#" className="flex items-center hover:underline transition-colors">
                    Submitting a task
                    <HelpCircle className="h-4 w-4 ml-1" />
                </a>
                <a href="#" className="flex items-center hover:underline transition-colors">
                    How to create new tasks
                    <HelpCircle className="h-4 w-4 ml-1" />
                </a>
            </div>
        </div>
    );
};