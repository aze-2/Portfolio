
import PostList from "./components/Post-AllUsers/Post-List";
import { Box, Text, Stack } from "@chakra-ui/react";


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
  // return (
  //   <div>
  //     <p>身近な場所を知る・見つける・記録する</p>
  //       <PostList />
  //   </div>
  // )
  
    return (
      <Box p={8} bg="gray.50" minH="100vh">
        <Stack spacing={4} align="left" textAlign="center" maxW="3xl" mx="auto" py={12}>
          {/* <Text fontSize="4xl" fontWeight="bold">
            身近な場所を知る・見つける・記録する
          </Text> */}
          <Text fontSize="lg" color="gray.600">
          身近な場所を知る・見つける・記録する
          </Text>
        </Stack>
  
        <Box mt={10}>
          <PostList />
        </Box>
      </Box>
    );
  }
  


