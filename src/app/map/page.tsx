"use client"

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { Status, Wrapper } from "@googlemaps/react-wrapper";
import NewPostButtonFromMap from "../components/Map/NewPostButton-fromMap";

//場所情報の型
export type PlaceInfoType = {
  Id: string | null; // place_id に合わせる
  Lat: number | null;
  Lng: number | null;
  data: string[] | null; // fields に合わせる
}

//場所情報のPropsの型
type GetMapProps = {
  onPlaceInfoSet  : (info: PlaceInfoType) => void;
}

export const GetMap = () => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.marker.AdvancedMarkerElement[]>([]);
  // const [position, setPosition] = useState({ lat: 33.59034972070306,  lng: 130.4017486470046 });
  const [lat, setLat] = useState<number>(33.59034972070306)
  const [lng, setLng] = useState<number>(130.4017486470046)
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null)
  const [ placeInfo, setPlaceInfo ] = useState<PlaceInfoType>(
    {
      Id: '',
      Lat: null,
      Lng: null,
      data: [],
    }
    )
  const [isDragged, setIsDragged] = useState(false); // ドラッグしたかどうか

  const mapElement = useRef<HTMLDivElement>(null);
  const position = {lat: lat, lng: lng}

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
      
      // const marker = new AdvancedMarkerElement({
      //   map: newMap, 
      //   position: position,
      //   title: "ドラッグして場所を選択",
      //   gmpDraggable: true,
      // });

      // マーカーの dragend イベントを追加
      // marker.addListener('dragend', (e: google.maps.MapMouseEvent) => {
      //   if (e.latLng) {
      //     const newLat = e.latLng.lat();
      //     const newLng = e.latLng.lng();
      
      //     setLat(newLat);
      //     setLng(newLng);
      //     setIsDragged(true);
      
      //     setPlaceInfo({
      //       Id: null,
      //       Lat: newLat,
      //       Lng: newLng,
      //       data: [],
      //     });
      //   }
      // });

      // const newInfoWindow = new google.maps.InfoWindow();
      //   setInfoWindow(newInfoWindow);
      // // マーカークリック時に情報ウィンドウを表示
      // marker.addListener('click', () => {
      //   const content = isDragged ?
      //     `<div>
      //       <h3>任意の場所</h3>
      //       <p>緯度: ${placeInfo.Lat}<br>経度: ${placeInfo.Lng}</p>
      //     </div>` :
      //     `
      //     <div>
      //       <h3>福岡市役所</h3>
      //       <p>住所: 〒810-8620 福岡県福岡市中央区天神１丁目８−１</p>
      //       <a href="http://www.city.fukuoka.lg.jp/" target="_blank">ウェブサイト</a>
      //     </div>
      //   `;

      //   // const currentPlaceInfo = isDragged ? {
      //   //   title: "任意の場所",
      //   //   content: `<p>緯度: ${lat}<br>経度: ${lng}</p>`,
      //   // } : {
      //   //   title: "福岡市役所",
      //   //   content: `<p>住所: 〒810-8620 福岡県福岡市中央区天神１丁目８−１</p>
      //   //             <a href="http://www.city.fukuoka.lg.jp/" target="_blank">ウェブサイト</a>`,
      //   // };
      
      //   // const content = `
      //   //   <div>
      //   //     <h3>${currentPlaceInfo.title}</h3>
      //   //     ${currentPlaceInfo.content}
      //   //   </div>
      //   // `;

      //   newInfoWindow.setContent(content);
      //   newInfoWindow.open(newMap, marker);
      // });

      const marker = new AdvancedMarkerElement({
        map: newMap,
        position: { lat: 33.59034972070306, lng: 130.4017486470046 },
        gmpDraggable: true,
        title: "ドラッグして場所を選択"
      });

      setMarkers([marker]); // 状態に保持すると後で使いやすい
      setInfoWindow(new google.maps.InfoWindow());    
    }

  })();
    return cleanUpMap;
  }, []);

  //マーカードラッグ・クリックイベント
  useEffect(() => {
    if (!map || markers.length === 0 || !infoWindow) return;
  
    const marker = markers[0];
  
    // dragend イベント
    marker.addListener('dragend', (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const newLat = e.latLng.lat();
        const newLng = e.latLng.lng();
        setLat(newLat);
        setLng(newLng);
        setIsDragged(true);
        setPlaceInfo({
          Id: null,
          Lat: newLat,
          Lng: newLng,
          data: [],
        });
      }
    });
  
    // click イベント
    marker.addListener('click', () => {
      const content = isDragged
        ? `<div><h3>任意の場所</h3><p>緯度: ${placeInfo.Lat}<br>経度: ${placeInfo.Lng}</p></div>`
        : `<div><h3>福岡市役所</h3><p>住所: 〒810-8620 福岡県福岡市中央区天神１丁目８−１</p>
            <a href="http://www.city.fukuoka.lg.jp/" target="_blank">ウェブサイト</a></div>`;
  
      infoWindow.setContent(content);
      infoWindow.open(map, marker);
    });
  }, [map, markers, infoWindow, isDragged, placeInfo]);

  useEffect(() => {
    console.log("placeInfoが更新されました:", placeInfo);
  }, [placeInfo]);

  // async function submit(event: FormEvent<HTMLFormElement>) {
  //   event.preventDefault();
  //   const formData = new FormData(event.currentTarget);
  //   // const address = String(formData.get("address"));
  //   const searchQuery = String(formData.get("address")); 

  //   //Places api(nearbySearch) 導入
  //   const { PlacesService } = await google.maps.importLibrary("places") as google.maps.PlacesLibrary;
  //   const searchMap =  new PlacesService(map!);
  //   searchMap.nearbySearch({
  //     location: new google.maps.LatLng(position.lat, position.lng), // 現在地を基準
  //     radius: 1000, // 半径1km
  //     keyword: searchQuery // "公園" などのキーワード
  //   }, function (results, status) {
  //       if (status == google.maps.places.PlacesServiceStatus.OK) {

  //           markers.forEach(marker => marker.map = null);
  //           setMarkers([]);
  
  //           const newMarkers: google.maps.marker.AdvancedMarkerElement[] = [];
  
  //           results.forEach(place => {
  //             const location = place.geometry?.location;
  //             if (location) {
  //               const marker = new google.maps.marker.AdvancedMarkerElement({
  //                 map,
  //                 position: { lat: location.lat(), lng: location.lng() },
  //                 title: place.name || "No title"
  //               });

  //               //クリックしたマーカーの情報ウィンドウを表示
  //               if (place.place_id) { // place_id が存在するかチェック
  //                 const request: google.maps.places.PlaceDetailsRequest = {
  //                   placeId: place.place_id,
  //                   fields: ['name', 'formatted_address', 'rating']
  //                 };
                
                
  //               marker.addListener('click', () => {
  //                 const service = new google.maps.places.PlacesService(map);
  //                 // const request = {
  //                 //   placeId: place.place_id,
  //                 //   fields: ['name', 'formatted_address', 'website', 'rating']
  //                 // };
    
  //                 service.getDetails(request, (placeDetails, status) => {
  //                   if (status === google.maps.places.PlacesServiceStatus.OK && placeDetails) {
  //                     const content = `
  //                       <div>
  //                         <h3>${placeDetails.name}</h3>
  //                         <p>住所: ${placeDetails.formatted_address}</p>
  //                         <p>評価: ${placeDetails.rating}</p>
  //                         // <a href="${placeDetails.website}" target="_blank">ウェブサイト</a>
  //                       </div>
  //                     `;
  //                     infoWindow?.setContent(content);
  //                     infoWindow?.open(map, marker);
  //                     //取得した情報をPropsで親へ
  //                     // setPlaceInfo(
  //                     //   {
  //                     //   Id: place.place_id,
  //                     //   data: request.fields,
  //                     //   }
                          
  //                     const onPlaceInfoSet = (info: PlaceInfoType) => {
  //                       setPlaceInfo(info); // 状態更新
  //       };

  //                     onPlaceInfoSet({ Id: place.place_id ?? null, data: placeDetails.formatted_address ? [placeDetails.formatted_address] : null });
  //                   }
  //                 });
  //               });
  //               }
  
  //               newMarkers.push(marker);
  //             }
  //           });
  
  //           setMarkers(newMarkers);
  
  //           // 最初の結果をマップの中心にする
  //           if (results[0]?.geometry?.location) {
  //             map.setCenter(results[0].geometry.location);
  //             map.setZoom(14);
  //           }
  //         }

    
  //   });
  
    
  //   //Geocording 導入
  //   // const { Geocoder } = await google.maps.importLibrary("geocoding") as google.maps.GeocodingLibrary;
  //   // const geocoder = new Geocoder();
  //   // geocoder.geocode({ address }, (results, status) => {
  //   //   if (results) {
  //   //     const { lat, lng } = results[0].geometry.location;
  //   //     if (status === "OK") {
  //   //       setPosition({ lat: lat(), lng: lng() });
  //   //     }
  //   //   }
  //   // });
  // }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    // const address = String(formData.get("address"));
    const searchQuery = String(formData.get("address")); 

    //Places api(textSearch) 導入
    async function textSearch(){
      const { Place, SearchNearbyRankPreference } = await google.maps.importLibrary('places') as google.maps.PlacesLibrary;
      await google.maps.importLibrary("geometry");
      const request = {
        textQuery: searchQuery,
        fields: ['location'],
        locationBias: new google.maps.LatLng(position.lat, position.lng),
        language: 'ja',
        maxResultCount: 5,
        // rankPreference: google.maps.places.SearchNearbyRankPreference.POPULARITY,
      }
  
      const { places } = await Place.searchByText(request);
      
      if (places.length) {
        console.log("全ての結果:", places);
  
        const { LatLngBounds } = (await google.maps.importLibrary("core")) as google.maps.CoreLibrary;
        const bounds = new LatLngBounds();
  
        // 半径1km以内に絞る
        const filteredPlaces = places.filter((place) => {
          if (!place.location) return false;
          const distance = google.maps.geometry.spherical.computeDistanceBetween(
            new google.maps.LatLng(position.lat, position.lng),
            place.location
          );
          return distance <= 1000; // 1km以内のものだけ残す
        });
  
        console.log("フィルタ後の結果:", filteredPlaces);

        // 検索のたびに既存のマーカーを削除
        markers.forEach((marker) => marker.map = null); // 既存のマーカーをマップから削除
        setMarkers([]); // マーカーの状態をリセット
  
        // 結果があればマーカーを表示
        const newMarkers: google.maps.marker.AdvancedMarkerElement[] = [];

        for (const place of filteredPlaces) {
          const marker = await createMarker(place); // createMarkerを利用
          newMarkers.push(marker);
          bounds.extend(place.location as google.maps.LatLng);
        }

        setMarkers(newMarkers);
  
        if (filteredPlaces.length > 0) {
          map.fitBounds(bounds);
        } else {
          console.log("1km以内に該当なし");
        }
      } else {
        console.log("検索結果なし");
      }
    }
    
    textSearch();

    async function createMarker(place) {
      const { AdvancedMarkerElement } = (await google.maps.importLibrary("marker")) as google.maps.MarkerLibrary;
      const { Place } = await google.maps.importLibrary("places") as google.maps.PlacesLibrary;
    
      const marker = new AdvancedMarkerElement({
        map,
        position: place.location,
        title: place.displayName,
      });
    
      marker.addListener("click", async () => {
        if (!place.id) {
          console.error("Place ID が見つかりません:", place);
          return;
        }
    
        const request: google.maps.places.PlaceDetailsRequest = {
          placeId: place.id,
          fields: ['name', 'formatted_address', 'rating',],
        };
    
        const service = new google.maps.places.PlacesService(map); // mapを渡すのがポイント
    
        service.getDetails(request, (placeDetails, status) => {
          if (status !== google.maps.places.PlacesServiceStatus.OK || !placeDetails) {
            console.error("Place details fetch failed", status);
            return;
          }
    
          const content = `
            <div>
              <h3>${placeDetails.name ?? "不明"}</h3>
              <p>住所: ${placeDetails.formatted_address ?? "不明"}</p>
              <p>評価: ${placeDetails.rating ?? "なし"}</p>
            </div>
          `;
          infoWindow.setContent(content);
          infoWindow.open({ map, anchor: marker });

          const onPlaceInfoSet = (info: PlaceInfoType) => {
            setPlaceInfo(info); // 状態更新
          };
          
          onPlaceInfoSet({ Id: place.id ?? '', // place.place_id ではなく place.id を使ってるので注意
            Lat: place.location?.lat?.() ?? 0,
            Lng: place.location?.lng?.() ?? 0,
            data: placeDetails.formatted_address ? [placeDetails.formatted_address] : [], });
            

        });
        
        
      });
    
      return marker;
    }
    
    
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
      {/* <Link href='/post/newPost'>新規投稿</Link> */}
      <NewPostButtonFromMap placeInfo={placeInfo} />
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
  // const [ placeInfo, setPlaceInfo ] = useState<PlaceInfoType>(
  //   {
  //     Id: '',
  //     data: [],
  //   }
  //   )

  //   const onPlaceInfoSet = (info: PlaceInfoType) => {
  //     setPlaceInfo(info); // 状態更新
  //     // handlePlaceInfo(info,setPlaceInfo); // Supabase への追加はNewPost
  //   };

  return (
    <>
    <Wrapper apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
     render={render} />
     <GetMap />
     {/* <NewPost placeInfo={placeInfo} />; // Supabase への追加はNewPost */}
    </>
  );
}

