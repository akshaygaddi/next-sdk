// actions.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function logout() {
  const supabase = await createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase.auth.signOut();
    }

    revalidatePath("/", "layout");

    // Instead of redirecting, return a success status
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}