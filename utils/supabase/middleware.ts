import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function updateSession(request: NextRequest) {
  console.log("Middleware triggered");

  // Validate environment variables
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    throw new Error("Supabase environment variables are missing.");
  }

  const response = NextResponse.next();

  // Initialize Supabase client with cookie management
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

  try {
    // Get the authenticated user
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    // console.log(user);


    if (error) {
      // use if required
      // console.error("Error fetching user maybe user is not logged in:", error.message);
    }

    const isAuthPage = ["/auth/login", "/auth/signup"].some((path) =>
      request.nextUrl.pathname.startsWith(path),
    );
    const isProtectedPage =
      !isAuthPage && !request.nextUrl.pathname.startsWith("/public");

    // Redirect logic
    if (!user && isProtectedPage) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/auth/login";
      // loginUrl.pathname = "/auth/signup";

      loginUrl.searchParams.set("redirect", request.nextUrl.pathname); // Preserve original path
      return NextResponse.redirect(loginUrl);
    }

    if (user && isAuthPage) {
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
