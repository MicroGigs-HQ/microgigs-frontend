import { Search } from "lucide-react";

export default function SearchBar() {
    return (
        <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
                type="text"
                placeholder="Ask your AI assistant anything"
                className="w-full text-sm bg-gray-100 border border-gray-200 rounded-xl pl-10 pr-12 py-2 md:py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-orange-500 hover:bg-orange-600 p-1.5 rounded-lg transition-colors">
                <Search className="w-3 h-3 text-white" />
            </button>
        </div>
    );
}