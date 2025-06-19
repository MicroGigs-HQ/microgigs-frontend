import React from "react";
import AppHeader from "@/components/ui/AppHeader";
import StatusBar from "@/components/ui/StatusBar";

const MobileHeader: React.FC = () => {
  return (
    <div className="w-full">
      <StatusBar />
      <AppHeader />
    </div>
  );
};

export default MobileHeader;
