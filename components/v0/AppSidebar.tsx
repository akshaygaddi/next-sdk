"use client";

import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { RoomList } from "@/components/RoomList";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import JoinPrivateRoomForm from "../JoinPrivateRoomForm";

export function AppSidebar() {
  const [activeTab, setActiveTab] = useState<"public" | "private" | "joined">(
    "public",
  );

  return (
    <Sidebar>
      <SidebarContent className="w-64 p-4">
        <div className="flex flex-col space-y-4">
          <div className="flex space-x-2">
            <Button
              variant={activeTab === "public" ? "default" : "outline"}
              onClick={() => setActiveTab("public")}
            >
              Public
            </Button>
            <Button
              variant={activeTab === "private" ? "default" : "outline"}
              onClick={() => setActiveTab("private")}
            >
              Private
            </Button>
            <Button
              variant={activeTab === "joined" ? "default" : "outline"}
              onClick={() => setActiveTab("joined")}
            >
              Joined
            </Button>
          </div>
          <RoomList type={activeTab} />
          {activeTab === "public" && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full">Join Private Room</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Join Private Room</DialogTitle>
                </DialogHeader>
                <JoinPrivateRoomForm onClose={() => {}} />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </SidebarContent>
      <SidebarTrigger className="absolute top-4 -right-3 z-50" />
    </Sidebar>
  );
}
