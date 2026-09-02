import { useState } from 'react'

// ③その日の勉強内容を記録する（「積み上げ」の可視化のため）
export default function StudyLogForm({ onSubmit, onSkip }) {
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit() {
    if (!content.trim()) {
      onSkip()
      return
    }
    setSaving(true)
    try {
      await onSubmit(content.trim())
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="screen studylog-screen">
      <h1>今日はどんな勉強をしましたか？</h1>
      <p className="lead">積み上げを記録しましょう（任意）</p>
      <textarea
        className="studylog-textarea"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        placeholder="例：数的処理を10問、憲法の判例を復習"
      />
      <div className="button-row">
        <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
          {saving ? '記録中…' : '記録する'}
        </button>
        <button type="button" className="btn btn-text" onClick={onSkip} disabled={saving}>
          スキップ
        </button>
      </div>
    </div>
  )
}
