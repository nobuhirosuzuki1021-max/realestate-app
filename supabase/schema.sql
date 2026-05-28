-- ============================================================
-- 不動産管理アプリ: propertiesテーブル定義
-- Supabaseダッシュボードの「SQL Editor」にこのSQLを貼り付けて実行する
-- ============================================================

-- propertiesテーブルの作成
CREATE TABLE IF NOT EXISTS properties (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT        NOT NULL,
  rent        INTEGER     NOT NULL CHECK (rent >= 0),
  area        TEXT        NOT NULL,
  rooms       TEXT        NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Row Level Security (RLS) の設定
-- 「自分が登録した物件のみ操作可能」にするため有効化する
-- ============================================================

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- SELECT: 自分が登録した物件のみ取得可能
CREATE POLICY "自分の物件のみ取得可能"
  ON properties
  FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: 自分のuser_idでのみ登録可能
CREATE POLICY "自分の物件のみ登録可能"
  ON properties
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: 自分が登録した物件のみ更新可能
CREATE POLICY "自分の物件のみ更新可能"
  ON properties
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: 自分が登録した物件のみ削除可能
CREATE POLICY "自分の物件のみ削除可能"
  ON properties
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- 動作確認用サンプルデータ（任意）
-- 実行前にauth.usersにユーザーが存在している必要がある
-- ============================================================

-- INSERT INTO properties (user_id, name, rent, area, rooms) VALUES
--   (auth.uid(), 'グランドメゾン渋谷', 120000, '渋谷区', '1LDK'),
--   (auth.uid(), 'パークハイツ新宿',   85000,  '新宿区', '1K');
