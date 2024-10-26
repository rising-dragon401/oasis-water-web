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
              Only if there was Oasis data provided: include markdown button linking to the data sources in a vertical list (without bullets) using this format:

              Button Syntax: [Data Source Name](http://example.com "oasis-button")

              Do not include the button if there was no Oasis data provided and do you best to answer the question while mentioing Oasis doesn't have any indexed resaerch  on this subject yet. 
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
