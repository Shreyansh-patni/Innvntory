import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { resetDemoWorkspace } from '@/lib/demo/reset';

export const dynamic = 'force-dynamic';

/**
 * GET /api/cron/demo-reset
 * POST /api/cron/demo-reset
 *
 * Scheduled 2-hour demo workspace reset endpoint.
 * Protected by CRON_SECRET / DEMO_RESET_SECRET.
 */
async function handleReset(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET || process.env.DEMO_RESET_SECRET;
  const authHeader = request.headers.get('authorization');
  const customHeader = request.headers.get('x-cron-secret');

  // Verify authorization header
  const isAuthorized =
    Boolean(cronSecret) &&
    (authHeader === `Bearer ${cronSecret}` || customHeader === cronSecret);

  // In production, strictly enforce authorization
  if (process.env.NODE_ENV === 'production' && !isAuthorized) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // If local development without CRON_SECRET set, allow testing or require token if configured
  if (process.env.NODE_ENV !== 'production' && cronSecret && !isAuthorized) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey || supabaseUrl === 'TBD' || serviceRoleKey === 'TBD') {
    return NextResponse.json(
      { error: 'Supabase server credentials not configured' },
      { status: 500 }
    );
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const result = await resetDemoWorkspace(adminClient);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error || 'Reset failed' },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    result: {
      organizationSlug: result.organizationSlug,
      counts: result.counts,
      durationMs: result.durationMs,
    },
  });
}

export async function GET(request: NextRequest) {
  return handleReset(request);
}

export async function POST(request: NextRequest) {
  return handleReset(request);
}
