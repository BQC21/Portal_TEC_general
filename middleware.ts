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
    const isRootRoute = pathname === "/";
    const isProtectedRoute = 
        pathname.startsWith("/dashboard") || 
        pathname.startsWith("/proveedores") ||
        pathname.startsWith("/equipos") || 
        pathname.startsWith("/materiales") || 
        pathname.startsWith("/sizing") || 
        pathname.startsWith("/quotes");

    // Sin sesión: solo bloquear rutas protegidas (y la raíz)
    if ((isProtectedRoute  || isRootRoute) && !user) {
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = "/login";
        loginUrl.search = "";
        return NextResponse.redirect(loginUrl);
    }

    // Con sesión: sacar de /login, pero NO de /update_password ni /save_password
    if (pathname.startsWith("/login") && user) {
        const dashboardUrl = request.nextUrl.clone();
        dashboardUrl.pathname = "/dashboard";
        dashboardUrl.search = "";
        return NextResponse.redirect(dashboardUrl);
    }

    return response;
}


export const config = {
    matcher: [
        "/",
        "/dashboard/:path*",
        "/proveedores/:path*",
        "/equipos/:path*",
        "/materiales/:path*",
        "/sizing/:path*",
        "/quotes/:path*",
        "/login",
        "/save_password",
        "/update_password",
        "/callback",
    ],
};