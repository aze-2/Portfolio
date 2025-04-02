'use client'

import { format } from 'date-fns';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { PostType } from '../../../../utils/Post-Types';
import useStore from '../../../../store';
import DeletePostButton from './DeletePostButton';
import EditPostButton from './EditPostButton';

type PageProps = {
    post: PostType
}

const PostDetail = ({ post }: PageProps) => {
    const [loading, setLoading] = useState(false)
    const [myPost, setMyPost] = useState(false)
    const { profile } = useStore()


    // //ポスト削除
    // const deletePost = async() => {
    //     setLoading(true)

    //     //supabaseポスト削除
    //     const { error } = await supabase.from('posts').delete().eq('id', post.id)

    //     if(error) {
    //         alert(error.message)
    //         setLoading(false)
    //         return
    //     }

    //     //ファイル名取得
    //     const fileName = post.image_url.split('/').slice(-1)[0]

    //     //画像を削除
    //     await supabase.storage.from('posts').remove([`${profile.id}/${fileName}`])

    //     router.push('/')
    //     router.refresh()

    //     setLoading(false)
    // }

    //自分のポストのみボタン表示
    const renderButton = () => {
        if(myPost)　{
            return (
                <div className='flex justify-end'>
                    {loading ? (
                        <p>少々お待ちください・・・</p>
                    ) : (
                        <div className='flex items-center space-x-5'>
                            {/* <Link href={`post/&{post.id}/edit`}>編集</Link> */}
                            <div className='cursor-pointer' onClick={deletePost}>削除</div>
                        </div>
                    )}
                </div>
            )
        }
    }

    useEffect(() => {
        if (profile.id === post.user_id) {
            setMyPost(true)
        }
    }, [profile])
    console.log(post)
  return (
    <div className='max-w-screen-md mx-auto'>
        <div className='flex flex-col items-center justify-center mb-5'>
            {/* <div className='mb-1'>
                <Image />
            </div> */}
            <div className='font-bold text-gray-500'>{post.name}</div>
            <div className='text-sm text-gray-500'>
                {format(new Date(post.created_at), 'yyyy/MM/dd HH:mm')}
            </div>

            <div className='mb-5'>
                <div className='text-center font-bold text-3xl mb-5'>{post.title}</div>
                <div className='mb-5'>
                    <Image
                        src={post.image_url}
                        className='rounded-lg aspect-video object-cover'
                        alt='image'
                        width={1024}
                        height={576}
                    />
                </div>
                <div className='leading-relaxed break-words whitespace-pre-wrap'>{post.address}</div>
                <div className='leading-relaxed break-words whitespace-pre-wrap'>{post.content}</div>
            </div>

            {/* {renderButton()} */}
             {/* 自分の投稿なら削除ボタンを表示 */}
             <div className='flex justify-content'>
             {myPost && <EditPostButton postId={post.id}/* userId={profile.id} imageUrl={post.image_url}*/ />}
             {myPost && <DeletePostButton postId={post.id} userId={profile.id} imageUrl={post.image_url} />}
             </div>
        </div>
      
    </div>
  )
}

export default PostDetail
