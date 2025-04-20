import PostListMap from '@/app/components/Map/PostListMap/PostListMap';
import { createClient } from '../../../../utils/supabase/server';

export default async function MapPage() {
  const supabase = await createClient();
  // const { data: postsData } = await supabase
  //   .from('posts')
  //   .select('id, title, address, lat, lng');
  // 投稿データとプロフィールを結合して取得
  const { data: postsData, error } = await supabase
    .from("posts")
    .select(`
        id, created_at, title, address, lat, lng, user_id, profiles(name,avatar_url)
      `)
    .order("created_at", { ascending: false })
//   const validPosts = (postsData ?? []).filter((post) => post.lat && post.lng);

console.log('postsData',postsData);

  return <PostListMap posts={postsData} />;
}
