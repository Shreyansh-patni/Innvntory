import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/database.types';

export type CategoryRow = Database['public']['Tables']['categories']['Row'];

export async function getCategories(organizationId: string) {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('organization_id', organizationId)
    .neq('status', 'archived')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error.message);
    return [];
  }

  return data as CategoryRow[];
}

export async function getCategoryById(id: string, organizationId: string) {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .eq('organization_id', organizationId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching category by ID:', error.message);
    return null;
  }

  return data as CategoryRow | null;
}
