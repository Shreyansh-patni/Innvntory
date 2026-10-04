'use server';

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { FullOnboardingData } from './types';
import { DEMO_ONBOARDING_COOKIE } from './service';
import type { Json } from '@/types/database.types';

export interface ActionResult {
  success: boolean;
  error?: string;
}

/**
 * Saves draft progress across onboarding steps for authenticated normal users.
 */
export async function saveOnboardingStepAction(
  step: number,
  draftData: Partial<FullOnboardingData>
): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return { success: false, error: 'Database unavailable' };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Unauthorized' };

  const isDemo = user.email === 'demo@innvntory.com' || user.email === 'demo@innvntory.sahaya.tech';
  if (isDemo) return { success: true };

  // Fetch existing draft data to merge cleanly
  const { data: existing } = await supabase
    .from('user_preferences')
    .select('onboarding_data')
    .eq('user_id', user.id)
    .maybeSingle();

  const currentData = (existing?.onboarding_data as Record<string, unknown>) || {};
  const mergedData = { ...currentData, ...draftData };

  const { error } = await supabase
    .from('user_preferences')
    .upsert({
      user_id: user.id,
      onboarding_step: step,
      onboarding_data: mergedData as unknown as Json,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });

  if (error) {
    console.error('[ONBOARDING] Failed to save step:', error.message);
    return { success: false, error: 'Failed to save progress.' };
  }

  return { success: true };
}

/**
 * Finalizes onboarding for a normal authenticated user:
 * 1. Updates organization name if provided.
 * 2. Creates the primary warehouse if not already existing.
 * 3. Marks onboarding_completed = true in user_preferences.
 */
export async function completeOnboardingAction(
  finalData: Partial<FullOnboardingData>
): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return { success: false, error: 'Database unavailable' };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Unauthorized' };

  const isDemo = user.email === 'demo@innvntory.com' || user.email === 'demo@innvntory.sahaya.tech';
  if (isDemo) {
    // Demo completion sets cookie only
    const cookieStore = await cookies();
    cookieStore.set(DEMO_ONBOARDING_COOKIE, 'true', {
      path: '/',
      maxAge: 31536000,
      sameSite: 'lax',
    });
    return { success: true };
  }

  // 1. Fetch user's active membership & organization
  const { data: membership } = await supabase
    .from('memberships')
    .select('organization_id')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .limit(1)
    .maybeSingle();

  if (membership?.organization_id) {
    const orgId = membership.organization_id;

    // Update organization name if user customized it
    if (finalData.business?.businessName) {
      await supabase
        .from('organizations')
        .update({
          name: finalData.business.businessName.trim(),
          currency: finalData.business.currency || 'INR',
          updated_at: new Date().toISOString(),
        })
        .eq('id', orgId);
    }

    // Check and create primary warehouse if none exists yet
    const { data: existingWarehouses } = await supabase
      .from('warehouses')
      .select('id')
      .eq('organization_id', orgId)
      .limit(1);

    if (!existingWarehouses || existingWarehouses.length === 0) {
      const warehouseName = finalData.inventory?.warehouseName || 'Main Warehouse';
      const warehouseCity = finalData.inventory?.warehouseCity || 'Mumbai';
      await supabase.from('warehouses').insert({
        organization_id: orgId,
        name: warehouseName.trim(),
        code: 'WH-MAIN',
        city: warehouseCity.trim(),
        state: 'Maharashtra',
        is_default: true,
        status: 'active',
      });
    }
  }

  // 2. Mark onboarding completed in user_preferences
  const { error } = await supabase
    .from('user_preferences')
    .upsert({
      user_id: user.id,
      onboarding_completed: true,
      onboarding_completed_at: new Date().toISOString(),
      onboarding_step: 4,
      onboarding_data: finalData as unknown as Json,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });

  if (error) {
    console.error('[ONBOARDING] Failed to mark completion:', error.message);
    return { success: false, error: 'Could not mark onboarding complete.' };
  }

  return { success: true };
}

/**
 * Completes demo introduction without modifying any database records.
 */
export async function completeDemoOnboardingAction(): Promise<ActionResult> {
  const cookieStore = await cookies();
  cookieStore.set(DEMO_ONBOARDING_COOKIE, 'true', {
    path: '/',
    maxAge: 31536000,
    sameSite: 'lax',
  });
  return { success: true };
}
