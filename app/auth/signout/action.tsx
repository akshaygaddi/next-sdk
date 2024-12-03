"use server";

import { revalidatePath } from "next/cache";
// import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
// import {NextResponse} from "next/server";
import { redirect } from "next/navigation";

export async function logout() {
  const supabase = await createClient();

  // Check if a user's logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await supabase.auth.signOut();
  }

  revalidatePath("/home", "layout");
  redirect("/home");
}
