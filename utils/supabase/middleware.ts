import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function updateSession(request: NextRequest) {
  console.log("Middleware triggered for path:", request.nextUrl.pathname);

  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error("Missing required environment variables for Supabase configuration");
    }

    const response = NextResponse.next();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    console.log("Auth state:", { hasUser: !!user, error: userError?.message });

    const isAuthPage = ["/auth/login", "/auth/signup", "/auth/callback"].some((path) =>
      request.nextUrl.pathname.startsWith(path)
    );
    const publicPaths = ["/home", "/public"];
    const isPublicPath = publicPaths.some(
      (path) => request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(path)
    );
    const isProtectedPage = !isAuthPage && !isPublicPath;

    console.log("Path analysis:", { isAuthPage, isPublicPath, isProtectedPage });

    // Allow callback route to proceed without redirect
    if (request.nextUrl.pathname.startsWith('/auth/callback')) {
      return response;
    }

    if (!user && isProtectedPage) {
      console.log("Redirecting to login - no user for protected page");
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/auth/login";
      loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (user && isAuthPage) {
      console.log("Redirecting to home - user on auth page");
      const homeUrl = request.nextUrl.clone();
      homeUrl.pathname = "/home";
      return NextResponse.redirect(homeUrl);
    }

    return response;
  } catch (err) {
    console.error("Middleware error:", err);
    const errorUrl = request.nextUrl.clone();
    errorUrl.pathname = "/error";
    return NextResponse.redirect(errorUrl);
  }
}