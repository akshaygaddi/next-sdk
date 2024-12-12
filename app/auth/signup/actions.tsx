// actions.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function signup(formData: FormData) {
  const supabase = await createClient();

  // Get form data
  const userData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  const username = formData.get("username") as string;

  // Sign up the user
  const { data: { user }, error: signUpError } = await supabase.auth.signUp(userData);

  if (signUpError) {
    return {
      error: signUpError.message,
      success: false,
    };
  }

  if (user) {
    // Create profile in the profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: user.id,
          username: username,
          email: userData.email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ]);

    if (profileError) {
      // If profile creation fails, we should handle the cleanup
      // You might want to delete the auth user or implement a cleanup strategy
      return {
        error: "Failed to create profile. Please try again.",
        success: false
      };
    }
  }

  revalidatePath("/home", "layout");
  redirect("/home");
}

export async function signInWithGoogle() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
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