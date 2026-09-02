import { useEffect, useRef, useState } from 'react'
import { QUICK_TAGS } from '../data/content'
import { looksLikeGibberish, summarizeToLimit, MAX_RECOMMENDED_LENGTH } from '../lib/textCheck'
import { saveAnxiety } from '../lib/api'

// ③今日の不安を一言入力する画面
// イレギュラーケース1（空っぽ）・2（過剰）・3（悪意）・4（中断=自動下書き保存）をここで扱う
export default function AnxietyInput({ userId, initialText, onSubmitted }) {
  const [text, setText] = useState(initialText ?? '')
  const [quickTag, setQuickTag] = useState(null)
  const [showEmptyOptions, setShowEmptyOptions] = useState(false)
  const [rejectedMessage, setRejectedMessage] = useState(null)
  const [suggestedSummary, setSuggestedSummary] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const debounceRef = useRef(null)

  // イレギュラーケース4：入力の自動下書き保存
  useEffect(() => {
    if (!text.trim()) return undefined
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      saveAnxiety(userId, { text, quickTag, finalize: false }).catch(() => {})
    }, 800)
    return () => clearTimeout(debounceRef.current)
  }, [text, quickTag, userId])

  const overLimit = text.length > MAX_RECOMMENDED_LENGTH

  function handleChange(e) {
    setRejectedMessage(null)
    setSuggestedSummary(null)
    setShowEmptyOptions(false)
    setText(e.target.value)
  }

  function pickQuickTag(tag) {
    setQuickTag(tag)
    setShowEmptyOptions(false)
  }

  async function submitFinal(finalText, tag) {
    setSubmitting(true)
    setRejectedMessage(null)
    try {
      const result = await saveAnxiety(userId, { text: finalText, quickTag: tag, finalize: true })
      if (result.rejected) {
        // イレギュラーケース3：責めずに再入力を促す
        setRejectedMessage('うまく読み取れませんでした。もう一度、言葉にしてみてください。')
        return
      }
      onSubmitted({ text: finalText, quickTag: tag })
    } finally {
      setSubmitting(false)
    }
  }

  function handleSubmitClick() {
    const trimmed = text.trim()

    // イレギュラーケース1：空っぽのまま次に進もうとした
    if (!trimmed && !quickTag) {
      setShowEmptyOptions(true)
      return
    }

    if (!trimmed && quickTag) {
      submitFinal('', quickTag)
      return
    }

    // イレギュラーケース2：想定の10倍などの過剰入力
    if (trimmed.length > MAX_RECOMMENDED_LENGTH && !suggestedSummary) {
      setSuggestedSummary(summarizeToLimit(trimmed))
      return
    }

    if (looksLikeGibberish(trimmed)) {
      setRejectedMessage('うまく読み取れませんでした。もう一度、言葉にしてみてください。')
    }

    submitFinal(trimmed, null)
  }

  return (
    <div className="screen input-screen">
      <h1>今日の不安を一言、教えてください</h1>
      <p className="lead">例：「面接で言葉に詰まりそう」</p>

      <textarea
        className={`anxiety-textarea ${overLimit ? 'over-limit' : ''}`}
        value={text}
        onChange={handleChange}
        rows={5}
        placeholder="今、感じていることを書いてみましょう"
      />
      <p className={`char-counter ${overLimit ? 'char-counter-warn' : ''}`}>
        {text.length}/{MAX_RECOMMENDED_LENGTH}
      </p>

      {overLimit && !suggestedSummary && (
        <p className="hint-message">
          たくさん書きたくなるほど、色々抱えているんですね。まずは一番伝えたい一言だけ選んでみましょうか。
        </p>
      )}

      {suggestedSummary && (
        <div className="confirm-box">
          <p>これでいい？</p>
          <p className="summary-preview">「{suggestedSummary}」</p>
          <div className="button-row">
            <button type="button" className="btn btn-primary" onClick={() => submitFinal(suggestedSummary, null)}>
              これでいい
            </button>
            <button type="button" className="btn btn-text" onClick={() => setSuggestedSummary(null)}>
              自分で編集する
            </button>
          </div>
        </div>
      )}

      {rejectedMessage && <p className="error-message">{rejectedMessage}</p>}

      {showEmptyOptions && (
        <div className="quick-tag-box">
          <p>今はうまく言葉にできない。それも一つの状態です。</p>
          <div className="chip-list">
            {QUICK_TAGS.map((t) => (
              <button key={t.id} type="button" className="chip" onClick={() => pickQuickTag(t.id)}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {quickTag && (
        <p className="banner">
          選択中：{QUICK_TAGS.find((t) => t.id === quickTag)?.label}
          <button type="button" className="btn-text btn-inline" onClick={() => setQuickTag(null)}>
            取り消す
          </button>
        </p>
      )}

      {!suggestedSummary && (
        <button type="button" className="btn btn-primary" onClick={handleSubmitClick} disabled={submitting}>
          {submitting ? '送信中…' : '次へ'}
        </button>
      )}
    </div>
  )
}
