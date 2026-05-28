import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../contexts/AuthContext'

/**
 * 物件の新規登録・編集モーダルフォーム
 * - property が null の場合は新規登録モード
 * - property にデータがある場合は編集モード
 */
export default function PropertyForm({ property, onSuccess, onCancel }) {
  const { session } = useAuth()
  const isEditing = !!property

  // フォームの初期値：編集時は既存データ、新規時は空文字
  const [name, setName] = useState(property?.name ?? '')
  const [rent, setRent] = useState(property?.rent?.toString() ?? '')
  const [area, setArea] = useState(property?.area ?? '')
  const [rooms, setRooms] = useState(property?.rooms ?? '')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const payload = {
      name,
      rent: parseInt(rent, 10),
      area,
      rooms,
    }

    if (isEditing) {
      // 更新: RLSポリシーにより自分の物件のみ更新可能
      const { error } = await supabase
        .from('properties')
        .update(payload)
        .eq('id', property.id)

      if (error) {
        setError('更新に失敗しました: ' + error.message)
      } else {
        onSuccess()
      }
    } else {
      // 新規登録: user_idにログイン中のユーザーIDを設定
      const { error } = await supabase
        .from('properties')
        .insert({ ...payload, user_id: session.user.id })

      if (error) {
        setError('登録に失敗しました: ' + error.message)
      } else {
        onSuccess()
      }
    }

    setLoading(false)
  }

  return (
    // オーバーレイをクリックで閉じる
    <div className="modal-overlay" onClick={onCancel}>
      {/* モーダル本体: クリックイベントの伝播を止める */}
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{isEditing ? '物件を編集' : '物件を新規登録'}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">物件名</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例：グランドメゾン渋谷"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="rent">家賃（円）</label>
            <input
              id="rent"
              type="number"
              value={rent}
              onChange={(e) => setRent(e.target.value)}
              placeholder="例：80000"
              required
              min={0}
            />
          </div>

          <div className="form-group">
            <label htmlFor="area">エリア名</label>
            <input
              id="area"
              type="text"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="例：渋谷区"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="rooms">間取り</label>
            <input
              id="rooms"
              type="text"
              value={rooms}
              onChange={(e) => setRooms(e.target.value)}
              placeholder="例：1LDK"
              required
            />
          </div>

          {error && <p className="message error">{error}</p>}

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn-cancel">
              キャンセル
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? '処理中...' : isEditing ? '更新する' : '登録する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
