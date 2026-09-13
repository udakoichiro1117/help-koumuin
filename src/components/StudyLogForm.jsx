import { useState } from 'react'

// ③その日の勉強内容と勉強時間を記録する（「積み上げ」の可視化・結果バリエーションのため）
export default function StudyLogForm({ onSubmit, onSkip }) {
  const [content, setContent] = useState('')
  const [minutesInput, setMinutesInput] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit() {
    const trimmedContent = content.trim()
    const minutes = minutesInput.trim() === '' ? null : Number(minutesInput)

    if (!trimmedContent && minutes === null) {
      onSkip(null)
      return
    }

    setSaving(true)
    try {
      await onSubmit({ content: trimmedContent, minutes })
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

      <div className="field-group">
        <label className="field-label" htmlFor="study-minutes">
          今日は何分くらい勉強しましたか？
        </label>
        <input
          id="study-minutes"
          className="studylog-minutes-input"
          type="number"
          inputMode="numeric"
          min="0"
          step="1"
          value={minutesInput}
          onChange={(e) => setMinutesInput(e.target.value)}
          placeholder="例：90"
        />
      </div>

      <div className="button-row">
        <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
          {saving ? '記録中…' : '記録する'}
        </button>
        <button type="button" className="btn btn-text" onClick={() => onSkip(null)} disabled={saving}>
          スキップ
        </button>
      </div>
    </div>
  )
}
