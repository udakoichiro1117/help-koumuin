import ProgressGraph from './ProgressGraph'
import ShareButton from './ShareButton'

// ④結果の表示：前向きな一言＋合格実績＋積み上げグラフ
export default function ResultScreen({ response, logs, onNext }) {
  const streak = logs.filter((l) => l.studyDate).length
  const streakText = `積み上げ ${streak}件`

  return (
    <div className="screen result-screen">
      <h1>{response.positiveLine}</h1>

      <div className="stat-card">
        <p className="stat-number">{response.successRate}%</p>
        <p className="stat-caption">同じ不安を抱えていた人が合格しています</p>
      </div>

      <blockquote className="senior-comment">{response.seniorComment}</blockquote>

      {response.qa.length > 0 && (
        <div className="qa-list">
          {response.qa.map((item) => (
            <div key={item.q} className="qa-card">
              <p className="qa-question">Q. {item.q}</p>
              <p className="qa-answer">{item.a}</p>
            </div>
          ))}
        </div>
      )}

      <ProgressGraph logs={logs} />
      <ShareButton streakText={streakText} />

      <button type="button" className="btn btn-primary" onClick={onNext}>
        次へ
      </button>
    </div>
  )
}
