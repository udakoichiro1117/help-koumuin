import { useEffect, useState } from 'react'
import { getOrCreateUserId } from './lib/userId'
import { getUser, saveUser, postCheckIn, getDraftAnxiety, getStudyLogs, postStudyLog } from './lib/api'
import { getResponseForText, greetingForMood } from './data/content'
import OnboardingScreen from './components/OnboardingScreen'
import WelcomeScreen from './components/WelcomeScreen'
import AnxietyInput from './components/AnxietyInput'
import StudyLogForm from './components/StudyLogForm'
import ResultScreen from './components/ResultScreen'
import ExitScreen from './components/ExitScreen'

const ONBOARDED_KEY = 'chiba-app-onboarded'

export default function App() {
  const [screen, setScreen] = useState('loading')
  const [userId] = useState(getOrCreateUserId)
  const [resumedMessage, setResumedMessage] = useState(null)
  const [draftText, setDraftText] = useState('')
  const [mood, setMood] = useState('普通')
  const [anxiety, setAnxiety] = useState({ text: '', quickTag: null })
  const [studyLogs, setStudyLogs] = useState([])
  const [studyMinutes, setStudyMinutes] = useState(null)

  useEffect(() => {
    async function bootstrap() {
      try {
        const { user } = await getUser(userId)

        // イレギュラーケース5：初回起動時のみ試験区分・フェーズを尋ねる
        if (!localStorage.getItem(ONBOARDED_KEY) && !user) {
          setScreen('onboarding')
          return
        }

        // イレギュラーケース4：中断していた下書きがあれば「昨日はここまで頑張れましたね」を出す
        const { entry } = await getDraftAnxiety(userId)
        if (entry && (entry.text || entry.quickTag)) {
          setResumedMessage('昨日はここまで頑張れましたね。続きから始めましょう。')
          setDraftText(entry.text ?? '')
        }

        setScreen('welcome')
      } catch {
        setScreen('error')
      }
    }
    bootstrap()
  }, [userId])

  async function handleOnboardingComplete(profile) {
    await saveUser(userId, profile)
    localStorage.setItem(ONBOARDED_KEY, '1')
    setScreen('welcome')
  }

  function handleOnboardingSkip() {
    localStorage.setItem(ONBOARDED_KEY, '1')
    setScreen('welcome')
  }

  async function handleSelectMood(selectedMood) {
    setMood(selectedMood)
    await postCheckIn(userId, selectedMood)
    setScreen('input')
  }

  function handleAnxietySubmitted(result) {
    setAnxiety(result)
    setScreen('studylog')
  }

  async function refreshStudyLogsAndGoToResult(minutes) {
    setStudyMinutes(minutes)
    const { logs } = await getStudyLogs(userId)
    setStudyLogs(logs)
    setScreen('result')
  }

  async function handleStudyLogSubmit({ content, minutes }) {
    if (content) {
      await postStudyLog(userId, content, minutes)
    }
    await refreshStudyLogsAndGoToResult(minutes)
  }

  function handleRestart() {
    setResumedMessage(null)
    setDraftText('')
    setAnxiety({ text: '', quickTag: null })
    setStudyMinutes(null)
    setScreen('welcome')
  }

  if (screen === 'loading') {
    return <div className="screen loading-screen">読み込み中…</div>
  }

  if (screen === 'error') {
    return (
      <div className="screen loading-screen">
        <p>読み込みに失敗しました。通信環境をご確認のうえ、もう一度お試しください。</p>
        <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>
          再読み込み
        </button>
      </div>
    )
  }

  if (screen === 'onboarding') {
    return <OnboardingScreen onComplete={handleOnboardingComplete} onSkip={handleOnboardingSkip} />
  }

  if (screen === 'welcome') {
    return (
      <WelcomeScreen
        headline={greetingForMood(mood)}
        resumedMessage={resumedMessage}
        onSelectMood={handleSelectMood}
      />
    )
  }

  if (screen === 'input') {
    return <AnxietyInput userId={userId} initialText={draftText} onSubmitted={handleAnxietySubmitted} />
  }

  if (screen === 'studylog') {
    return <StudyLogForm onSubmit={handleStudyLogSubmit} onSkip={refreshStudyLogsAndGoToResult} />
  }

  if (screen === 'result') {
    const response = getResponseForText(anxiety.text, anxiety.quickTag, studyMinutes)
    return <ResultScreen response={response} logs={studyLogs} onNext={() => setScreen('exit')} />
  }

  if (screen === 'exit') {
    return <ExitScreen mood={mood} onRestart={handleRestart} />
  }

  return null
}
