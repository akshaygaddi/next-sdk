import React from "react";
import { Loader2, Users, ArrowLeft } from "lucide-react";

const EmptyRoomsState = ({ isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-6 px-4">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-amber-500/20 blur-xl animate-pulse rounded-full" />
          <div className="relative bg-card/50 backdrop-blur-sm p-8 rounded-2xl border border-orange-500/20">
            <Loader2 className="h-12 w-12 text-orange-500 animate-spin" />
          </div>
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-semibold">Loading Your Rooms</h3>
          <p className="text-muted-foreground">
            Just a moment while we fetch your spaces...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto px-4 space-y-8">
      {/* Animated Icon */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-amber-500/20 blur-xl animate-pulse rounded-full" />
        <div className="relative bg-card/50 backdrop-blur-sm p-8 rounded-2xl border border-orange-500/20 group-hover:border-orange-500/40 transition-colors">
          <Users className="h-12 w-12 text-orange-500" />
        </div>
      </div>

      {/* Title and Description */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
          No Rooms Yet
        </h2>
        <div className="space-y-2">
          <p className="text-muted-foreground">
            Create your first room to start engaging with others in interactive
            discussions.
          </p>
          <p className="flex items-center justify-center gap-2 text-sm font-medium text-orange-500">
            <ArrowLeft className="h-4 w-4" />
            Use the sidebar to create a new room
          </p>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-sm mt-8">
        {[
          {
            title: "Real-time Chat",
            description: "Engage in live discussions with room members",
          },
          {
            title: "Rich Features",
            description: "Share code, polls, and more in your discussions",
          },
          {
            title: "Smart Rooms",
            description: "Rooms adapt to your community needs",
          },
          {
            title: "Secure Space",
            description: "Private and secure environment for your team",
          },
        ].map((feature, index) => (
          <div
            key={index}
            className="bg-card/50 backdrop-blur-sm p-4 rounded-xl border border-orange-500/10 hover:border-orange-500/20 transition-colors"
          >
            <h3 className="font-semibold">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmptyRoomsState;
