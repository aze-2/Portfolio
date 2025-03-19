import Link from "next/link";
import { createClient } from "../../utils/supabase/server";

export default async function Home() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  console.log(data)

  return (
    <div>
      {data ? (
        <div>
          ログイン済み <Link href='/post/newPost'>新規投稿</Link>      <Link href='/map'>地図</Link>

        </div>
      ) : (
        <div>未ログイン <Link href='/login' className="text-blue-300">ログインページへ</Link></div>
      )}
    </div>
  );
}
