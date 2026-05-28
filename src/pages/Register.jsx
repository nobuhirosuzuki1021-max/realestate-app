import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../contexts/AuthContext'

export default function Register() {
  const { session } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  // ログイン済みの場合はホームにリダイレクト
  if (session) return <Navigate to="/" replace />

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setError(error.message)
    } else {
      // Supabaseのデフォルト設定ではメール確認が必要
      setSuccess('確認メールを送信しました。メールのリンクをクリックして登録を完了してください。')
    }

    setLoading(false)
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">🏠</div>
        <h1>会員登録</h1>
        <p className="auth-subtitle">不動産管理アプリ</p>

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="email">メールアドレス</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">パスワード（6文字以上）</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワードを入力"
              required
              minLength={6}
            />
          </div>

          {error && <p className="message error">{error}</p>}
          {success && <p className="message success">{success}</p>}

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? '登録中...' : '会員登録'}
          </button>
        </form>

        <p className="auth-link">
          すでにアカウントをお持ちの方は <Link to="/login">ログイン</Link>
        </p>
      </div>
    </div>
  )
}
