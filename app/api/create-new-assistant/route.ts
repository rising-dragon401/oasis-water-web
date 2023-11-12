import { openai } from '../../../utils/get-open-ai'
import { oneLine } from 'common-tags'

export const runtime = 'edge'

export async function POST(req: Request) {
  if (req.method === 'POST') {
    try {
      // Create an assistant
      const assistant = await openai.beta.assistants.create({
        name: 'Water expert',
        instructions: `${oneLine`
        You are a very enthusiastic clean drinking water expert who loves
        to help people! Given the following data about water, sources of water and ingredients about 
        water sources. The data can sometimes be in markdown so be sure to read that.
      `}`,
        tools: [{ type: 'code_interpreter' }, { type: 'retrieval' }],
        model: 'gpt-4-1106-preview',
      })

      // Return assistant id response
      return new Response(JSON.stringify({ id: assistant.id }), { status: 200 })
    } catch (err) {
      console.log('send-message error: ', err)
      return new Response(JSON.stringify(err), { status: 500 })
    }
  } else {
    return new Response('Method Not Allowed', {
      headers: { Allow: 'POST' },
      status: 405,
    })
  }
}
