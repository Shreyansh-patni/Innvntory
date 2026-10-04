import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match protected application routes, auth routes, and auth callback.
     * Exclude static files, public marketing routes, and image assets.
     */
    '/app/:path*',
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password',
    '/auth/callback',
  ],
};
