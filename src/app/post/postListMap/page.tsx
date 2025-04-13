import PostListMap from '@/app/components/Map/PostListMap';
import { createClient } from '../../../../utils/supabase/server';

export default async function MapPage() {
  const supabase = await createClient();
  const { data: postsData } = await supabase
    .from('posts')
    .select('id, title, address, lat, lng');

//   const validPosts = (postsData ?? []).filter((post) => post.lat && post.lng);

  return <PostListMap posts={postsData} />;
}
