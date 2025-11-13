export async function GET(req: Request) {
  // Extract `url` query param
  const urlParam = new URL(req.url).searchParams.get('url')
  if (!urlParam) {
    return new Response(JSON.stringify({ error: 'Missing url query parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  let target: string
  try {
    target = decodeURIComponent(String(urlParam))
  } catch (err) {
    target = String(urlParam)
  }

  // Basic URL validation
  let parsed: URL
  try {
    parsed = new URL(target)
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Invalid URL' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return new Response(JSON.stringify({ error: 'Invalid URL protocol' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Build whitelist from env or default to static.ulisesv.com
  const envAllowed = process.env.ALLOWED_IMAGE_HOSTS || 'static.ulisesv.com'
  const allowedHosts = envAllowed.split(',').map(h => h.trim()).filter(Boolean)

  if (!allowedHosts.includes(parsed.hostname)) {
    return new Response(JSON.stringify({ error: 'Host not allowed' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Max bytes allowed to proxy
  const maxBytes = Number(process.env.MAX_PROXY_BYTES || 5_242_880) // 5MB default

  try {
    const fetched = await fetch(target)

    if (!fetched.ok) {
      return new Response(JSON.stringify({ error: 'Upstream fetch failed' }), {
        status: fetched.status,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const contentType = fetched.headers.get('content-type') || 'application/octet-stream'

    // If upstream sets content-length, use it to quickly reject too-large files
    const upstreamLength = fetched.headers.get('content-length')
    if (upstreamLength && Number(upstreamLength) > maxBytes) {
      return new Response(JSON.stringify({ error: 'Upstream resource too large' }), {
        status: 413,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const arrayBuffer = await fetched.arrayBuffer()
    const byteLength = arrayBuffer.byteLength
    if (byteLength > maxBytes) {
      return new Response(JSON.stringify({ error: 'Resource too large' }), {
        status: 413,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Build response headers
    const headers = new Headers()
    // Allow browser reads — restrict in production to specific origins when possible
    headers.set('Access-Control-Allow-Origin', '*')
    headers.set('Content-Type', contentType)
    headers.set('Content-Length', String(byteLength))
    headers.set('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=3600')

    return new Response(arrayBuffer, { status: 200, headers })
  } catch (err: any) {
    console.error('image-proxy error:', err)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export function OPTIONS() {
  const headers = new Headers()
  headers.set('Access-Control-Allow-Origin', '*')
  headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS')
  headers.set('Access-Control-Allow-Headers', '*')
  return new Response(null, { status: 204, headers })
}
