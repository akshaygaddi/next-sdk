"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const userData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error: signUpError } = await supabase.auth.signUp(userData);

  if (signUpError) {
    // Return error information instead of redirecting
    return {
      error: signUpError.message,
      success: false
    };
  }

  // If signup is successful, try to create the profile
  const profileData = {
    username: formData.get("username") as string,
  };

  // Here you can add profile data to your profiles table
  // const { error: profileError } = await supabase
  //   .from('profiles')
  //   .insert([profileData]);

  // if (profileError) {
  //   return {
  //     error: "Failed to create profile. Please try again.",
  //     success: false
  //   };
  // }

  revalidatePath("/home", "layout");
  redirect("/home");
}