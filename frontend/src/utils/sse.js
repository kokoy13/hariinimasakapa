export async function postSse(path, body, handlers) {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    const err = new Error(data?.error || 'Terjadi kesalahan. Coba lagi ya.')
    err.status = res.status
    err.data = data
    throw err
  }

  const reader = res.body?.getReader()
  if (!reader) throw new Error('Streaming tidak didukung di browser ini.')

  const decoder = new TextDecoder()
  let buffer = ''
  let eventName = 'message'
  let dataLines = []

  function flushEvent() {
    if (dataLines.length === 0) return
    const dataStr = dataLines.join('\n')
    let payload = dataStr
    try {
      payload = JSON.parse(dataStr)
    } catch {
      // keep as string
    }
    const fn = handlers?.[eventName]
    if (typeof fn === 'function') fn(payload)
    eventName = 'message'
    dataLines = []
  }

  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })

    let idx
    while ((idx = buffer.indexOf('\n')) !== -1) {
      const line = buffer.slice(0, idx).replace(/\r$/, '')
      buffer = buffer.slice(idx + 1)

      if (line === '') {
        flushEvent()
        continue
      }
      if (line.startsWith('event:')) {
        eventName = line.slice(6).trim() || 'message'
        continue
      }
      if (line.startsWith('data:')) {
        dataLines.push(line.slice(5).trim())
      }
    }
  }

  flushEvent()
}

