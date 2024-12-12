"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function login(formData: FormData) {
  const supabase = await createClient();
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  const { error } = await supabase.auth.signInWithPassword(data);
  if (error) {
    return {
      error: error.message,
      success: false,
    };
  }
  revalidatePath("home", "layout");
  redirect("/home");
}

export async function signInWithGoogle() {
  try {

    const supabase =await createClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      console.error("Google Sign In Error:", error);
      return { error: error.message };
    }

    return { data };
  } catch (error) {
    console.error("Unexpected error during Google Sign In:", error);
    return { error: "An unexpected error occurred" };
  }
}