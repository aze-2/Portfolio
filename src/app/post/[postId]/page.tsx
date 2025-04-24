import React from 'react'
import { createClient } from '../../../../utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { PostType } from '../../../../utils/Post-Types'
import PostDetail from '@/app/components/Post/Post-Detail'

type PageProps = {
    params: {
        postId: string
    }
}

const PostDetailPage = async({ params }: PageProps) => {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.getUser()
      if (error || !data?.user) {
        redirect('/login')
      }

    //ポスト詳細取得
    const { data: postData } = await supabase
     .from('posts')
     .select('*')
     .eq('id', params.postId)
     .single()
    
    //ポストがない場合
    if(!postData) return notFound()

    //プロフィール取得
    /*const { data: profileData  } = */await supabase
     .from('profiles')
     .select()
     .eq('id', postData.user_id)
     .single()

    //表示ポスト詳細
    const post: PostType = {
        id: postData.id,
        created_at: postData.created_at,
        title: postData.title,
        address: postData.address,
        content: postData.content,
        user_id: postData.user_id,
        image_url: postData.image_url,
        name: postData.profiles?.name,
    }
  return <PostDetail post={post} />
}

export default PostDetailPage
