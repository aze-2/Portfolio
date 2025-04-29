import React from 'react'
import { createClient } from '../../../../utils/supabase/server'
import { notFound } from 'next/navigation'
import PostItem from './Post-Item';
import { PostTypes } from '../../../../utils/Post-Types';

const PostList = async() => {
    const supabase = await createClient()

  // 投稿データとプロフィールを結合して取得
  const { data: rawPostsData, error } = await supabase
    .from("posts")
    .select(`
        id, created_at, title, address, content, user_id, image_url, profiles ( name, avatar_url )
      `)
    .order("created_at", { ascending: false })

  const postsData = rawPostsData as PostTypes[];
  console.log("postsData:", postsData);
  console.log("error:", error);

  if (!postsData || postsData.length === 0) {
    console.warn("データが見つかりません");
    return notFound();
  }

  return (
    <>
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
          profiles={post.profiles} // `profiles` テーブルから取得
        //   avatar_url={post.profiles?.avatar_url}
        />
      ))}
    </div>
    </>
  );
};
export default PostList
