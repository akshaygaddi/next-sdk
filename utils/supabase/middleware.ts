import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function updateSession(request: NextRequest) {


  // Validate environment variables
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error("Missing required environment variables for Supabase configuration");
    }

  const response = NextResponse.next();

  // Initialize Supabase client with cookie management
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
    },
  );

    // Get the current path
    const currentPath = request.nextUrl.pathname;
    const searchParams = request.nextUrl.searchParams;

    // Check for authentication code in URL
    const code = searchParams.get('code');
    if (code) {
      // Allow the code to be processed by the callback handler
      return response;
    }

    // Get authenticated user
    const { data: { user }, error } = await supabase.auth.getUser();

    // Define path patterns
    const isAuthPage = ["/auth/login", "/auth/signup"].some((path) =>
      currentPath.startsWith(path)
    );
    const isPublicPath = ["/home", "/public"].some(
      (path) => currentPath === path || currentPath.startsWith(path)
    );
    const isCallbackPath = currentPath.startsWith('/auth/callback');
    const isProtectedPage = !isAuthPage && !isPublicPath && !isCallbackPath;

    // Handle root path
    if (currentPath === "/") {
      const homeUrl = request.nextUrl.clone();
      homeUrl.pathname = "/home";
      return NextResponse.redirect(homeUrl);
    }

    // Allow callback processing without redirect
    if (isCallbackPath) {
      return response;
    }

    // Redirect unauthenticated users from protected pages to login
    if (!user && isProtectedPage) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/auth/login";
      loginUrl.searchParams.set("redirect", currentPath);
      return NextResponse.redirect(loginUrl);
    }

    // Redirect authenticated users from auth pages to home
    if (user && isAuthPage) {
      const redirectTo = searchParams.get("redirect") || "/home";
      const destinationUrl = request.nextUrl.clone();
      destinationUrl.pathname = redirectTo;
      return NextResponse.redirect(destinationUrl);
    }

    return response;
  } catch (err) {
    console.error("Middleware error:", err);
    const errorUrl = request.nextUrl.clone();
    errorUrl.pathname = "/error";
    return NextResponse.redirect(errorUrl);
  }
}
