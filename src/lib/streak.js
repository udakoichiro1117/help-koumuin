const DAYS_TO_SHOW = 14

function toDateKey(date) {
  return date.toISOString().slice(0, 10)
}

// v3.0：勉強ログをカレンダー上の「日」ごとに集計する。
// ログが無い日も必ず1本のバー分の枠を用意するので、
// ログインしなかった日数分だけ自然と間が空く（新イレギュラーケース対応）
export function buildDailySeries(logs, daysToShow = DAYS_TO_SHOW) {
  const counts = new Map()
  for (const log of logs) {
    const key = toDateKey(new Date(log.studyDate))
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }

  const days = []
  const today = new Date()
  for (let i = daysToShow - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = toDateKey(d)
    days.push({ key, count: counts.get(key) ?? 0 })
  }
  return days
}

// 直近から連続で記録がある日数。間が空いた時点でそこで打ち切る
export function currentStreak(days) {
  let streak = 0
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].count > 0) streak++
    else break
  }
  return streak
}

// v3.0：2日以上、3日以上、、と積み上げの節目を伝えるためのメッセージ
const STREAK_MILESTONES = [
  { days: 7, label: '1週間以上、積み上げが続いています🔥🔥' },
  { days: 3, label: '3日以上の積み上げ、確実に力になっています🔥' },
  { days: 2, label: '2日以上の積み上げ、続いてきました🔥' },
]

export function streakMessage(streak) {
  if (streak <= 0) return '今日から積み上げを始めましょう'
  const hit = STREAK_MILESTONES.find((m) => streak >= m.days)
  return hit ? hit.label : `${streak}日連続で積み上げ中🔥`
}
