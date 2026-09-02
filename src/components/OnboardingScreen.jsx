import { useState } from 'react'
import { EXAM_TYPES, PHASES } from '../data/content'

// イレギュラーケース5：初回起動時に試験区分・フェーズを選ばせる
// 選ばなくても onSkip でそのまま進める（＝以降は汎用フォールバックのメッセージになる）
export default function OnboardingScreen({ onComplete, onSkip }) {
  const [examType, setExamType] = useState(null)
  const [phase, setPhase] = useState(null)

  return (
    <div className="screen onboarding-screen">
      <h1>はじめまして</h1>
      <p className="lead">あなたに合わせたメッセージを届けるために、少しだけ教えてください。</p>

      <div className="field-group">
        <p className="field-label">目指している試験区分</p>
        <div className="chip-list">
          {EXAM_TYPES.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`chip ${examType === t.id ? 'chip-selected' : ''}`}
              onClick={() => setExamType(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="field-group">
        <p className="field-label">現在のフェーズ</p>
        <div className="chip-list">
          {PHASES.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`chip ${phase === p.id ? 'chip-selected' : ''}`}
              onClick={() => setPhase(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="button-row">
        <button type="button" className="btn btn-primary" onClick={() => onComplete({ examType, phase })}>
          はじめる
        </button>
        <button type="button" className="btn btn-text" onClick={onSkip}>
          あとで設定する
        </button>
      </div>
    </div>
  )
}
