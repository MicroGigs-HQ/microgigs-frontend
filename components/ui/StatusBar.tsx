import React from "react";
import { Wifi, Signal, Battery } from "lucide-react";

const StatusBar: React.FC = () => {
  return (
    <div className="bg-white px-4 py-2 flex  shadow-lg  items-center justify-between text-black font-medium">
      <div className="text-lg font-semibold">9:41</div>

      <div className="flex items-center space-x-1">
        {/* Signal bars */}
        <div className="flex items-end space-x-[1px]">
          <div className="w-1 h-1 bg-black rounded-full"></div>
          <div className="w-1 h-2 bg-black rounded-full"></div>
          <div className="w-1 h-3 bg-black rounded-full"></div>
          <div className="w-1 h-4 bg-black rounded-full"></div>
        </div>

        {/* WiFi icon */}
        <Wifi className="w-4 h-4 text-black" />

        {/* Battery icon */}
        <div className="relative">
          <div className="w-6 h-3 border border-black rounded-[2px] flex items-center justify-end pr-[1px]">
            <div className="w-4 h-2 bg-black rounded-[1px]"></div>
          </div>
          <div className="absolute -right-[1px] top-[3px] w-[1px] h-1 bg-black rounded-r-sm"></div>
        </div>
      </div>
    </div>
  );
};
export default StatusBar;
