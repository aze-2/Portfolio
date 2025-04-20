
import PostList from "./components/Post-AllUsers/Post-List";

export default async function Home(/*{ userState }: { userState: any }*/) {
  // const { user } = useContext(AuthContext);

  // return (
  //   <div>
  //     {user ? (
  //       <div>
  //         ログイン済み <Link href='/post/newPost'>新規投稿</Link>      <Link href='/map'>地図</Link>

  //       </div>
  //     ) : (
  //       <div>未ログイン <Link href='/login' className="text-blue-300">ログインページへ</Link></div>
  //     )}
  //   </div>
  // );
  return (
    <div>
      <p>身近な場所を知る・見つける・記録する</p>
        <PostList />
    </div>
  )

}
