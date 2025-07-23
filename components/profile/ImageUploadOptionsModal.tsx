import React from "react";
import { Camera, Image } from "lucide-react";

interface ImageUploadOptionsModalProps {
    onSelectFromGallery: () => void;
    onCaptureFromCamera: () => void;
    onClose: () => void;
}

export const ImageUploadOptionsModal: React.FC<
    ImageUploadOptionsModalProps
> = ({ onSelectFromGallery, onCaptureFromCamera, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Upload Profile Picture
                </h3>
                <div className="space-y-4">
                    <button
                        onClick={onSelectFromGallery}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors duration-200"
                    >
                        <Image className="w-5 h-5" /> Select from Gallery
                    </button>
                    <button
                        onClick={onCaptureFromCamera}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors duration-200"
                    >
                        <Camera className="w-5 h-5" /> Take Photo
                    </button>
                </div>
                <button
                    onClick={onClose}
                    className="mt-6 w-full py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};