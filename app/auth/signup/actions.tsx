"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function signup(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const userData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  const { error } = await supabase.auth.signUp(userData);

  const profileData = {
    username: formData.get("username") as string,
  };
  console.log(profileData);

  // const profileError = await supabase
  //     .from('profiles')
  //     .insert({ id: 1, name: 'Denmark' })
  //
  // console.log(profileError);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/home", "layout");
  redirect("/home");
}
