import { verifySignature } from './github/signature.ts'
import { GithubStarEvent } from './github/types.ts'

// TODO what needs to be don
// - create a cloudflare function handler
//    - denoflare init, resolve some issues with the version incompatibilities
//    - define .denoflare file, use environment variables from .env file
//    - denoflare push
//    - https://gh-starboy.jozef-cipa.workers.dev/

// - connect github webhook & verify HMAC
//    - https://docs.github.com/en/webhooks/using-webhooks/creating-webhooks
//    - verify HMAC

// - connect telegram sdk

// Notes:
// denoflare setup troubleshooting: https://github.com/skymethod/denoflare/issues/77#issuecomment-2558179923

interface Env {
  GH_WEBHOOK_SECRET?: string
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (!env.GH_WEBHOOK_SECRET) {
      console.error('Environment variable GH_WEBHOOK_SECRET not set')
      return new Response(
        JSON.stringify({ error: 'Internal error' }),
        { status: 500 },
      )
    }

    // only allow POST requests
    if (request.method !== 'POST') {
      console.error('Invalid request method', request.headers)
      return new Response(
        JSON.stringify({ error: 'Invalid request method' }),
        { status: 405 },
      )
    }

    // get data from the request
    const githubData = await request.json() as GithubStarEvent
    const signature = request.headers.get('x-hub-signature-256')
    if (!signature) {
      console.error('Unauthenticated request', request.headers)
      return new Response(
        JSON.stringify({ error: 'Unauthenticated request.' }),
        { status: 401 },
      )
    }

    // validate Github request signature
    if (!await verifySignature(env.GH_WEBHOOK_SECRET, signature, githubData)) {
      console.error('Github signature mismatch', request.headers)
      return new Response(
        JSON.stringify({ error: 'Unauthorized request.' }),
        { status: 403 },
      )
    }

    if (githubData.action === 'created') {
      // send a telegram message

      console.log(`Yay, a new star added to ${githubData.repository.full_name}`)
    } else if (githubData.action === 'deleted') {
      // Sad ... 😢
    }

    return new Response(null, { status: 204 })
  },
}
