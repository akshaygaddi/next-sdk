"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

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
    console.log('Starting Google Sign In process'); // Debug log
    const supabase = await createClient();

    // Log the redirect URL that will be used
    const redirectUrl = `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'}/auth/callback`;
    console.log('Redirect URL:', redirectUrl); // Debug log

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        skipBrowserRedirect: true, // Changed to true to handle redirect manually
        redirectTo: redirectUrl,
        queryParams: {
          prompt: 'select_account',
          access_type: 'offline',
        },
      },
    });

    if (error) {
      console.error("Google Sign In Error:", error);
      return { error: error.message };
    }

    console.log('OAuth response data:', data); // Debug log
    return { data };
  } catch (error) {
    console.error("Unexpected error during Google Sign In:", error);
    return { error: "An unexpected error occurred" };
  }
}