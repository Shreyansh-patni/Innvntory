'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { provisionOrganizationForUser } from '@/lib/auth/session';

export type AuthActionResult = {
  success?: boolean;
  error?: string;
  message?: string;
  redirectTo?: string;
};

/**
 * Normalizes raw Supabase/database errors into user-safe messaging.
 */
function normalizeAuthError(error: Error | { message?: string } | null): string {
  if (!error?.message) return 'An unexpected error occurred. Please try again.';
  const msg = error.message.toLowerCase();

  if (msg.includes('invalid login credentials') || msg.includes('invalid_credentials')) {
    return 'The email or password you entered is incorrect.';
  }
  if (msg.includes('user already registered') || msg.includes('already exists')) {
    return 'An account with this email address already exists. Please sign in instead.';
  }
  if (msg.includes('password should be at least')) {
    return 'Password must be at least 8 characters long.';
  }
  if (msg.includes('rate limit') || msg.includes('too many requests')) {
    return 'Too many login attempts. Please wait a few minutes before trying again.';
  }
  if (msg.includes('email not confirmed')) {
    return 'Please verify your email address before signing in.';
  }

  return 'Unable to authenticate. Please check your connection and credentials.';
}

/**
 * Server Action: User Login
 */
export async function loginAction(
  _prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const rawNext = (formData.get('next') as string) || '/app/dashboard';

  const next = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/app/dashboard';

  if (!email || !password) {
    return { error: 'Please enter both your work email and password.' };
  }

  const supabase = await createClient();
  if (!supabase) {
    // In mock/preview environment without Supabase credentials, allow redirection to app
    redirect(next);
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    return { error: normalizeAuthError(error) };
  }

  revalidatePath('/', 'layout');
  redirect(next);
}

/**
 * Server Action: User Signup & Organization Onboarding
 */
export async function signupAction(
  _prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const fullName = (formData.get('fullName') as string) || '';
  const email = (formData.get('email') as string) || '';
  const organizationName = (formData.get('organizationName') as string) || '';
  const password = (formData.get('password') as string) || '';

  if (!email || !password || !organizationName) {
    return { error: 'Please fill in all required fields (Email, Organization, Password).' };
  }

  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters in length.' };
  }

  const supabase = await createClient();
  if (!supabase) {
    // Preview mode fallback
    redirect('/app/dashboard');
  }

  // 1. Sign up user via Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: {
        full_name: fullName.trim(),
        organization_name: organizationName.trim(),
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback`,
    },
  });

  if (authError) {
    return { error: normalizeAuthError(authError) };
  }

  // 2. If user session is immediately available (auto-confirm enabled or local testing)
  if (authData.user) {
    const provisioning = await provisionOrganizationForUser(
      authData.user.id,
      email.trim(),
      organizationName.trim()
    );

    if (!provisioning.success) {
      console.warn('Initial tenant provisioning deferred or failed:', provisioning.error);
    }
  }

  // 3. If email confirmation is required by Supabase project
  if (authData.user && !authData.session) {
    return {
      success: true,
      message: 'Account created! Please check your email for the confirmation link to complete setup.',
    };
  }

  revalidatePath('/', 'layout');
  redirect('/app/dashboard');
}

/**
 * Server Action: Logout
 */
export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  if (supabase) {
    await supabase.auth.signOut();
  }

  revalidatePath('/', 'layout');
  redirect('/login');
}

/**
 * Server Action: Request Password Reset
 */
export async function forgotPasswordAction(
  _prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const email = (formData.get('email') as string) || '';

  if (!email) {
    return { error: 'Please enter your registered email address.' };
  }

  const supabase = await createClient();
  if (!supabase) {
    return {
      success: true,
      message: 'If an account exists with this email, a password reset link has been dispatched.',
    };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password`,
  });

  // Never reveal whether the email exists
  if (error) {
    console.warn('Password reset request error:', error.message);
  }

  return {
    success: true,
    message: 'If an account exists with this email, a password reset link has been dispatched.',
  };
}

/**
 * Server Action: Reset / Update Password
 */
export async function resetPasswordAction(
  _prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const password = (formData.get('password') as string) || '';
  const confirmPassword = (formData.get('confirmPassword') as string) || '';

  if (!password || !confirmPassword) {
    return { error: 'Please enter and confirm your new password.' };
  }

  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters long.' };
  }

  if (password !== confirmPassword) {
    return { error: 'Passwords do not match. Please verify and retry.' };
  }

  const supabase = await createClient();
  if (!supabase) {
    redirect('/login?message=password_updated');
  }

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    return { error: normalizeAuthError(error) };
  }

  revalidatePath('/', 'layout');
  redirect('/login?message=password_updated');
}
