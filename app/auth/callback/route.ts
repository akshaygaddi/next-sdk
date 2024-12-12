import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';


export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const error = requestUrl.searchParams.get('error');
    const error_description = requestUrl.searchParams.get('error_description');

    // If there's an error, redirect to login with the error message
    if (error) {
      console.error('OAuth error:', error_description);
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/login?error=${encodeURIComponent(error_description || 'Authentication failed')}`
      );
    }

    // Handle the code exchange
    if (code) {

      const supabase = await createClient();

      const { error: supabaseError } = await supabase.auth.exchangeCodeForSession(code);

      if (supabaseError) {
        console.error('Supabase auth error:', supabaseError);
        return NextResponse.redirect(
          `${requestUrl.origin}/auth/login?error=${encodeURIComponent(supabaseError.message)}`
        );
      }

      // Successful authentication
      return NextResponse.redirect(`${requestUrl.origin}/home`);
    }

    // No code or error present
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/login?error=${encodeURIComponent('No code or error returned')}`
    );
  } catch (error) {
    console.error('Callback handler error:', error);
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/login?error=${encodeURIComponent('An unexpected error occurred')}`
    );
  }
}