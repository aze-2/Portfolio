import { createClient } from "../../../../utils/supabase/client"

export async function signOut() {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()
  }