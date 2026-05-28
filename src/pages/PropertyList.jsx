import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../contexts/AuthContext'
import PropertyForm from '../components/PropertyForm'

export default function PropertyList() {
  const { session } = useAuth()
  const navigate = useNavigate()

  // 物件データ
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // モーダル制御: null=非表示 / null=新規登録 / オブジェクト=編集対象
  const [showForm, setShowForm] = useState(false)
  const [editingProperty, setEditingProperty] = useState(null)

  // 削除確認: 確認中の物件ID（nullなら非表示）
  const [deletingId, setDeletingId] = useState(null)

  // ---- データ取得 ----
  const fetchProperties = async () => {
    setLoading(true)
    setError('')

    // RLSにより自分の物件のみ取得される
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setError('物件の取得に失敗しました: ' + error.message)
    } else {
      setProperties(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  // ---- ログアウト ----
  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  // ---- 削除 ----
  const handleDelete = async (id) => {
    // RLSにより自分の物件のみ削除可能
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id)

    if (error) {
      setError('削除に失敗しました: ' + error.message)
    } else {
      // ローカルStateからも削除してUIを即時更新
      setProperties((prev) => prev.filter((p) => p.id !== id))
    }
    setDeletingId(null)
  }

  // ---- 新規登録ボタン ----
  const handleAddClick = () => {
    setEditingProperty(null)
    setShowForm(true)
  }

  // ---- 編集ボタン ----
  const handleEditClick = (property) => {
    setEditingProperty(property)
    setShowForm(true)
  }

  // ---- フォーム完了後（INSERT/UPDATE後）----
  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingProperty(null)
    fetchProperties() // 最新データを再取得
  }

  // ---- フォームキャンセル ----
  const handleFormCancel = () => {
    setShowForm(false)
    setEditingProperty(null)
  }

  return (
    <div className="property-list-container">
      {/* ヘッダー */}
      <div className="property-list-header">
        <h1>物件一覧</h1>
        <div className="header-actions">
          <span className="user-email">{session?.user?.email}</span>
          <button onClick={handleAddClick} className="btn-add">
            ＋ 物件を追加
          </button>
          <button onClick={handleLogout} className="btn-logout">
            ログアウト
          </button>
        </div>
      </div>

      {/* エラーメッセージ */}
      {error && <p className="message error">{error}</p>}

      {/* コンテンツ */}
      {loading ? (
        <div className="loading">読み込み中...</div>
      ) : properties.length === 0 ? (
        // 物件が1件もない場合
        <div className="empty-state">
          <p>登録された物件がありません。</p>
          <button onClick={handleAddClick} className="btn-primary">
            最初の物件を登録する
          </button>
        </div>
      ) : (
        // 物件カードグリッド
        <div className="property-grid">
          {properties.map((property) => (
            <div key={property.id} className="property-card">
              <div className="property-card-image">🏠</div>
              <div className="property-card-body">
                <h3>{property.name}</h3>
                <p className="property-rent">
                  {property.rent.toLocaleString()}円
                  <span className="rent-unit"> / 月</span>
                </p>
                <div className="property-meta">
                  <span className="property-tag">📍 {property.area}</span>
                  <span className="property-tag">🚪 {property.rooms}</span>
                </div>

                {/* 編集・削除ボタン */}
                <div className="property-card-actions">
                  <button
                    onClick={() => handleEditClick(property)}
                    className="btn-edit"
                  >
                    編集
                  </button>

                  {/* 削除確認インライン表示 */}
                  {deletingId === property.id ? (
                    <div className="delete-confirm">
                      <span>削除しますか？</span>
                      <button
                        onClick={() => handleDelete(property.id)}
                        className="btn-delete-confirm"
                      >
                        はい
                      </button>
                      <button
                        onClick={() => setDeletingId(null)}
                        className="btn-cancel"
                      >
                        いいえ
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeletingId(property.id)}
                      className="btn-delete"
                    >
                      削除
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 物件登録・編集モーダル */}
      {showForm && (
        <PropertyForm
          property={editingProperty}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  )
}
