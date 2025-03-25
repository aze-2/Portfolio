'use client'

import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "./supabase-AuthProvider";

export default function Home({ userState }: { userState: any }) {
  // const supabase = await createClient()
  // const { data } = await supabase.auth.getUser()
  console.log("userState:", userState); // 確認用ログ
  const { user } = useContext(AuthContext);

  return (
    <div>
      {user ? (
        <div>
          ログイン済み <Link href='/post/newPost'>新規投稿</Link>      <Link href='/map'>地図</Link>

        </div>
      ) : (
        <div>未ログイン <Link href='/login' className="text-blue-300">ログインページへ</Link></div>
      )}
    </div>
  );
}
