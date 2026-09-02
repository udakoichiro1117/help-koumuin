import { prisma } from './_lib/prisma.js'
import { sanitizeAnxietyText } from './_lib/validate.js'

// ③今日の不安の一言入力
// - isDraft=true のレコードは自動保存の下書き（イレギュラーケース4）
// - finalize:true が送られてきたら isDraft=false にして確定する
export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { userId, draft } = req.query
    if (!userId) return res.status(400).json({ error: 'userId is required' })

    if (draft) {
      const entry = await prisma.anxietyEntry.findFirst({
        where: { userId, isDraft: true },
        orderBy: { updatedAt: 'desc' },
      })
      return res.status(200).json({ entry })
    }

    const entries = await prisma.anxietyEntry.findMany({
      where: { userId, isDraft: false },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })
    return res.status(200).json({ entries })
  }

  if (req.method === 'POST') {
    const { userId, text, quickTag, finalize } = req.body ?? {}
    if (!userId) return res.status(400).json({ error: 'userId is required' })

    const { text: cleanText, rejected } = sanitizeAnxietyText(text)

    // イレギュラーケース3：荒らし目的とみなした入力は保存せず静かに弾く
    if (rejected) {
      return res.status(200).json({ rejected: true })
    }

    const existingDraft = await prisma.anxietyEntry.findFirst({
      where: { userId, isDraft: true },
      orderBy: { updatedAt: 'desc' },
    })

    const data = {
      text: cleanText,
      quickTag: quickTag ?? null,
      isDraft: !finalize,
    }

    const entry = existingDraft
      ? await prisma.anxietyEntry.update({ where: { id: existingDraft.id }, data })
      : await prisma.anxietyEntry.create({ data: { userId, ...data } })

    return res.status(200).json({ entry, rejected: false })
  }

  res.setHeader('Allow', 'GET, POST')
  return res.status(405).json({ error: 'Method not allowed' })
}
