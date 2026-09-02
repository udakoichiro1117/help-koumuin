import { useState } from 'react'

const NOTIFY_KEY = 'chiba-app-notify-enabled'

// ⑤次の行動/出口：前向きな気持ちのまま閉じてもらい、翌日の再訪を促す
export default function ExitScreen({ mood, onRestart }) {
  const [notifyEnabled, setNotifyEnabled] = useState(() => localStorage.getItem(NOTIFY_KEY) === '1')
  const [notifyMessage, setNotifyMessage] = useState(null)

  const isNightMood = mood === '不安' || mood === '焦り'

  async function handleEnableNotify() {
    if (!('Notification' in window)) {
      setNotifyMessage('この端末では通知を利用できません。')
      return
    }
    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      localStorage.setItem(NOTIFY_KEY, '1')
      setNotifyEnabled(true)
      setNotifyMessage('明日の同じ時間帯に「今日の一歩を記録しよう」とお知らせします。')
    } else {
      setNotifyMessage('通知が許可されませんでした。設定からいつでも変更できます。')
    }
  }

  return (
    <div className="screen exit-screen">
      <h1>{isNightMood ? '今日はここまでにして、安心して眠ってくださいね' : '前向きな気持ちのまま、勉強に戻りましょう'}</h1>
      <p className="lead">明日もまた、ここに今日の一歩を記録しにきてください。</p>

      {!notifyEnabled ? (
        <button type="button" className="btn btn-secondary" onClick={handleEnableNotify}>
          明日も通知でお知らせする
        </button>
      ) : (
        <p className="banner">通知はオンになっています</p>
      )}
      {notifyMessage && <p className="hint-message">{notifyMessage}</p>}

      <button type="button" className="btn btn-primary" onClick={onRestart}>
        今日はここまでにする
      </button>
    </div>
  )
}
