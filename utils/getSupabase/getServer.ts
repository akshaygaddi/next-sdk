import { createClient } from "@/utils/supabase/server";

export async function getUserData() {
  const supabase = await createClient();

  // Use safeGetSession to get the session and user data
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error) {
    // unable if required
    // console.error('Error fetching session:', error);
    return { session: null, user: null };
  }
  // get usr if session exists
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) {
    // unable if required
    // console.error('Error fetching user:', userError);
    return { session: null, user: null };
  }
  return { session, user };
}

// A server supabase fetcher to get user and session
