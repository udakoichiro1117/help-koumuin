import { useState } from 'react'

// ⑤友人に自分の積み上げをシェアできる導線
export default function ShareButton({ streakText }) {
  const [copied, setCopied] = useState(false)
  const shareText = `${streakText}\n公務員試験に向けて積み上げ中です📚`

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText })
      } catch {
        // ユーザーがキャンセルした場合は何もしない
      }
      return
    }

    try {
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // クリップボードが使えない環境では何もしない
    }
  }

  return (
    <button type="button" className="btn btn-secondary" onClick={handleShare}>
      {copied ? 'コピーしました' : '積み上げをシェアする'}
    </button>
  )
}
