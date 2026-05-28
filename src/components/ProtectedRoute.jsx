import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// 未ログインユーザーをログイン画面にリダイレクトするガード
export default function ProtectedRoute({ children }) {
  const { session } = useAuth()

  // セッション確認中はコンテンツを表示しない
  if (session === undefined) return null

  // 未ログインならログイン画面へ
  if (!session) return <Navigate to="/login" replace />

  return children
}
