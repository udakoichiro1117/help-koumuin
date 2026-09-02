// イレギュラーケース3：入力時点でのゆるいチェック（最終判定はAPI側で行う）
const MEANINGFUL_CHAR = /[\p{L}\p{N}ぁ-んァ-ヶー一-龠、。！？・\s]/gu

export function looksLikeGibberish(text) {
  const trimmed = text.trim()
  if (trimmed.length < 6) return false
  const meaningful = trimmed.match(MEANINGFUL_CHAR) ?? []
  return meaningful.length / trimmed.length < 0.5
}

export const MAX_RECOMMENDED_LENGTH = 200

export function summarizeToLimit(text, limit = MAX_RECOMMENDED_LENGTH) {
  const trimmed = text.trim()
  if (trimmed.length <= limit) return trimmed
  const cut = trimmed.slice(0, limit)
  const lastPunct = Math.max(cut.lastIndexOf('。'), cut.lastIndexOf('、'), cut.lastIndexOf(' '))
  return (lastPunct > limit * 0.5 ? cut.slice(0, lastPunct + 1) : cut).trim() + '…'
}
