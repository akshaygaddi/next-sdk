import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');

    if (code) {

      const supabase = await createClient();

      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error('Session exchange error:', error);
        return NextResponse.redirect(
          `${requestUrl.origin}/auth/login?error=${encodeURIComponent(error.message)}`
        );
      }

      // After successful authentication, redirect to home
      return NextResponse.redirect(`${requestUrl.origin}/home`);
    }

    // If no code present, redirect to login
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/login?error=No authorization code received`
    );

  } catch (error) {
    console.error('Callback handler error:', error);
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/login?error=${encodeURIComponent('Authentication failed')}`
    );
  }
}