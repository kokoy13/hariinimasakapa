export async function postJson(path, body) {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const msg = data?.error || 'Terjadi kesalahan. Coba lagi ya.'
    const err = new Error(msg)
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

export async function getJson(path) {
  const res = await fetch(path)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const msg = data?.error || 'Terjadi kesalahan. Coba lagi ya.'
    const err = new Error(msg)
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

