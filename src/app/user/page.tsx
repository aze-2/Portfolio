import { redirect } from 'next/navigation'
import { createClient } from '../../../utils/supabase/server'
import Link from 'next/link'
import PostList from '../components/Post/Post-List'


export default async function PrivatePage(/*profile*/) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  return (
    <div>
      <p>{data.user.email}のページ</p>
      {/* <Link href='/post/newPost'>新規投稿</Link> */}
      <Link href='/post/postListMap'>GoogleMapで表示</Link>
        {await PostList()}
    </div>
  )
}