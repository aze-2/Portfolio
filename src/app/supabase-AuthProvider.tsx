"use client"

import { createContext, useContext, useEffect, useState } from "react";
import useStore from "../../store";

// 認証コンテキストの型
type AuthContextType = {
    user: any | null;
    profile: any | null;
};

export const AuthContext = createContext<AuthContextType>({ user: null, profile: null });

export function AuthProvider({ children, user, profile }: { children: React.ReactNode; user: any | null, profile: any | null }) {
    const [userState, setUserState] = useState<any | null>(user);
    const [profileState, setProfileState] = useState<any | null>(profile);
    const { setProfile } = useStore()

    useEffect(() => {
        setUserState(user);  // user が変わった場合に状態を更新
        setProfileState(profile); // profile も更新
        console.log("userState:", userState); // 確認用ログ
        setProfile({
          id: user ? user.id : '',
            email: user ? user.email : '',
            name: profile ? profile.name : '',
            introduce: profile ? profile.introduce : '',
            avatar_url: profile ? profile.avatar_url : '',
      })

      }, [user, profile]);

    return (
        <AuthContext.Provider value={{user: userState, profile: profileState }}>
            {children}
        </AuthContext.Provider>
    )
  }
  
  export function useAuth() {
    return useContext(AuthContext);
}
//   export default function Layout({ children }: { children: React.ReactNode }) {
//     return (
//       <AuthProvider>
//         <main>{children}</main>
//       </AuthProvider>
//     );
//   }

// export function AuthProvider({ children, serverData }: { children: React.ReactNode; serverData: any | null }) {
//     const [user, setUser] = useState<any | null>(null); 

//     useEffect(() => {
//         // クライアント側でも user を更新できるようにする（例: Supabase のリアルタイムリスナー）
//         const fetchUser = async () => {
//             setUser(serverData.user); // `user` を更新
//         };
//         fetchUser();
//     }, []);

//     console.log(user)

//     return (
//         <AuthContext.Provider value={{ user }}>
//             {children}
//         </AuthContext.Provider>
//     );
// }
