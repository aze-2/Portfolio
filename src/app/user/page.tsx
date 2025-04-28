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
      <p>{data.user.email}</p>
      <Link href='/post/newPost'>新規投稿</Link>
      <Link href='/map'>地図</Link>
        {await PostList()}
    </div>
  )
}