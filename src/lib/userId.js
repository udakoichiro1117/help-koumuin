const STORAGE_KEY = 'chiba-app-user-id'

// ログイン機能は持たないため、端末ごとに匿名IDを発行してlocalStorageに保持する
export function getOrCreateUserId() {
  let id = localStorage.getItem(STORAGE_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(STORAGE_KEY, id)
  }
  return id
}
