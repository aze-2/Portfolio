import React from 'react'
import { createClient } from '../../../../utils/supabase/server'
import { notFound } from 'next/navigation'
import PostItem from './Post-Item'
import PostListMap from '../Map/PostListMap';
import Link from 'next/link';

const PostList = async() => {
    const supabase = await createClient()

//     const { data: postsData } = await supabase
//      .from('posts')
//      .select()
//      .order('created_at', { ascending: false })

//     if(!postsData) return notFound

//   return (
//     <div className="grid grid-cols-3 gap-5">
//         {await Promise.all(
//             postsData.map(async (postsData) => {
//                 //プロフィール取得
//                 const { data: userData } = await supabase
//                  .from('profiles')
//                  .select()
//                  .eq('id', postsData.yser_id)
//                  .single()

//             //ブログとプロフィールのテーブルを結合
//             const post = {
//                 id: postsData.id,
//                 created_at: postsData.created_at,
//                 title: postsData.title,
//                 content: postsData.content,
//                 user_id: postsData.user_id,
//                 image_url: postsData.image_url,
//                 name: userData!.name,
//                 avatar_url: userData!.avatar_url,
//             }

//             return <PostItem key={post.id} {...post} />
//             })
//         )}
      
//     </div>
//   )
// }
  // 投稿データとプロフィールを結合して取得
  const { data: postsData, error } = await supabase
    .from("posts")
    .select(`
        id, created_at, title, address, content, user_id, image_url, profiles(name)
      `)
    .order("created_at", { ascending: false })

  console.log("postsData:", postsData);
  console.log("error:", error);

//   if (error) {
//     console.error("Supabase エラー:", error);
//     return notFound();
//   }
  
  if (!postsData || postsData.length === 0) {
    console.warn("データが見つかりません");
    return notFound();
  }

//   if (!postsData || error) return notFound();

  return (
    <>
    <Link href={'/post/postListMap'}>マップ表示</Link>
    <div className="grid grid-cols-3 gap-5">
      {postsData.map((post) => (
        <PostItem
          key={post.id}
          id={post.id}
          created_at={post.created_at}
          title={post.title}
          address={post.address}
          content={post.content}
          user_id={post.user_id}
          image_url={post.image_url}
          name={post.profiles?.name} // `profiles` テーブルから取得
        //   avatar_url={post.profiles?.avatar_url}
        />
      ))}
    </div>
    </>
  );
};
export default PostList
