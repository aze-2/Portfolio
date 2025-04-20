import { v4 as uuidv4 } from 'uuid'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '../../../../utils/supabase/server'

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

  // 画像アップロード
  const fileName = `${userData.user.id}/${uuidv4()}`
  const { data, error } = await supabase.storage.from('profile').upload(fileName, file)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // 画像URL取得
  const { data: publicUrlData } = await supabase.storage
    .from('profile')
    .getPublicUrl(data.path)

    const body = await req.json()

    const { name, introduce, avatar_url } = body
  
    const { error: upDataerror } = await supabase
      .from('profiles')
      .update({
        name,
        introduce,
        avatar_url:publicUrlData.publicUrl,
      })
      .eq('id', userData.user.id)
  
    if (upDataerror) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  
    return NextResponse.json({ message: 'プロフィールを更新しました。' })
  }
