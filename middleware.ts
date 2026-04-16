import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const response = NextResponse.next({ request });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        request.cookies.set(name, value);
                        response.cookies.set(name, value, options);
                    });
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { pathname } = request.nextUrl;
    const isProtectedRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/products");
    const isLoginRoute = pathname.startsWith("/login");

    if (isProtectedRoute && !user) {
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = "/login";
        loginUrl.search = "";
        return NextResponse.redirect(loginUrl);
    }

    if (isLoginRoute && user) {
        const dashboardUrl = request.nextUrl.clone();
        dashboardUrl.pathname = "/dashboard";
        dashboardUrl.search = "";
        return NextResponse.redirect(dashboardUrl);
    }

    if (pathname === "/" && !user) {
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = "/login";
        loginUrl.search = "";
        return NextResponse.redirect(loginUrl);
    }

    return response;
}

export const config = {
    matcher: ["/", "/dashboard/:path*", "/products/:path*", "/login"],
};