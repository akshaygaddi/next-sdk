// app/auth/callback/route.ts
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = await createClient();

    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && user) {
      // Check if profile exists
      const { data: profile } = await supabase
        .from('profiles')
        .select()
        .eq('id', user.id)
        .single();

      // If no profile exists, create one
      if (!profile) {
        await supabase
          .from('profiles')
          .insert([
            {
              id: user.id,
              email: user.email,
              username: user.email?.split('@')[0], // Create a default username from email
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }
          ]);
      }

      return NextResponse.redirect(requestUrl.origin + '/home');
    }
  }

  // Return to login page if code exchange fails
  return NextResponse.redirect(requestUrl.origin + '/auth/login');
}