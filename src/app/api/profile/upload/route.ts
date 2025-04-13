import { v4 as uuidv4 } from 'uuid'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '../../../../../utils/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const formData = await req.formData()
  const file = formData.get('avatar') as File

  if (!file) {
    return NextResponse.json({ error: '画像ファイルが見つかりません。' }, { status: 400 })
  }

  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData?.user) {
    return NextResponse.json({ error: '認証されていません。' }, { status: 401 })
  }

  const fileName = `${userData.user.id}/${uuidv4()}`
  const { data, error } = await supabase.storage.from('profile').upload(fileName, file)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const { data: publicUrlData } = await supabase.storage
    .from('profile')
    .getPublicUrl(data.path)

  return NextResponse.json({ avatar_url: publicUrlData.publicUrl })
}