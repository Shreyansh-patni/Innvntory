import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { Database } from '@/types/database.types';

function isValidHttpUrl(stringUrl?: string): boolean {
  if (!stringUrl || stringUrl === 'TBD') return false;
  try {
    const url = new URL(stringUrl);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const pathname = request.nextUrl.pathname;
  const isProtectedRoute = pathname.startsWith('/app');
  const isAuthRoute = pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password' || pathname === '/reset-password';

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase credentials are missing, invalid, or placeholder
  if (!isValidHttpUrl(supabaseUrl) || !supabaseAnonKey || supabaseAnonKey === 'TBD') {
    if (isProtectedRoute) {
      // Safely redirect unauthenticated protected requests to login
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
    // Allow public and auth routes to render without throwing
    return supabaseResponse;
  }

  try {
    const supabase = createServerClient<Database>(
      supabaseUrl!,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
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

    // Refresh auth session using official Supabase SSR recommendation
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      // If error occurs while fetching user, treat as unauthenticated
      if (isProtectedRoute) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        url.searchParams.set('next', pathname);
        return NextResponse.redirect(url);
      }
      return supabaseResponse;
    }

    // 1. Protected application routes (/app/*) require an authenticated user
    if (isProtectedRoute && !user) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }

    // 2. Public auth routes redirect authenticated users to dashboard
    if (isAuthRoute && user) {
      const url = request.nextUrl.clone();
      url.pathname = '/app/dashboard';
      url.searchParams.delete('next');
      return NextResponse.redirect(url);
    }

    return supabaseResponse;
  } catch (err) {
    console.error('[auth-middleware] Unexpected error during session resolution:', err);
    if (isProtectedRoute) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }
}
