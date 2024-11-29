// server action file (e.g., actions.ts)
"use server";
import { createClient } from "@/utils/supabase/server";

export const terminateRoom = async (creatorId: string, roomId: string) => {
  const supabase = await createClient();
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const plainUser = user ? JSON.parse(JSON.stringify(user)) : null;

    if (!plainUser || plainUser.id !== creatorId) {
      return {
        success: false,
        error: "Only the room creator can terminate the room.",
      };
    }

    const { error } = await supabase.from("rooms").delete().eq("id", roomId);

    if (error) {
      throw new Error(`Failed to terminate the room: ${error.message}`);
    }

    return {
      success: true,
      message: "Room terminated successfully.",
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
};
