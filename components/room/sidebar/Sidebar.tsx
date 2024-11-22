"use client"
import React, { useState, useMemo } from 'react';
import {
    Plus,
    RefreshCw,
    UserCheck,
    Globe,
    PlusCircle,
    ChevronRight,
    Search
} from 'lucide-react';
import { motion,AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils";

// Type Definitions
type Room = {
    _id: string;
    name: string;
    timeLimit?: number;
    memberCount?: number;
    description?: string;
};

type SidebarProps = {
    userRooms: Room[];
    availableRooms: Room[];
    onJoinRoom: (roomName: string) => Promise<void>;
    onCreateRoom: () => void;
    onRefreshRooms: () => Promise<void>;
};

// Framer Motion Variants
const variants = {
    container: {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        }
    },
    item: {
        hidden: { opacity: 0, x: -10 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                type: "spring",
                stiffness: 300
            }
        }
    }
};

/

// Main Sidebar Component
export const Sidebar: React.FC<SidebarProps> = ({
                                                            userRooms,
                                                            availableRooms,
                                                            onJoinRoom,
                                                            onCreateRoom,
                                                            onRefreshRooms
                                                        }) => {
    const [activeTab, setActiveTab] = useState<'your' | 'available'>('your');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Filtering and Memoization
    // const filteredRooms = useMemo(() => {
    //     const roomsToFilter = activeTab === 'your' ? userRooms : availableRooms;
    //     return roomsToFilter.filter(room =>
    //         room.name.toLowerCase().includes(searchTerm.toLowerCase())
    //     );
    // }, [activeTab, userRooms, availableRooms, searchTerm]);

    // Refresh Handler
    const handleRefresh = async () => {
        setIsRefreshing(true);
        await onRefreshRooms();
        setIsRefreshing(false);
    };

    // Render Tabs
    const renderTabs = () => (
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-1.5 flex space-x-2 mb-4">
            {[
                {
                    key: 'your',
                    icon: UserCheck,
                    label: 'Your Rooms',
                    count: 5
                },
                {
                    key: 'available',
                    icon: Globe,
                    label: 'Available Rooms',
                    count: 6
                }
            ].map(({ key, icon: Icon, label, count }) => (
                <motion.button
                    key={key}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(key as 'your' | 'available')}
                    className={cn(
                        "flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-300",
                        activeTab === key
                            ? "bg-purple-600 text-white"
                            : "text-gray-600 hover:bg-gray-200"
                    )}
                    aria-pressed={activeTab === key}
                >
                    <Icon className="w-5 h-5" />
                    <span>{label}</span>
                    <span className="bg-white/20 rounded-full px-2 py-0.5 text-xs">
                        {count}
                    </span>
                </motion.button>
            ))}
        </div>
    );

    // Render Search Bar
    const renderSearchBar = () => (
        <div className="relative mb-4">
            <input
                type="text"
                placeholder="Search rooms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 transition-all"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
    );

    // Render Header
    const renderHeader = () => (
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">
                {activeTab === 'your' ? 'Your Rooms' : 'Available Rooms'}
            </h2>
            <div className="flex items-center space-x-2">
                {activeTab === 'your' && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onCreateRoom}
                        className="flex items-center space-x-2 p-2 bg-purple-500 text-white rounded-lg"
                    >
                        <PlusCircle className="w-5 h-5" />
                        <span className="text-sm">New Room</span>
                    </motion.button>
                )}
                {activeTab === 'available' && (
                    <motion.button
                        whileHover={{ rotate: 360 }}
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className={cn(
                            "p-2 rounded-full transition-all duration-300",
                            isRefreshing
                                ? "bg-gray-200 animate-spin"
                                : "hover:bg-gray-200 hover:rotate-180"
                        )}
                    >
                        <RefreshCw className="w-5 h-5" />
                    </motion.button>
                )}
            </div>
        </div>
    );

    return (
        <motion.div
            variants={variants.container}
            initial="hidden"
            animate="visible"
            className="w-full h-full flex flex-col p-4 bg-gray-50 rounded-2xl"
        >
            {renderTabs()}
            {renderSearchBar()}
            {renderHeader()}

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex-grow overflow-y-auto space-y-3 pr-2"
                >
                    {/*{filteredRooms.length ? (*/}
                    {/*    filteredRooms.map((room) => (*/}
                    {/*        <RoomCard*/}
                    {/*            key={room._id}*/}
                    {/*            room={room}*/}
                    {/*            onJoin={onJoinRoom}*/}
                    {/*            isUserRoom={activeTab === 'your'}*/}
                    {/*        />*/}
                    {/*    ))*/}
                    {/*) : (*/}
                    {/*    <motion.div*/}
                    {/*        initial={{ opacity: 0 }}*/}
                    {/*        animate={{ opacity: 1 }}*/}
                    {/*        className="text-center text-gray-500 py-10"*/}
                    {/*    >*/}
                    {/*        <p>No rooms {activeTab === 'your' ? 'created' : 'available'}</p>*/}
                    {/*    </motion.div>*/}
                    {/*)}*/}
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
};