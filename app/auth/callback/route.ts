import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const rawNext = searchParams.get('next') ?? '/app/dashboard';

  // Sanitize next destination: prevent open redirect attacks
  // Must start with '/' and not '//' or contain external schemes
  const next = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/app/dashboard';

  if (code) {
    const supabase = await createClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // Return user to login with an error indicator if code exchange fails
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
