// components/Map/PostMap.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { PostQueryType, PostType } from '../../../../../utils/Post-Types'
import ReactDOMServer from 'react-dom/server';
import { FaUser } from 'react-icons/fa';

type Props = {
  posts: PostQueryType[]
}

export default function Map({ posts }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current || map) return

    const initMap = new google.maps.Map(mapRef.current, {
      center: { lat: 35.681236, lng: 139.767125 }, // 初期位置（東京駅）
      zoom: 13,
      mapId: '98eb796fb7d7ee76'
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

          // const marker = new AdvancedMarkerElement({
          //   map,
          //   position,
          //   title: post.title,
          // })
          const icon = document.createElement('div');
          if(post.profiles?.[0]?.avatar_url){
            // icon.innerHTML = `<img src="${post.profiles.avatar_url}" style="width: 32px; height: 32px; border-radius: 50%; />` ;
            const img = document.createElement('img');
            img.src = post.profiles[0].avatar_url;
            img.style.width = '18px';
            img.style.height = '18px';
            img.style.borderRadius = '50%';
            icon.appendChild(img);
            }
            else{
              const HTML = ReactDOMServer.renderToString(<FaUser size={18} />);
              icon.innerHTML = HTML;
            }
          const faPin = new google.maps.marker.PinElement({
            glyph: icon,
            background: '#fff',
            borderColor: '#3f3f3f',
          });
          const marker = new AdvancedMarkerElement({
            map,
            position,
            title: post.title,
            content: faPin.element,
          });
          console.log(marker)

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
