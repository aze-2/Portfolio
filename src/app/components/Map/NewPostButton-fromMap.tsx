'use client'

import Link from "next/link"
import { useEffect, useState } from "react"
import useStore from "../../../../store"
import { PlaceInfoType } from "@/app/map/page"

type NewPostButtonFromMapProps = {
    placeInfo: PlaceInfoType;
  };

//新規投稿ボタン
const NewPostButtonFromMap = ({ placeInfo }: NewPostButtonFromMapProps) => {
    const { profile } = useStore()
    const [ login, setLogin ] = useState(false)

    //ログインしている人のみ表示
    const renderButoon = () => {
        if(login) {
            return (
                <div className="mb-5 flex justify-end">
                    <Link href={`/post/newPost?${query}`}>
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
    }, [profile])

     // placeInfoをURLクエリとして渡す
    const query = new URLSearchParams({
        id: placeInfo.Id ?? "", 
        lat: placeInfo.Lat?.toString() ?? "",
        lng: placeInfo.Lng?.toString() ?? "",
        data: placeInfo.data?.join(",") ?? "" // 配列をカンマ区切りで渡す
    }).toString();

    return <>{renderButoon()}</>

}

export default NewPostButtonFromMap