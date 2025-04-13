// 'use client'

// import { zodResolver } from "@hookform/resolvers/zod"
// import Image from "next/image"
// import { useRouter } from "next/navigation"
// import { useCallback, useEffect, useState } from "react"
// import { SubmitHandler, useForm } from "react-hook-form"
// import { supabase } from "utils/supabase"
// import { z } from "zod"
// import { v4 as uuidv4 } from 'uuid'
// import { signOut } from "../signout/SignOut"
// import useStore from "../../../../store"
// import { useAuth } from "@/app/supabase-AuthProvider"




// type Schema = z.infer<typeof schema>


// //入力データの検証ルールを定義
// const schema = z.object({
//     name: z.string().min(2, { message: '２文字以上入力する必要があります。 ' }),
//     introduce:  z.string().min(0),
// })

// //プロフィール
// const Profile = () => {
//     const router = useRouter();
//     const [ loading, setLoading ] = useState(false);
//     const [ avatar, setAvatar ] = useState<File | null>(null)
//     const [ message, setMessage ] = useState('');
//     const [ fileMessage, setFileMessage ] = useState('')
//     const [ avatarUrl, setAvatarUrl ] = useState('')
//     const [loadingLogout, setLoadingLogout] = useState(false)
//     const { user } = useAuth()
//     const {
//         register,
//         handleSubmit,
//         formState: { errors },
//         reset
//     } = useForm({
//         //初期値
//         defaultValues: {
//              name: user.name ? user.name : '',
//              introduce: user.introduce ? user.introduce : '',
//         },
//         //入力値の検証
//         resolver: zodResolver(schema),

//     })

//         //アバター画像の取得
//         useEffect(() => {
//             if (user && user.avatar_url) {
//                 setAvatarUrl(user.avatar_url)
//             }
//         }, [user])

//         //画像アップロード
//         const onUploadImage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//             const files = e.target.files
//             setFileMessage('')

//             //ファイルが選択されていない場合
//             if (!files || files?.length == 0) {
//                 setFileMessage('画像をアップロードしてください')
//             return
//         }
    
//         const fileSize = files[0]?.size / 1024 / 1024 // size in MB
//         const fileType = files[0]?.type // MIME type of the file

//         //画像サイズが2MBを超える場合
//         if (fileSize > 2) {
//             setFileMessage('画像サイズを2MB以下にする必要があります。')
//             return
//         }

//         //ファイル形式がjpgまたはpngでない場合
//         if (fileType !== 'image/jpeg' && fileType !== 'image/png' ) {
//             setFileMessage('画像はjpgまたはpng形式である必要があります。')
//             return
//         }

//         //画像をセット
//         setAvatar(files[0])
//     },[])

//     //送信
//     const onSubmit: SubmitHandler<Schema> = async (data) => {
//         setLoading(true)
//         setMessage('')

//         try {
//             let avatar_url = user.avatar_url

//             if (avatar) {
//                 //supabaseストレージに画像アップロード
//                 const { data: storageData, error: storageError } = await supabase.storage
//                  .from('profile')
//                  .upload(`${user.id}/${uuidv4()}`, avatar)

//                 //エラーチェック
//                 if (storageError) {
//                     setMessage('エラーが発生しました。' + storageError.message)
//                     return
//                 }

//                 //古い画像を削除
//                 await supabase.storage.from('profile').remove([`${user.id}/${fileName}`])

//                 //画像のURLを取得
//                 const { data: urlData } = await supabase.storage
//                  .from('profile')
//                  .getPublicUrl(storageData.path)

//                 avatar_url = urlData.publicUrl

//                 if (avatar_url) {
//                     const fileName = avatar_url.split('/').slice(-1)[0]
//                 }
    
//             }

//             //プロフィールアップデート
//             const { error: updateError } = supabase
//              .from('profiles')
//              .update({
//                 name: data.name,
//                 introduce: data.introduce,
//                 avatar_url,
//              })
//              .eq('id', user.id)
            
//             //エラーチェック
//             if (updateError) {
//                 setMessage('エラーが発生しました。' + updateError.message)
//                 return
//             }

//             setMessage('プロフィールを更新しました。。')
//         } catch (error) {
//             setMessage('エラーが発生しました。' + error)
//             return
//         } finally {
//             setLoading(false)
//             router.refresh()
//         }
//     }

    

//     return (
//         <div>
//             <div className="text-center font-bold text-xl mb-10">プロフィール</div>
//             <form onSubmit={handleSubmit(onSubmit)}>
//                 {/*アバター画像*/}
//                 <div className="mb-5">
//                     <div className="flex flex-col text-sm items-center justify-center mb-5">
//                         <div className="relative w-24 h-24 mb-5">
//                             <Image src={avatarUrl} className="rounded-full object-cover" alt="avatar" fill />
//                         </div>
//                         <input type="file" id="avatar" onChange={onUploadImage} />
//                         {fileMessage && <div className="text-center text-red-500 my-5">{fileMessage}</div>}
//                     </div>
//                 </div>

//                 {/*名前*/}
//                 <div className="mb-5">
//                         <div className="text-sm mb-1 font-bold">名前</div>
//                         <input
//                          type='text'
//                          className='border rounded-md w-full py-2 px-3 focus:outline-none focus:border-sky-500'
//                          placeholder='名前'
//                          id='name'
//                          {...register('name', { required: true })}
//                          required
//                         />
//                         <div className='my-3 text-center text-sm text-red-500'>{ errors.name?.message }</div>
//                 </div>

