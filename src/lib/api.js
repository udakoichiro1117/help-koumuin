async function request(path, options) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${path}`)
  }
  return res.json()
}

export function getUser(userId) {
  return request(`/api/user?userId=${encodeURIComponent(userId)}`)
}

export function saveUser(userId, profile) {
  return request('/api/user', {
    method: 'POST',
    body: JSON.stringify({ userId, ...profile }),
  })
}

export function postCheckIn(userId, mood) {
  return request('/api/checkin', {
    method: 'POST',
    body: JSON.stringify({ userId, mood }),
  })
}

export function getLatestCheckIn(userId) {
  return request(`/api/checkin?userId=${encodeURIComponent(userId)}`)
}

export function getDraftAnxiety(userId) {
  return request(`/api/anxiety?userId=${encodeURIComponent(userId)}&draft=1`)
}

export function saveAnxiety(userId, { text, quickTag, finalize }) {
  return request('/api/anxiety', {
    method: 'POST',
    body: JSON.stringify({ userId, text, quickTag, finalize }),
  })
}

export function getStudyLogs(userId) {
  return request(`/api/studylog?userId=${encodeURIComponent(userId)}`)
}

export function postStudyLog(userId, content, minutes) {
  return request('/api/studylog', {
    method: 'POST',
    body: JSON.stringify({ userId, content, minutes }),
  })
}
