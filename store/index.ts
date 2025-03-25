//zustand Reactの状態管理ライブラリ
import { create } from "zustand"
import { Database } from "../lib/databese"

type ProfileType = Database['public']['Tables']['profiles']['Row']

type ProfileState = {
    profile: ProfileType
    setProfile: (payload: ProfileType) => void
}

const useStore = create<ProfileState>((set)=>({
    //初期値
    profile: { id: '', email: '', name: '', introduce: '', avatar_url: '' },
    //アップデート
    setProfile: (payload) => set({ profile: payload }), 
}))

export default useStore