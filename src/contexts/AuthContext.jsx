import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // undefined: 読み込み中 / null: 未ログイン / Session: ログイン済み
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    // 初期セッションを取得
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // ログイン・ログアウト等の変化を購読
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    // コンポーネントアンマウント時に購読解除
    return () => subscription.unsubscribe()
  }, [])

  return <AuthContext.Provider value={{ session }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
