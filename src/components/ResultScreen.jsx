import ProgressGraph from './ProgressGraph'
import ShareButton from './ShareButton'
import { buildDailySeries, currentStreak } from '../lib/streak'

// ④結果の表示：前向きな一言＋合格実績＋積み上げグラフ
// v2.0：勉強時間との組み合わせで結果にバリエーションを持たせる。
// 新イレギュラーケース：組み合わせが範囲外のときは合格率を出さず、素直な応援メッセージにする
// v3.0：シェア文言もProgressGraphと同じ「連続日数」を使う（以前はログ件数を誤って表示していた）
export default function ResultScreen({ response, logs, onNext }) {
  const streak = currentStreak(buildDailySeries(logs))
  const streakText = `積み上げ ${streak}日`

  return (
    <div className="screen result-screen">
      <h1>{response.positiveLine}</h1>

      {response.effortLine && <p className="effort-line">{response.effortLine}</p>}

      {response.successRate !== null && response.successRate !== undefined && (
        <div className="stat-card">
          <p className="stat-number">{response.successRate}%</p>
          <p className="stat-caption">同じ不安を抱えていた人が合格しています</p>
        </div>
      )}

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
