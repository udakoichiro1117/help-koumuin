import { prisma } from './_lib/prisma.js'

// ③その日の勉強内容の記録 → ④「積み上げ」の可視化に使う
export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { userId } = req.query
    if (!userId) return res.status(400).json({ error: 'userId is required' })

    const logs = await prisma.studyLog.findMany({
      where: { userId },
      orderBy: { studyDate: 'asc' },
      take: 90,
    })
    return res.status(200).json({ logs })
  }

  if (req.method === 'POST') {
    const { userId, content } = req.body ?? {}
    if (!userId || !content || !String(content).trim()) {
      return res.status(400).json({ error: 'userId and content are required' })
    }

    const log = await prisma.studyLog.create({
      data: { userId, content: String(content).trim().slice(0, 200) },
    })
    return res.status(200).json({ log })
  }

  res.setHeader('Allow', 'GET, POST')
  return res.status(405).json({ error: 'Method not allowed' })
}