//                 {/*自己紹介*/}
//                 <div className="mb-5">
//                         <div className="text-sm mb-1 font-bold">自己紹介</div>
//                         <textarea
//                          className='border rounded-md w-full py-2 px-3 focus:outline-none focus:border-sky-500'
//                          placeholder='自己紹介'
//                          id='introduce'
//                          {...register('introduce')}
//                          rows={5}
//                         />
//                 </div>

//                 {/*自己紹介*/}
//                 <div className="mb-5">
//                     {loading ? (
//                         <div>少々お待ちください・・</div>
//                     ) : (
//                         <button
//                             type="submit"
//                             className="font-bold bg-sky-500 hover:brightness-95 w-full rounded-full p-2 text-white text-sm"
//                         >変更
//                         </button>
//                     )
//                     }
//                 </div>
//             </form>

//             {/*メッセージ*/}
//             {message && <div className="my-5 text-center text-red-500 mb-5">{message}</div>}

//             <div className="text-center">
//                     {loading ? (
//                         <div>少々お待ちください・・</div>
//                     ) : (
//                         <div className="inline-block text-red-500 cursol-pointer" onClick={logout}>
//                             ログアウト
//                         </div>
//                     )
//                     }
//             </div>
//         </div>
//     )

// }

// export default Profile

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Image from 'next/image'
import { useAuth } from '@/app/supabase-AuthProvider'
import { useRouter } from 'next/navigation'
import { signOut } from '../signout/SignOut'
import useStore from '../../../../store'

const schema = z.object({
  name: z.string().min(2, { message: '２文字以上入力する必要があります。' }),
  introduce: z.string().optional(),
})

type Schema = z.infer<typeof schema>

const Profile = () => {
  const router = useRouter();
  const [avatarUrl, setAvatarUrl] = useState('')
  const [message, setMessage] = useState('')
  const [fileMessage, setFileMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingLogout, setLoadingLogout] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const { user } = useAuth()
  const { profile } = useStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<Schema>({
    defaultValues: {
      name: '',
      introduce: '',
    },
    resolver: zodResolver(schema),
  })

  if (!user) {
    return <div className="text-center mt-10">プロフィールを読み込み中...</div>
  }

  console.log({profile})

  useEffect(() => {
    if (profile) {
        setAvatarUrl(profile.avatar_url || '')
        setValue('name', profile.name || '')
        setValue('introduce', profile.introduce || '')
      }
    }, [profile, setValue])

  const onUploadImage = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    setFileMessage('')

    if (!files || files.length === 0) {
      setFileMessage('画像をアップロードしてください')
      return
    }

    const file = files[0]
    const fileSize = file.size / 1024 / 1024
    const fileType = file.type

    if (fileSize > 2) {
      setFileMessage('画像サイズを2MB以下にしてください')
      return
    }

    if (fileType !== 'image/jpeg' && fileType !== 'image/png') {
      setFileMessage('画像はjpgまたはpng形式である必要があります。')
      return
    }

    const formData = new FormData()
    formData.append('avatar', file)

    const res = await fetch('/api/profile/upload', {
      method: 'POST',
      body: formData,
    })

    const result = await res.json()

    if (!res.ok) {
      setFileMessage(result.error || 'アップロードに失敗しました')
      return
    }

    setAvatarUrl(result.avatar_url)
  }, [])

  const onSubmit = async (data: Schema) => {
    setLoading(true)
    setMessage('')

    const res = await fetch('/api/profile/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        avatar_url: avatarUrl,
      }),
    })

    const result = await res.json()
    setLoading(false)

    if (!res.ok) {
      setMessage(result.error || '更新に失敗しました')
      return
    }

    setMessage(result.message)
    setIsEdit(false) // 編集→表示に戻る
  }

  const logout = async () => {
    setLoadingLogout(true)
    await signOut
    router.push('/')
    setLoadingLogout(false)
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-center mb-6">プロフィール</h2>

      {isEdit ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col items-center mb-4">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <Image
              src={avatarUrl ? avatarUrl : '/default.png'}
              alt="avatar"
              className="rounded-full object-cover"
              fill
            />
          </div>
            <input type="file" accept="image/*" onChange={onUploadImage} />
            {fileMessage && <p className="text-sm text-red-500 mt-2">{fileMessage}</p>}
          </div>

          <div className="mb-4">
            <label className="text-sm font-bold">名前</label>
            <input
              className="w-full p-2 border rounded"
              {...register('name')}
              placeholder="名前"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          <div className="mb-4">
            <label className="text-sm font-bold">自己紹介</label>
            <textarea
              className="w-full p-2 border rounded"
              rows={4}
              {...register('introduce')}
              placeholder="自己紹介"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-sky-500 text-white p-2 rounded hover:brightness-110"
            >
              {loading ? '更新中...' : '更新'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEdit(false)
                setMessage('')
              }}
              className="flex-1 bg-gray-300 p-2 rounded"
            >
              キャンセル
            </button>
          </div>

          {message && <p className="text-center text-sm text-red-500 mt-4">{message}</p>}
        </form>
      ) : (
        <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
            <Image
              src={avatarUrl ? avatarUrl : '/default.png'}
              alt="avatar"
              className="rounded-full object-cover"
              fill
            />
          </div>
          <p className="text-lg font-bold">{profile.name}</p>
          <p className="text-sm text-gray-600 mt-2 whitespace-pre-line">{profile.introduce}</p>

          <button
            onClick={() => setIsEdit(true)}
            className="mt-4 bg-sky-500 text-white px-4 py-2 rounded hover:brightness-110"
          >
            プロフィールを編集
          </button>
        </div>
      )}

      <div className="text-center mt-6">
        {loadingLogout ? (
          <div>少々お待ちください・・</div>
        ) : (
          <div className="inline-block text-red-500 cursor-pointer" onClick={logout}>
            ログアウト
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
