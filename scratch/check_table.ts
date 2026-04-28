import { createClient } from "@/lib/supabase/server"

export async function testStaffTable() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('staff').select('*').limit(1)
  return { data, error }
}
