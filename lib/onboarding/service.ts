import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { OnboardingStatus, FullOnboardingData } from './types';
import { getUserContext } from '@/lib/auth/session';
import { isDemoOrganization } from '@/lib/demo/config';

export const DEMO_ONBOARDING_COOKIE = 'innvntory_demo_onboarding_completed';

/**
 * Retrieves the onboarding status for the current session.
 * - Demo account checks visitor's browser cookie.
 * - Normal authenticated accounts query `user_preferences`.
 */
export async function getOnboardingStatus(): Promise<OnboardingStatus> {
  const userContext = await getUserContext();

  if (!userContext || !userContext.user) {
    return {
      isCompleted: false,
      completedAt: null,
      currentStep: 1,
      draftData: {},
      isDemo: false,
    };
  }

  const isDemo = userContext.user.email === 'demo@innvntory.com' || userContext.user.email === 'demo@innvntory.sahaya.tech' || isDemoOrganization(userContext.organization?.slug);

  if (isDemo) {
    const cookieStore = await cookies();
    const isCompleted = cookieStore.get(DEMO_ONBOARDING_COOKIE)?.value === 'true';
    return {
      isCompleted,
      completedAt: isCompleted ? 'demo-completed' : null,
      currentStep: isCompleted ? 3 : 1,
      draftData: {},
      isDemo: true,
      organizationName: userContext.organization?.name || 'Innvntory Demo Workspace',
    };
  }

  const supabase = await createClient();
  if (!supabase) {
    return {
      isCompleted: false,
      completedAt: null,
      currentStep: 1,
      draftData: {},
      isDemo: false,
      organizationName: userContext.organization?.name,
    };
  }

  const { data: preference } = await supabase
    .from('user_preferences')
    .select('onboarding_completed, onboarding_completed_at, onboarding_step, onboarding_data')
    .eq('user_id', userContext.user.id)
    .maybeSingle();

  if (!preference) {
    return {
      isCompleted: false,
      completedAt: null,
      currentStep: 1,
      draftData: {},
      isDemo: false,
      organizationName: userContext.organization?.name,
    };
  }

  return {
    isCompleted: !!preference.onboarding_completed,
    completedAt: preference.onboarding_completed_at || null,
    currentStep: preference.onboarding_step || 1,
    draftData: (preference.onboarding_data as Partial<FullOnboardingData>) || {},
    isDemo: false,
    organizationName: userContext.organization?.name,
  };
}
