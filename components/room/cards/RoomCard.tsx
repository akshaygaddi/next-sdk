import React, {useState} from "react";
import {motion} from "motion/react";
import {cn} from "@/lib/utils";
import {ChevronRight} from "lucide-react";


const RoomCard: React.FC<{
    room: Room,
    onJoin: (roomName: string) => Promise<void>,
    isUserRoom?: boolean
}> = ({ room, onJoin, isUserRoom = false }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={cn(
                "bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-4 flex items-center justify-between space-x-3 group",
                isUserRoom ? "border-l-4 border-purple-500" : "border-l-4 border-blue-500"
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex-grow">
                <h3 className="font-semibold text-gray-800 group-hover:text-purple-600 transition">
                    {room.name}
                </h3>
                {room.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                        {room.description}
                    </p>
                )}
                <div className="flex items-center text-xs text-gray-400 mt-1 space-x-2">
                    {room.memberCount !== undefined && (
                        <span>{room.memberCount} members</span>
                    )}
                    {room.timeLimit && (
                        <span>• {room.timeLimit} min limit</span>
                    )}
                </div>
            </div>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onJoin(room.name)}
                className={cn(
                    "p-2 rounded-full transition-all duration-300",
                    isHovered
                        ? "bg-purple-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-purple-100"
                )}
            >
                <ChevronRight className="w-5 h-5" />
            </motion.button>
        </motion.div>
    );
};