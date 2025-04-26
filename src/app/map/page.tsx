"use client"

import { Status, Wrapper } from "@googlemaps/react-wrapper";
import GetMap from "../components/Map/GetMap";


//場所情報のPropsの型
// type GetMapProps = {
//   onPlaceInfoSet  : (info: PlaceInfoType) => void;
// }
// const render = (status: Status) => {
//   switch (status) {
//     case Status.LOADING:
//       return <div>loading...</div>;
//     case Status.FAILURE:
//       return <div>fail...</div>;
//     case Status.SUCCESS:
//       return <GetMap />;
//     default:
//       return null;
//   }
// };
const render = (status: Status) => {
  if (status === Status.FAILURE) return <div>fail...</div>;
  if (status === Status.SUCCESS) return <GetMap />;
  return <div>loading...</div>;
};

// const render = (status: Status) => {
//   switch (status) {
//     case Status.LOADING:
//       return <div>loading...</div>;
//     case Status.FAILURE:
//       return <div>fail...</div>;
//     case Status.SUCCESS:
//       return <GetMap />;
//     default:
//       return <div>loading...</div>; // ←ここ！
//   }
// };

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
     libraries={["places", "marker", "geometry"]}
     render={render} />
     {/* <GetMap /> */}
     {/* <NewPost placeInfo={placeInfo} />; // Supabase への追加はNewPost */}
    </>
  );
}

