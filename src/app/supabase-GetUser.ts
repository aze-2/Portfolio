import { createClient } from "../../utils/supabase/server"

export async function getUser() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser();

    let profile = null;
    if (user) {
        const { data: currentProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
        profile = currentProfile;
    }
    console.log({ data: { user } })
    return { user, profile } 
}
