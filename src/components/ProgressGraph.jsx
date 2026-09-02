const DAYS_TO_SHOW = 14

function toDateKey(date) {
  return date.toISOString().slice(0, 10)
}

function buildSeries(logs) {
  const counts = new Map()
  for (const log of logs) {
    const key = toDateKey(new Date(log.studyDate))
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }

  const days = []
  const today = new Date()
  for (let i = DAYS_TO_SHOW - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = toDateKey(d)
    days.push({ key, count: counts.get(key) ?? 0 })
  }
  return days
}

function currentStreak(days) {
  let streak = 0
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].count > 0) streak++
    else break
  }
  return streak
}

// ④積み上げ記録をグラフで「確実に進んでいる」ことを視覚化する
export default function ProgressGraph({ logs }) {
  const days = buildSeries(logs)
  const max = Math.max(1, ...days.map((d) => d.count))
  const streak = currentStreak(days)

  return (
    <div className="progress-graph">
      <p className="streak-line">
        {streak > 0 ? `${streak}日連続で積み上げ中🔥` : '今日から積み上げを始めましょう'}
      </p>
      <div className="bar-chart" role="img" aria-label="直近の勉強記録の積み上げグラフ">
        {days.map((d) => (
          <div key={d.key} className="bar-column">
            <div
              className={`bar ${d.count > 0 ? 'bar-active' : ''}`}
              style={{ height: `${(d.count / max) * 100}%` }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
