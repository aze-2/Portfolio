import { createClient } from "../../../../utils/supabase/client"

export async function signOut() {
    const supabase = await createClient()
    await supabase.auth.signOut()
  }