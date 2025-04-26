'use client'

import React, { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react'
import { Database } from '../../../../lib/databese'
import { useRouter } from 'next/navigation'
import useStore from '../../../../store'

type Post = Database['public']['Tables']['posts']['Row']
type PageProps = {
    post: Post
}

const PostEdit = ({ post }: PageProps) => {
    const router = useRouter()
    const { profile } = useStore();
    const [title, setTitle] = useState('')
    const [address, setAddress] = useState('')
    const [content, setContent] = useState('')
    const [image, setImage] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [myPost, setMyPost] = useState(false)
    // const titleRef = useRef<HTMLInputElement>(null)
    // const addressRef = useRef<HTMLInputElement>(null)
    // const contentRef = useRef<HTMLTextAreaElement>(null)
    
    useEffect(() => {
        //自分が投稿したポストチェック
        if (profile.id !== post.user_id) {
            router.push(`/post/${profile.id}`)
        } else {
            //自分が投稿したポストだった場合の初期値設定
            setTitle(post.title)
            setAddress(post.address)
            setContent(post.content)
            setMyPost(true)
        }
    },[post.user_id, post.title, post.address, post.content, profile.id, router])

    //画像アップロード
    const onUploadImage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files

        if(!files || files?.length == 0) {
            return
        }
        setImage(files[0])
    },[])

    //送信
    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        // if (profile.id) {
        //     let image_url = post.image_url

        //     if (image) {
        //         //supabaseストレージに画像をアップロード
        //         const { data: storageData, error: storageError } = await supabase.storage
        //          .from('posts')
        //          .upload(`${profile.id}/${uuidv4()}`, image)

        //         if (storageError) {
        //             alert(storageError.message)
        //             setLoading(false)
        //             return
        //         }

        //         //ファイル名取得
        //         const fileName = image_url.split('/').slice(-1)[0]

        //         //古い画像削除
        //         await supabase.storage.from('posts').remove([`${profile.id}/${fileName}`])

        //         //画像のURLを取得
        //         const { data: urlData } = supabase.storage.from('posts').getPublicUrl(storageData.path)

        //         image_url = urlData.publicUrl
        //     }

        //     //ブログをアップデート
        //     const { error: updateError } = await supabase
        //      .from('posts')
        //      .update({
        //         title,
        //         content,
        //         image_url
        //      })
        //      .eq('id', post.id)

        //     if (updateError) {
        //         alert(updateError.message)
        //         setLoading(false)
        //         return
        //     }

        //     //ブログ詳細に遷移
        //     router.push(`/post/${post.id}`)
        //     router.refresh()
        // }


    //     setLoading(false)
    // }

    if (!profile.id) {
        alert("User ID is missing")
        setLoading(false)
        return
    }

    const formData = new FormData()
    formData.append('title', title)
    formData.append('address', address)
    formData.append('content', content)
    formData.append('userId', profile.id)
    if (image) {
        formData.append('image', image)
    }
    formData.append('imageUrl', post.image_url)
    formData.append('postId', post.id)


    formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
    })

    try {
        const response = await fetch('/api/editPost', {
            method: 'PUT',
            body: formData,
        })

        if (!response.ok) {
            throw new Error('Failed to update post');
        }
        
        router.push('/user')

    } catch(error) {
        console.error("Error:", error); 
        alert('Something went wrong')
    }

    setLoading(false)
    }

    //自分が投稿したポストを表示
    const renderPost = () => {
        if(myPost) {
            return (
                <div className='max-w-screen-md mx-auto'>
                    <form onSubmit={onSubmit}>
                        <div className='mb-5'>
                            <div className='text-sm mb-1'>タイトル</div>
                            <input 
                                className='w-full bg-gray-100 rounded border py-a px-3 outline-none focus:bg-transparent focus:ring-2 focus:ring-yellow-500'
                                type='text'
                                id='title'
                                placeholder='Title'
                                value={title}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className='mb-5'>
                            <div className='text-sm mb-1'>住所</div>
                            <input 
                                className='w-full bg-gray-100 rounded border py-a px-3 outline-none focus:bg-transparent focus:ring-2 focus:ring-yellow-500'
                                type='text'
                                id='address'
                                placeholder='Address'
                                value={address}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setAddress(e.target.value)}
                                required
                            />
                        </div>

                        <div className='mb-5'>
                            <div className='text-sm mb-1'>画像</div>
                            <input 
                                type='file'
                                id='thumbnail'
                                onChange={onUploadImage}
                            />
                        </div>

                        <div className='mb-5'>
                            <div className='text-sm mb-1'>内容</div>
                            <textarea 
                                className='w-full bg-gray-100 rounded border py-a px-3 outline-none focus:bg-transparent focus:ring-2 focus:ring-yellow-500'
                                id='content'
                                placeholder='Content'
                                value={content}
                                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
                                required
                            />
                        </div>

                        <div className='text-center mb-5'>
                            {loading ? (
                                <p>少々お待ちください・・・</p>
                            ) : (
                                <button
                                    type='submit'
                                    className='w-full text-white bg-yellow-500 hover:brightness-110 rounded py-1 px-8'
                                >
                                編集       
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            )
        }
    }

  return <>{renderPost()}</>
}

export default PostEdit
