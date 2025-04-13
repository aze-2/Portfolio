import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '../../../../../utils/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { name, introduce, avatar_url } = await req.json()

  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData?.user) {
    return NextResponse.json({ error: '認証されていません。' }, { status: 401 })
  }

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ name, introduce, avatar_url })
    .eq('id', userData.user.id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'プロフィールを更新しました。' })
}