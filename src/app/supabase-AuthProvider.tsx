"use client"

import { createContext, useContext, useEffect, useState } from "react";
import useStore from "../../store";
import NavigationBar from "./components/layout/Navigation";

type User = {
  id: string;
  email: string;
}

type Profile = {
  name: string;
  introduce: string;
  avatar_url: string;
}

// 認証コンテキストの型
type AuthContextType = {
    user: User | null;
    profile: Profile | null;
};

export const AuthContext = createContext<AuthContextType>({ user: null, profile: null });

export function AuthProvider({ children, user, profile }: { children: React.ReactNode; user: User | null, profile: Profile | null }) {
    const [userState, setUserState] = useState<User | null>(user);
    const [profileState, setProfileState] = useState<Profile | null>(profile);
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
          <NavigationBar />
            {children}
        </AuthContext.Provider>
    )
  }
  
  export function useAuth() {
    return useContext(AuthContext);
}
