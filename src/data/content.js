// イレギュラーケース5：初回選択肢（試験区分・フェーズ）
export const EXAM_TYPES = [
  { id: 'kokka-ippan', label: '国家一般職' },
  { id: 'kokka-senmon', label: '国家専門職' },
  { id: 'chihou-joukyu', label: '地方上級' },
  { id: 'keisatsu-shobo', label: '警察官・消防官' },
  { id: 'other', label: 'その他・まだ決めていない' },
]

export const PHASES = [
  { id: 'studying', label: '勉強中' },
  { id: 'interview', label: '面接対策中' },
  { id: 'passed', label: '合格後' },
]

// ②最初の画面の気分チェックイン
export const MOODS = [
  { id: '不安', emoji: '😟' },
  { id: '焦り', emoji: '😣' },
  { id: '普通', emoji: '😐' },
  { id: '前向き', emoji: '😊' },
]

// イレギュラーケース1：空っぽ入力時のワンタップ選択肢
export const QUICK_TAGS = [
  { id: 'anxious', label: 'とりあえず不安' },
  { id: 'no-reason', label: 'なんとなく来た' },
  { id: 'no-words', label: '言葉にしたくない' },
]

const CATEGORIES = [
  {
    id: 'interview',
    keywords: ['面接', '質問', '答えられ', 'きょど', '緊張', '言葉に詰ま', '圧迫', '話せ'],
    positiveLine: '「うまく話せるか」を気にしているのは、それだけ本気で向き合っている証拠です。',
    seniorComment:
      '「本番は誰でも頭が真っ白になります。模範解答より、自分の言葉で3秒黙ってから話す練習をしました」（地方上級 合格）',
    successRate: 83,
    qa: [
      { q: '想定していない質問が来たら？', a: '「少し考えさせてください」と一呼吸置いて大丈夫。沈黙より的外れな即答の方が印象は悪くなりません。' },
      { q: '志望動機に自信が持てない', a: '抽象的な理想より、あなた自身の具体的な体験の方が説得力になります。エピソード1つで十分です。' },
    ],
  },
  {
    id: 'study',
    keywords: ['勉強法', '進め方', 'どうすれば', 'やり方', '間に合わ', '範囲', '暗記'],
    positiveLine: '完璧な計画より、今日1ページ進んだことの方が合格に近づいています。',
    seniorComment:
      '「模試の判定がずっとE判定でしたが、毎日の積み上げを記録したら続けられました」（国家一般職 合格）',
    successRate: 78,
    qa: [
      { q: '何から手をつければいい？', a: 'まずは配点の大きい科目の過去問を1年分。全体像を掴むと不安が減ります。' },
      { q: '範囲が終わらなさそう', a: '「全部」ではなく「今週やること」だけに絞ると、進捗が見えて焦りが減ります。' },
    ],
  },
  {
    id: 'time',
    keywords: ['時間', '間に合う', '眠', '寝る前', '夜遅', '深夜'],
    positiveLine: '眠れない夜に机に向かおうとした、その気持ちがもう一歩前進です。',
    seniorComment:
      '「深夜に焦って勉強するより、不安をメモして寝た方が翌日の集中力が上がりました」（警察官 合格）',
    successRate: 80,
    qa: [{ q: '寝る前の不安がつらい', a: '不安を書き出してこのアプリに預けてしまいましょう。頭の中から一旦追い出すだけで眠りやすくなります。' }],
  },
]

export const GENERIC_RESPONSE = {
  id: 'general',
  keywords: [],
  positiveLine: '不安になれるのは、本気で合格したいと思っている証拠です。',
  seniorComment: '「不安が消えたから合格したわけじゃない。不安を抱えたまま勉強を続けた人が合格していました」（合格者一同）',
  successRate: 83,
  qa: [{ q: '今、何をすればいい？', a: '大きな一歩でなくて大丈夫。今日ノートを1行書くだけでも十分な前進です。' }],
}

// イレギュラーケース1：言葉にしたくない、を選んだときだけ専用の受け止め方をする
export const NO_WORDS_RESPONSE = {
  ...GENERIC_RESPONSE,
  positiveLine: '言葉にしたくない気持ちも、そのままで大丈夫。ここに来られたことがもう一歩です。',
}

// v2.0：勉強時間との組み合わせで結果のバリエーションを増やす
// 1日は最大1440分。それを超える／0未満の値は「秒単位で入力してしまった」等の
// 想定外の組み合わせとみなし、新イレギュラーケースとしてフォールバックする
export const STUDY_TIME_MAX_MINUTES = 1440

function studyTier(minutes) {
  if (minutes === null || minutes === undefined) return 'unknown'
  if (!Number.isFinite(minutes) || minutes < 0 || minutes > STUDY_TIME_MAX_MINUTES) return 'out-of-range'
  if (minutes >= 180) return 'intense'
  if (minutes >= 60) return 'solid'
  if (minutes >= 30) return 'light'
  if (minutes > 0) return 'brief'
  return 'none'
}

const TIER_MODIFIERS = {
  intense: {
    successRate: 100,
    effortLine: '3時間以上、机に向かいました。その積み重ねはもう確かな実力になっています。',
  },
  solid: { successRate: null, effortLine: null },
  light: {
    successRate: 50,
    effortLine: '短い時間でも机に向かえたこと、それ自体が一歩です。',
  },
  brief: {
    successRate: 35,
    effortLine: '少しでも手をつけられたのは立派な一歩です。明日はもう少し積み上げてみましょう。',
  },
  none: { successRate: null, effortLine: null },
  unknown: { successRate: null, effortLine: null },
}

function applyStudyTier(base, minutes) {
  const mod = TIER_MODIFIERS[studyTier(minutes)]
  return {
    ...base,
    successRate: mod.successRate ?? base.successRate,
    effortLine: mod.effortLine,
  }
}

// 新イレギュラーケース：勉強時間が組み合わせの範囲外（例：秒単位の値が誤って入力された等）
export const OUT_OF_RANGE_RESPONSE = {
  id: 'out-of-range',
  isOutOfRange: true,
  positiveLine: 'もう少し頑張りましょう',
  seniorComment:
    '勉強時間の値がうまく認識できなかったようです。今日は「分」単位で、無理のない範囲を記録してみてくださいね。',
  successRate: null,
  qa: [],
}

export function getResponseForText(text, quickTag, minutes = null) {
  if (studyTier(minutes) === 'out-of-range') return OUT_OF_RANGE_RESPONSE

  if (quickTag === 'no-words') return applyStudyTier(NO_WORDS_RESPONSE, minutes)
  if (!text) return applyStudyTier(GENERIC_RESPONSE, minutes)
  const hit = CATEGORIES.find((c) => c.keywords.some((k) => text.includes(k)))
  return applyStudyTier(hit ?? GENERIC_RESPONSE, minutes)
}

export function greetingForMood(mood) {
  switch (mood) {
    case '不安':
      return 'その不安、ちゃんとここまで頑張ってきた証拠です。'
    case '焦り':
      return '焦るくらい本気だということ。少しずつ進めば大丈夫。'
    case '前向き':
      return 'その調子です。今日も一歩積み上げましょう。'
    default:
      return '今日も机に向かえたあなたへ。'
  }
}
