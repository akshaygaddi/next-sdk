import React from "react";
import { Globe, Lock, Check } from "lucide-react";
import { Label } from "@/components/ui/label";

const RoomPrivacySelection = ({ value, onChange }) => {
  const options = [
    {
      id: "public",
      icon: Globe,
      title: "Public Room",
      description: "Anyone can join this room",
      bgAccent: "bg-green-500/10",
      borderAccent: "border-green-500/50",
    },
    {
      id: "private",
      icon: Lock,
      title: "Private Room",
      description: "Only users with password can join",
      bgAccent: "bg-blue-500/10",
      borderAccent: "border-blue-500/50",
    },
  ];

  return (
    <div className="grid gap-4">
      {options.map((option) => {
        const Icon = option.icon;
        const isSelected = value === option.id;

        return (
          <div
            key={option.id}
            onClick={() => onChange(option.id)}
            className={`
              relative overflow-hidden rounded-lg border-2 p-4 
              transition-all duration-200 ease-in-out cursor-pointer
              hover:shadow-md
              ${isSelected ? `${option.borderAccent} ${option.bgAccent}` : "border-border hover:border-muted-foreground"}
            `}
          >
            <div className="flex items-start gap-4">
              <div
                className={`
                rounded-full p-2 
                ${isSelected ? option.bgAccent : "bg-muted"}
              `}
              >
                <Icon
                  className={`
                  h-5 w-5 
                  ${isSelected ? "text-foreground" : "text-muted-foreground"}
                `}
                />
              </div>

              <div className="flex-1 space-y-1">
                <Label className="text-base font-medium">{option.title}</Label>
                <p className="text-sm text-muted-foreground">
                  {option.description}
                </p>
              </div>

              <div
                className={`
                flex h-6 w-6 items-center justify-center rounded-full
                transition-all duration-200
                ${isSelected ? `${option.bgAccent} opacity-100` : "opacity-0"}
              `}
              >
                <Check
                  className={`
                  h-4 w-4 
                  ${isSelected ? "text-foreground" : "text-transparent"}
                `}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RoomPrivacySelection;
