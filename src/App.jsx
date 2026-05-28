import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import PropertyList from './pages/PropertyList'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* ProtectedRouteで未ログインをログイン画面にリダイレクト */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <PropertyList />
              </ProtectedRoute>
            }
          />
          {/* 未定義パスはホームへ */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
