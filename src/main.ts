import { verifySignature } from './github/signature.ts'
import { GithubStarEvent } from './github/types.ts'
import { TelegramBot } from './telegram/bot.ts'

interface Env {
  GH_WEBHOOK_SECRET?: string
  TELEGRAM_API_KEY?: string
  TELEGRAM_CHAT_ID?: string
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (
      !env.GH_WEBHOOK_SECRET || !env.TELEGRAM_API_KEY || !env.TELEGRAM_CHAT_ID
    ) {
      console.error('Some of the environment variable are missing', env)
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
      console.log(`Yay, a new star added to ${githubData.repository.full_name}`)

      // send a telegram message
      const telegram = new TelegramBot(env.TELEGRAM_API_KEY)
      const message = `
🤩 New star for ${githubData.repository.full_name}

${githubData.sender.login} just starred your repository, bringing the total to ${githubData.repository.stargazers_count} ⭐
${githubData.repository.html_url}`
      await telegram.sendMessage(env.TELEGRAM_CHAT_ID, message)
    } else if (githubData.action === 'deleted') {
      // Sad ... 😢
      console.log(
        `Oh no, @${githubData.sender.login} removed their star from ${githubData.repository.full_name}`,
      )
    }

    return new Response(null, { status: 204 })
  },
}
