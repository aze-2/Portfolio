import React from 'react'
import { createClient } from '../../../../../utils/supabase/server'
import { notFound } from 'next/navigation'
import PostEdit from '@/app/components/Post/Post-Edit'

// type Props = {
//     params: {
//         postId: string
//     }
// }

export default async function PostEditPage({ params }: { params: { postId: string } }) {
    const supabase = await createClient()

        //ブログ詳細取得
        const { data: post, error } = await supabase
         .from('posts')
         .select()
         .eq('id', params.postId)
         .single()

         //ブログが存在しない場合
        if (error || !post) return notFound()

  return <PostEdit post={post} />
}