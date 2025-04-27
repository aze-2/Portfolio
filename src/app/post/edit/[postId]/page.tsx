import React from 'react'
import { createClient } from '../../../../../utils/supabase/server'
import { notFound } from 'next/navigation'
import PostEdit from '@/app/components/Post/Post-Edit'

type Params = Promise<{ postId: string }>;

export default async function PostEditPage(props: { params: Params }) {
  const params = await props.params
  const supabase = await createClient()
  const postId = params.postId;
  // type Props = {
  //   params: {
  //     postId: string;
  //   };
  // }
  
  // export default async function Page({ params }: { params: { postId: string } }) {
  //     // const { params } = props;
  //     const supabase = await createClient();
  //   const { postId } = params;
    
  //ブログ詳細取得
  const { data: post, error } = await supabase
   .from('posts')
   .select()
   .eq('id', postId)
   .single()
   //ブログが存在しない場合
  if (error || !post) return notFound()

  return <PostEdit post={post} />
}