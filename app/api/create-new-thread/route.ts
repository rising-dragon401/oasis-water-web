import { openai } from '../utils/openai'

export const runtime = 'edge'

export async function POST(req: Request) {
  if (req.method === 'POST') {
    try {
      const thread = await openai.beta.threads.create({})

      return new Response(JSON.stringify(thread), { status: 200 })
    } catch (error) {
      console.error('Failed to create thread', error)
      return new Response(JSON.stringify(error), { status: 500 })
    }
  } else {
    return new Response('Method Not Allowed', {
      headers: { Allow: 'POST' },
      status: 405,
    })
  }
}
