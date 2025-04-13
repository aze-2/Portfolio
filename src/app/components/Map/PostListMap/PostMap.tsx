// components/Map/PostMap.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { PostType } from '../../../../../utils/Post-Types'

type Props = {
  posts: PostType[]
}

export default function PostMap({ posts }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current || map) return

    const initMap = new google.maps.Map(mapRef.current, {
      center: { lat: 35.681236, lng: 139.767125 }, // 初期位置（東京駅）
      zoom: 13,
      mapId: 'DEMO_MAP_ID'
    })

    setMap(initMap)
  }, [mapRef, map])

  useEffect(() => {
    if (!map) return

    const drawMarkers = async () => {
      const { AdvancedMarkerElement } = await google.maps.importLibrary('marker') as google.maps.MarkerLibrary
      const bounds = new google.maps.LatLngBounds()

      posts.forEach((post) => {
        if (post.lat && post.lng) {
          const position = new google.maps.LatLng(post.lat, post.lng)

          const marker = new AdvancedMarkerElement({
            map,
            position,
            title: post.title,
          })

          bounds.extend(position)
        }
      })

      if (!bounds.isEmpty()) {
        map.fitBounds(bounds)
      }
    }

    drawMarkers()
  }, [map, posts])

  return <div ref={mapRef} className="w-full h-[500px] rounded-xl shadow-md" />
}
