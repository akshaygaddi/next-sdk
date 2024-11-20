"use client";

import { useEffect, useState } from 'react';
import { createClient } from "@/utils/supabase/client"; // Adjust the import path accordingly

export default function YourComponent() {
  const [user, setUser] = useState<any>(null); // Use a specific type if you have one
  const [session, setSession] = useState<any>(null); // Use a specific type if you have one

  useEffect(() => {
    const supabase = createClient();

    const fetchUserData = async () => {
      // Get the session
      const { data: { session: fetchedSession } } = await supabase.auth.getSession();
      setSession(fetchedSession);

      // Get the user
      const { data: { user: fetchedUser }, error } = await supabase.auth.getUser();

      if (error) {
        console.error('Error fetching user:', error);
      } else {
        setUser(fetchedUser);
      }
    };

    fetchUserData();
  }, []);

  return (
      <div>
        {session ? (
            <div>
              <h1>Welcome, {user?.email}</h1>
            </div>
        ) : (
            <h1>Please log in</h1>
        )}
      </div>
  );
}