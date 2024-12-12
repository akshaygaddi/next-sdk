import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';


export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');

    // Debug log
    console.log('Auth callback triggered', { hasCode: !!code });

    if (code) {

      const supabase = await createClient();

      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error('Session exchange error:', error);
        return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=${encodeURIComponent(error.message)}`);
      }

      // If successful, redirect to home
      return NextResponse.redirect(`${requestUrl.origin}/home`);
    }

    // If no code, redirect to login
    return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=No authorization code received`);
  } catch (error) {
    console.error('Callback handler error:', error);
    return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=Authentication failed`);
  }
}