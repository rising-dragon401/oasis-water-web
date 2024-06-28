import { openai } from '../utils/openai'

export const runtime = 'edge'

export async function POST(req: Request) {
  if (req.method === 'POST') {
    try {
      const thread = await openai.beta.threads.create({
        messages: [
          {
            role: 'user',
            content: `
              Be as specific as possible.              
              Include markdown button linking to the data sources in a vertical list (without bullets) using this format:

              Button Syntax: [Data Source Name](http://example.com "oasis-button")
            `,
          },
        ],
      })

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