import React from "react";
import { Copy, Twitter, Facebook, Linkedin, Mail } from "lucide-react";

interface ShareProfileModalProps {
    onClose: () => void;
}

export const ShareProfileModal: React.FC<ShareProfileModalProps> = ({
    onClose,
}) => {
    const copyProfileLink = () => {
        const profileLink = window.location.href; 
        navigator.clipboard
            .writeText(profileLink)
            .then(() => {
                alert("Profile link copied to clipboard!");
                onClose();
            })
            .catch((err) => {
                console.error("Failed to copy: ", err);
                alert("Could not copy link. Please copy it manually: " + profileLink);
            });
    };

    const shareToTwitter = () => {
        const text = encodeURIComponent("Check out my Microgigs profile!");
        const url = encodeURIComponent(window.location.href);
        window.open(
            `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
            "_blank"
        );
        onClose();
    };

    const shareToFacebook = () => {
        const url = encodeURIComponent(window.location.href);
        window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${url}`,
            "_blank"
        );
        onClose();
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
        onClose();
    };

    const shareToEmail = () => {
        const subject = encodeURIComponent("Check out my Microgigs Profile");
        const body = encodeURIComponent(
            `Hey, check out my Microgigs profile here: ${window.location.href}`
        );
        window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
        onClose();
    };

    const shareToWhatsapp = () => {
        const text = encodeURIComponent(
            `Check out my Microgigs profile: ${window.location.href}`
        );
        window.open(`https://wa.me/?text=${text}`, "_blank");
        onClose();
    };

    return (
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
                    onClick={onClose}
                    className="mt-4 w-full py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};