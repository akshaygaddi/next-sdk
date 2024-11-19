import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  console.log("Somehow I am coning here");
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            cookiesToSet.forEach(({ name, value, options }) =>
                request.cookies.set(name, value)
            );
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
                supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (
      !user &&
      !request.nextUrl.pathname.startsWith("/auth/login") &&
      !request.nextUrl.pathname.startsWith("/auth/signup")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login"; // Redirect to login
    return NextResponse.redirect(url);
  }

  if (user && request.nextUrl.pathname.startsWith("/auth")) {
    const url = request.nextUrl.clone();
    url.pathname = "/home";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
