import { MOODS } from '../data/content'

// ②最初の画面：努力を肯定する一言＋簡易チェックイン
// イレギュラーケース4：中断していた場合は「昨日はここまで頑張れましたね」を表示
export default function WelcomeScreen({ headline, resumedMessage, onSelectMood }) {
  return (
    <div className="screen welcome-screen">
      {resumedMessage && <p className="banner">{resumedMessage}</p>}
      <h1>{headline}</h1>
      <p className="lead">今の気分を教えてください</p>
      <div className="mood-list">
        {MOODS.map((m) => (
          <button key={m.id} type="button" className="mood-button" onClick={() => onSelectMood(m.id)}>
            <span className="mood-emoji" aria-hidden="true">
              {m.emoji}
            </span>
            <span>{m.id}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
