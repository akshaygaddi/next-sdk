import { useState } from "react";
import {
  Search,
  Plus,
  Users,
  MessageCircle,
  Settings
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

interface RoomSidebarProps {
  selectedRoom: any;
  onRoomSelect: (room: any) => void;
  isMobile?: boolean;
  onClose?: () => void;
  activeTab: 'rooms' | 'contacts' | 'settings';
}

export default function RoomSidebar({
                                      selectedRoom,
                                      onRoomSelect,
                                      isMobile = false,
                                      onClose,
                                      activeTab
                                    }: RoomSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateRoomDialogOpen, setIsCreateRoomDialogOpen] = useState(false);

  // Mock room data - replace with actual data source
  const rooms = [
    { id: 1, name: "General Discussion", unreadCount: 3 },
    { id: 2, name: "Project Updates", unreadCount: 1 },
    { id: 3, name: "Random Chatter", unreadCount: 0 }
  ];

  // Filtered rooms based on search
  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderRoomsTab = () => (
    <div className="p-4 space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search rooms"
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Dialog open={isCreateRoomDialogOpen} onOpenChange={setIsCreateRoomDialogOpen}>
          <DialogTrigger asChild>
            <Button size="icon" variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Room</DialogTitle>
            </DialogHeader>
            {/* Room creation form would go here */}
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
        {filteredRooms.map((room) => (
          <Button
            key={room.id}
            variant={selectedRoom?.id === room.id ? 'secondary' : 'ghost'}
            className="w-full justify-between"
            onClick={() => {
              onRoomSelect(room);
              isMobile && onClose?.();
            }}
          >
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
              <span>{room.name}</span>
            </div>
            {room.unreadCount > 0 && (
              <div className="bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs">
                {room.unreadCount}
              </div>
            )}
          </Button>
        ))}
      </div>
    </div>
  );

  const renderContactsTab = () => (
    <div className="p-4 space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search contacts"
            className="pl-10"
          />
        </div>
        <Button size="icon" variant="outline">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {/* Contacts list would be rendered here */}
      <div className="text-center text-muted-foreground py-8">
        No contacts yet
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">Settings</h2>
      {/* Settings options would be added here */}
      <div className="text-center text-muted-foreground py-8">
        Settings coming soon
      </div>
    </div>
  );

  return (
    <div
      className={cn(
        "h-full flex flex-col",
        isMobile ? "pt-8" : ""
      )}
    >
      {/* Tab Content */}
      {activeTab === 'rooms' && renderRoomsTab()}
      {activeTab === 'contacts' && renderContactsTab()}
      {activeTab === 'settings' && renderSettingsTab()}
    </div>
  );
}