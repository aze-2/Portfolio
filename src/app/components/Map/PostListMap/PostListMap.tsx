// components/Map/PostListMap.tsx
'use client'

import { Status, Wrapper } from '@googlemaps/react-wrapper'
import { PostType } from '../../../../../utils/Post-Types'
import Map from './Map'

type Props = {
  posts: PostType[]
}

export default function PostListMap({ posts }: Props) {
  const render = (status: Status) => {
    switch (status) {
      case Status.LOADING:
        return <div>loading...</div>;
      case Status.FAILURE:
        return <div>fail...</div>;
      case Status.SUCCESS:
        return null;
      default:
        return null;
    }
  };
  
  return (
    <div className="mb-8">
      <Wrapper
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
        libraries={['places', 'marker', 'geometry']}
        render={render}
      >
        <Map posts={posts} />
      </Wrapper>
    </div>
  )
}
