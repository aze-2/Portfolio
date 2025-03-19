"use client"

import { createContext, useEffect, useState } from "react";
import { getUser } from "./supabase-GetUser";

// 認証コンテキストの型
type AuthContextType = {
    user: any | null;
};

const AuthContext = createContext<AuthContextType>({ user: null });

export function AuthProvider({ children, serverData }: { children: React.ReactNode; serverData: any | null }) {
    return (
        <AuthContext.Provider value={{ user: serverData }}>
            {children}
        </AuthContext.Provider>
    )
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
