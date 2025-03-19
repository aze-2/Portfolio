import { createClient } from "../../utils/supabase/server"

export async function getUser() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser();
    console.log({ data: { user } })
    return { data: { user } }
}
