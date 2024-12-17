"use client";
import {
  EnhancedCTA,
  SmartRoomsShowcase,
  StartupLanding,
} from "@/app/home/activeSections";

const EnhancedLanding = () => {

  return (
    <div className=" min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <StartupLanding />

      {/* Smart Rooms */}
      <div className="border-y-2 border-orange-500">
        <SmartRoomsShowcase />
      </div>

      {/* CTA Section */}

      <EnhancedCTA />
    </div>
  );
};

export default EnhancedLanding;