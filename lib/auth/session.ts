import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/database.types';

export type UserContext = {
  user: {
    id: string;
    email: string;
    fullName?: string;
  };
  organization: {
    id: string;
    name: string;
    slug: string;
    currency: string;
    timezone: string;
  } | null;
  membership: {
    id: string;
    status: 'active' | 'invited' | 'suspended' | 'deactivated';
  } | null;
  roles: string[];
};

/**
 * Retrieves the current authenticated user and their active organization context.
 */
export async function getUserContext(): Promise<UserContext | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return null;
  }

  // 1. Fetch user's active membership & organization
  const { data: membershipData } = await supabase
    .from('memberships')
    .select(`
      id,
      status,
      organization_id,
      organizations (
        id,
        name,
        slug,
        currency,
        timezone
      )
    `)
    .eq('user_id', user.id)
    .eq('status', 'active')
    .limit(1)
    .maybeSingle();

  // 2. Fetch roles assigned to this membership
  let roles: string[] = [];
  if (membershipData?.id) {
    const { data: rolesData } = await supabase
      .from('membership_roles')
      .select(`
        role_id,
        roles (
          key
        )
      `)
      .eq('membership_id', membershipData.id);

    if (rolesData) {
      roles = rolesData
        .map((r) => (r.roles as unknown as { key: string })?.key)
        .filter(Boolean);
    }
  }

  const rawOrg = membershipData?.organizations as unknown as {
    id: string;
    name: string;
    slug: string;
    currency: string;
    timezone: string;
  } | null;

  return {
    user: {
      id: user.id,
      email: user.email,
      fullName: user.user_metadata?.full_name || undefined,
    },
    organization: rawOrg
      ? {
          id: rawOrg.id,
          name: rawOrg.name,
          slug: rawOrg.slug,
          currency: rawOrg.currency,
          timezone: rawOrg.timezone,
        }
      : null,
    membership: membershipData
      ? {
          id: membershipData.id,
          status: membershipData.status,
        }
      : null,
    roles,
  };
}

/**
 * Atomically provisions a new organization, membership, and initial Owner role for an authenticated user.
 * Idempotent: If user already has an active membership, returns existing organization.
 */
export async function provisionOrganizationForUser(
  userId: string,
  userEmail: string,
  organizationName: string
): Promise<{ success: boolean; organizationId?: string; error?: string }> {
  const supabase = await createClient();
  if (!supabase) {
    return { success: false, error: 'Database client not initialized.' };
  }

  // 1. Check for existing active membership to prevent duplicate provisioning
  const { data: existingMembership } = await supabase
    .from('memberships')
    .select('organization_id')
    .eq('user_id', userId)
    .eq('status', 'active')
    .limit(1)
    .maybeSingle();

  if (existingMembership?.organization_id) {
    return { success: true, organizationId: existingMembership.organization_id };
  }

  // 2. Generate slug from organization name
  const baseSlug = organizationName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'workspace';
  
  const uniqueSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;

  // 3. Insert Organization
  const { data: orgData, error: orgError } = await supabase
    .from('organizations')
    .insert({
      name: organizationName.trim(),
      slug: uniqueSlug,
      country: 'IN',
      timezone: 'Asia/Kolkata',
      currency: 'INR',
    })
    .select('id')
    .single();

  if (orgError || !orgData) {
    return { success: false, error: orgError?.message || 'Failed to create organization.' };
  }

  // 4. Insert Membership connecting auth user to organization
  const { data: memberData, error: memberError } = await supabase
    .from('memberships')
    .insert({
      organization_id: orgData.id,
      user_id: userId,
      status: 'active',
    })
    .select('id')
    .single();

  if (memberError || !memberData) {
    return { success: false, error: memberError?.message || 'Failed to establish membership.' };
  }

  // 5. Assign System Owner Role
  // The system owner role ID is 00000000-0000-0000-0000-000000000001
  const ownerRoleId = '00000000-0000-0000-0000-000000000001';

  const { error: roleError } = await supabase.from('membership_roles').insert({
    membership_id: memberData.id,
    role_id: ownerRoleId,
  });

  if (roleError) {
    // Non-fatal if system role seed mapping differs, log warning
    console.warn('Initial owner role assignment warning:', roleError.message);
  }

  // 6. Log foundational audit event
  await supabase.from('audit_logs').insert({
    organization_id: orgData.id,
    actor_id: userId,
    action: 'organization.provisioned',
    entity_type: 'organization',
    entity_id: orgData.id,
    details: {
      creator_email: userEmail,
      organization_name: organizationName,
      slug: uniqueSlug,
    },
  });

  return { success: true, organizationId: orgData.id };
}
