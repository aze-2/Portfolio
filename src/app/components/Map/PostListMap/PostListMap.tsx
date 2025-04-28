// components/Map/PostListMap.tsx
'use client'

import { Status, Wrapper } from '@googlemaps/react-wrapper'
import { PostQueryType } from '../../../../../utils/Post-Types'
import Map from './Map'

type Props = {
  posts: PostQueryType[]
}

export default function PostListMap({ posts }: Props) {
  const render = (status: Status) => {
    if (status === Status.FAILURE) return <div>fail...</div>;
    if (status === Status.SUCCESS) return <Map posts={posts} />;
    return <div>loading...</div>;
  };
  
  
  return (
    <div className="mb-8">
      <Wrapper
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
        libraries={['places', 'marker', 'geometry']}
        render={render}
      >
        {/* <Map posts={posts} /> */}
      </Wrapper>
    </div>
  )
}
