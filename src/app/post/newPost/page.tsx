import { getUser } from "@/app/components/GetUser"
import NewPost from "@/app/components/Post/NewPost"

export default async function postPage() {
    const user = await getUser()

    return <NewPost serverUser={user} />
}

