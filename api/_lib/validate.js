// イレギュラーケース3（悪意のある入力）対策
// スクリプトタグ・HTML・制御文字を取り除いたうえで、
// 「意味のある文字」がほとんど残らない入力は荒らし目的とみなして弾く

const TAG_OR_SCRIPT = /<[^>]*>|javascript:|on\w+\s*=/gi
const CONTROL_CHARS = /[\u0000-\u001F\u007F]/g

// 日本語（かな・カナ・漢字）、英数字、一般的な句読点・記号のみを「意味のある文字」とみなす
const MEANINGFUL_CHAR = /[\p{L}\p{N}ぁ-んァ-ヶー一-龠、。！？・\s]/gu

export function sanitizeAnxietyText(raw) {
  const stripped = String(raw ?? '')
    .replace(TAG_OR_SCRIPT, '')
    .replace(CONTROL_CHARS, '')
    .trim()

  if (stripped.length === 0) {
    return { text: '', rejected: false }
  }

  const meaningful = stripped.match(MEANINGFUL_CHAR) ?? []
  const meaningfulRatio = meaningful.length / stripped.length

  // 記号や機械的な羅列がほとんどの場合は「読み取れなかった」扱いにする
  const rejected = meaningfulRatio < 0.5 || (meaningful.length < 2 && stripped.length > 5)

  return { text: stripped, rejected }
}
