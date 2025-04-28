import { format } from 'date-fns';
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { PostType } from '../../../../utils/Post-Types';

const PostItem: React.FC<PostType>  = ({ id, created_at, title, content, image_url, profiles }) => {
    // const MAX_LENGTH = 20
    // let content = post.replace(/\r?n/g, '')

    // if(content.length > MAX_LENGTH) {
    //     content = content.substring(0, MAX_LENGTH) + '...'
    // }
    console.log('name', profiles?.name)
  return (
    <div>
      <div className='mb-5'>
        <Link href={`post/${id}`}>
            <Image 
                src={image_url}
                className='rounded-lg aspect-video object-cover'
                alt='image'
                width={640}
                height={360}
            />
        </Link>
      </div>
      <div className='text-gray-500 text-sm'>
        {format(new Date(created_at), 'yyyy/MM/dd HH:mm')}
      </div>
      <div className='font-bold text-xl'>{title}</div>
      <div className='mb-3 text-gray-500'>{content}</div>
      {/* <div className='flex iems-center space-x-3'>
        <Image
            src={avatar_url ? avatar_url : 'default.png'}
            className='rounded-full'
            alt='avatar'
            width={45}
            height={45}
        />
      </div> */}
      <div className='font-bold'>{profiles?.name ?? ''}</div>
    </div>
  )
}

export default PostItem
