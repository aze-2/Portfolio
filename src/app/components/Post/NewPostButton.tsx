'use client'

import Link from "next/link"
import { useEffect, useState } from "react"
import useStore from "../../../../store"

//新規投稿ボタン
const NewPostButton = () => {
    const { profile } = useStore()
    const [ login, setLogin ] = useState(false)

    //ログインしている人のみ表示
    const renderButoon = () => {
        if(login) {
            return (
                <div className="mb-5 flex justify-end">
                    <Link href='post/newPost'>
                        <div className="text-white bg-yellow-500 hover:brightness--110 rounded px-8">
                            新規投稿
                        </div>
                    </Link>
                </div>
            )
        }
    }

    useEffect(() => {
        if(profile.id) {
            setLogin(true)
        }
    }, [profile, setLogin])

    return <>{renderButoon()}</>

}

export default NewPostButton