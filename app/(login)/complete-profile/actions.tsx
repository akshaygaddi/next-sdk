// "use server";
//
// import { createClient } from "@/utils/supabase/server";
// import { revalidatePath } from "next/cache";
// import { redirect } from "next/navigation";
//
// export async function upsertProfile(formData: FormData) {
//   const supabase = await createClient();
//
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();
//
//   if (!user) {
//     console.error("No user logged in");
//     redirect("/login");
//   }
//
//   const profileData = {
//     id: user.id, // Include this for inserts
//     username: formData.get("username") as string,
//     rooms_allowed: formData.get("rooms_allowed") as string,
//   };
//
//   const { data, error } = await supabase
//     .from("profiles")
//     .upsert(profileData)
//     .select();
//
//   if (error) {
//     console.error("Profile upsert error:", error);
//     redirect("/error");
//   }
//
//   console.log("Profile upserted:", data);
//
//   revalidatePath("/");
//   redirect("/");
// }
