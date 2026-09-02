import { prisma } from './_lib/prisma.js'

// 匿名ユーザーのプロフィール（イレギュラーケース5：試験区分・フェーズの初回選択）
export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { userId } = req.query
    if (!userId) return res.status(400).json({ error: 'userId is required' })

    const user = await prisma.user.findUnique({ where: { id: userId } })
    return res.status(200).json({ user })
  }

  if (req.method === 'POST') {
    const { userId, examType, phase } = req.body ?? {}
    if (!userId) return res.status(400).json({ error: 'userId is required' })

    const user = await prisma.user.upsert({
      where: { id: userId },
      update: {
        ...(examType !== undefined ? { examType } : {}),
        ...(phase !== undefined ? { phase } : {}),
        lastVisitAt: new Date(),
      },
      create: {
        id: userId,
        examType: examType ?? null,
        phase: phase ?? null,
      },
    })
    return res.status(200).json({ user })
  }

  res.setHeader('Allow', 'GET, POST')
  return res.status(405).json({ error: 'Method not allowed' })
}
