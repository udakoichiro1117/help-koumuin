import { buildDailySeries, currentStreak, streakMessage } from '../lib/streak'

// ④積み上げ記録をグラフで「確実に進んでいる」ことを視覚化する
// v3.0：ログインしなかった日は0件のまま1本の枠として並ぶので、
// 棒グラフが横に連続せず、間が空いた分だけ自然と空くようになっている
export default function ProgressGraph({ logs }) {
  const days = buildDailySeries(logs)
  const max = Math.max(1, ...days.map((d) => d.count))
  const streak = currentStreak(days)

  return (
    <div className="progress-graph">
      <p className="streak-line">{streakMessage(streak)}</p>
      <div className="bar-chart" role="img" aria-label="直近14日間の勉強記録の積み上げグラフ">
        {days.map((d) => (
          <div key={d.key} className="bar-column">
            <div
              className={`bar ${d.count > 0 ? 'bar-active' : ''}`}
              style={{ height: `${(d.count / max) * 100}%` }}
              title={`${d.key}：${d.count > 0 ? '記録あり' : '記録なし'}`}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
