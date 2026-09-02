import { prisma } from './_lib/prisma.js'

const MOODS = ['不安', '焦り', '普通', '前向き']

// ②最初の画面の気分チェックイン
export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { userId } = req.query
    if (!userId) return res.status(400).json({ error: 'userId is required' })

    const latest = await prisma.checkIn.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
    return res.status(200).json({ checkIn: latest })
  }

  if (req.method === 'POST') {
    const { userId, mood } = req.body ?? {}
    if (!userId || !MOODS.includes(mood)) {
      return res.status(400).json({ error: 'userId and a valid mood are required' })
    }

    await prisma.user.upsert({
      where: { id: userId },
      update: { lastVisitAt: new Date() },
      create: { id: userId },
    })

    const checkIn = await prisma.checkIn.create({ data: { userId, mood } })
    return res.status(200).json({ checkIn })
  }

  res.setHeader('Allow', 'GET, POST')
  return res.status(405).json({ error: 'Method not allowed' })
}
