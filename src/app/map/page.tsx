"use client"

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { Status, Wrapper } from "@googlemaps/react-wrapper";
import Link from "next/link";
import { useRouter } from "next/navigation";
import NewPost from "../components/Post/NewPost";

//場所情報の型
export type PlaceInfoType = {
  Id: string | null; // place_id に合わせる
  data: string[] | null; // fields に合わせる
}

//場所情報のPropsの型
type GetMapProps = {
  onPlaceInfoSet  : (info: PlaceInfoType) => void;
}

export const GetMap = ({ onPlaceInfoSet  }: GetMapProps) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.marker.AdvancedMarkerElement[]>([]);
  // const [position, setPosition] = useState({ lat: 33.59034972070306,  lng: 130.4017486470046 });
  const [lat, setLat] = useState<number>(33.59034972070306)
  const [lng, setLng] = useState<number>(130.4017486470046)
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null)
  const mapElement = useRef<HTMLDivElement>(null);
  const position = {lat: lat, lng: lng}
  const router = useRouter();

  //Google マップのインスタンスを破棄 (map.setMap(null)),React の map ステートをリセット (setMap(null)
  const cleanUpMap = useCallback(() => {
    if (map) {
      setMap(null);
    }
  }, [map]);

  useEffect(() => {
    (async() => {
    if (mapElement.current && !map) {

      const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;;
      const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

      const newMap = new Map(mapElement.current, {
        center: position,
        gestureHandling: "greedy",
        zoom: 14,
        mapId: 'DEMO_MAP_ID'
      });

      setMap(newMap);
      
      const marker = new AdvancedMarkerElement({
        map: newMap, 
        position: position,
        title: "Marker",
        
      });

      const newInfoWindow = new google.maps.InfoWindow();
        setInfoWindow(newInfoWindow);
      // マーカークリック時に情報ウィンドウを表示
      marker.addListener('click', () => {
        newInfoWindow.setContent(`
          <div>
            <h3>福岡市役所</h3>
            <p>住所: 〒810-8620 福岡県福岡市中央区天神１丁目８−１</p>
            <a href="http://www.city.fukuoka.lg.jp/" target="_blank">ウェブサイト</a>
          </div>
        `);
        newInfoWindow.open(newMap, marker);
      });
    }

  })();
    return cleanUpMap;
  }, []);

  useEffect(()=> {
    const handleMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        setLat(e.latLng.lat());
        setLng(e.latLng.lng());
      }
    };

  })

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    // const address = String(formData.get("address"));
    const searchQuery = String(formData.get("address")); 

    //Places api(nearbySearch) 導入
    const { PlacesService } = await google.maps.importLibrary("places") as google.maps.PlacesLibrary;
    const searchMap =  new PlacesService(map!);
    searchMap.nearbySearch({
      location: new google.maps.LatLng(position.lat, position.lng), // 現在地を基準
      radius: 1000, // 半径1km
      keyword: searchQuery // "公園" などのキーワード
    }, function (results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {

            markers.forEach(marker => marker.map = null);
            setMarkers([]);
  
            const newMarkers: google.maps.marker.AdvancedMarkerElement[] = [];
  
            results.forEach(place => {
              const location = place.geometry?.location;
              if (location) {
                const marker = new google.maps.marker.AdvancedMarkerElement({
                  map,
                  position: { lat: location.lat(), lng: location.lng() },
                  title: place.name || "No title"
                });

                //クリックしたマーカーの情報ウィンドウを表示
                if (place.place_id) { // place_id が存在するかチェック
                  const request: google.maps.places.PlaceDetailsRequest = {
                    placeId: place.place_id,
                    fields: ['name', 'formatted_address', 'website', 'rating']
                  };
                
                
                marker.addListener('click', () => {
                  const service = new google.maps.places.PlacesService(map);
                  // const request = {
                  //   placeId: place.place_id,
                  //   fields: ['name', 'formatted_address', 'website', 'rating']
                  // };
    
                  service.getDetails(request, (placeDetails, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK && placeDetails) {
                      const content = `
                        <div>
                          <h3>${placeDetails.name}</h3>
                          <p>住所: ${placeDetails.formatted_address}</p>
                          <p>評価: ${placeDetails.rating}</p>
                          <a href="${placeDetails.website}" target="_blank">ウェブサイト</a>
                        </div>
                      `;
                      infoWindow?.setContent(content);
                      infoWindow?.open(map, marker);
                      //取得した情報をPropsで親へ
                      // setPlaceInfo(
                      //   {
                      //   Id: place.place_id,
                      //   data: request.fields,
                      //   }
                      onPlaceInfoSet({ Id: place.place_id ?? null, data: placeDetails.formatted_address ? [placeDetails.formatted_address] : null });
                      
                      // 投稿ページに遷移しつつ、住所をクエリとして渡す
                      // router.push(`/post/newPost?address=${encodeURIComponent(placeDetails.formatted_address ?? "")}`);
                    }
                  });
                });
                }
  
                newMarkers.push(marker);
              }
            });
  
            setMarkers(newMarkers);
  
            // 最初の結果をマップの中心にする
            if (results[0]?.geometry?.location) {
              map.setCenter(results[0].geometry.location);
              map.setZoom(14);
            }
          }

    
    });
  
    
    //Geocording 導入
    // const { Geocoder } = await google.maps.importLibrary("geocoding") as google.maps.GeocodingLibrary;
    // const geocoder = new Geocoder();
    // geocoder.geocode({ address }, (results, status) => {
    //   if (results) {
    //     const { lat, lng } = results[0].geometry.location;
    //     if (status === "OK") {
    //       setPosition({ lat: lat(), lng: lng() });
    //     }
    //   }
    // });
  }

  return (
    <>
      <div ref={mapElement} style={{ width: "80vw", height: "80vh" }} />
      <form onSubmit={submit} className="mt-4">
        <input type="text" name="address" className="mr-2" />
        <button className="px-2 rounded-full bg-green-200 hover:bg-green-300">検索</button>
      </form>
      <Link href='/post/newPost'>新規投稿</Link>
    </>
  );
};

const render = (status: Status) => {
  switch (status) {
    case Status.LOADING:
      return <div>loading...</div>;
    case Status.FAILURE:
      return <div>fail...</div>;
    case Status.SUCCESS:
      return null/*<GetMap />*/;
    default:
      return null;
  }
};

export default function MyMap() {
  const [ placeInfo, setPlaceInfo ] = useState<PlaceInfoType>(
    {
      Id: '',
      data: [],
    }
    )

    const onPlaceInfoSet = (info: PlaceInfoType) => {
      setPlaceInfo(info); // 状態更新
      handlePlaceInfo(info,setPlaceInfo); // Supabase への追加はNewPost
    };

  return (
    <>
    <Wrapper apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
     render={render} />
     <GetMap onPlaceInfoSet={onPlaceInfoSet} />
     <NewPost placeInfo={placeInfo} />; // Supabase への追加はNewPost
    </>
  );
}

