import React, { useState } from "react";

const AppHeader: React.FC = () => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle the input submission here
    console.log("AI Assistant query:", inputValue);
  };
  return (
    <div className="bg-white px-4 py-4">
      {/* MicroGigs Logo/Brand */}
      <div className="flex items-center justify-center mb-4">
        <img
          src="/micogigs-ogo.png"
          alt="micro gig logo"
          className="h-8 w-32 object-contain"
        />
      </div>

      {/* User Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center relative">
            <span className="text-white text-lg font-medium">G</span>
            {/* Online indicator dot */}
            <div className="absolute -bottom-0 -right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <div className="flex items-center space-x-1">
              <h1 className="text-gray-900 font-semibold text-lg">Gm, Weng</h1>
              <span className="text-lg">👋</span>
            </div>
            <p className="text-gray-500 text-sm">What are we making today?</p>
          </div>
        </div>
      </div>

      {/* AI Assistant Section */}
      <div className="mt-4">
        <form onSubmit={handleInputSubmit} className="relative">
          <div className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Ask your AI assistant anything"
              className="w-full px-4 py-3 pr-12 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-400 transition-all duration-200"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors duration-200"
            >
              <span className="text-lg">✨</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AppHeader;
