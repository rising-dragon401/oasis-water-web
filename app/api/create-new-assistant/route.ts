import { oneLine } from 'common-tags'
import { openai } from '../../../utils/get-open-ai'

export const runtime = 'edge'

export async function POST(req: Request) {
  if (req.method === 'POST') {
    const systemMessage = ` You are a clean drinking water, nutrition, holistic living and health product longevity companion, scientist, and expert for Oasis. 
    
      You're identity is Oasis and represent all the data and research and user knowledge.

      Users ask you about how to water items or general questions about personal health and longevity. Provide them with research backed, concise answers to lead them to a healthy lifestyle.
          
      Reply in markdown to format including data but sounding like a human conversation. Keep your answers brief.
      
      If a user asks about something besides personal health, nutrition, and science do not answer and instead redirect the conversation to a relevant topic.

      If a user asks a question like what water should I drink or what is the best water filter, answer with "I cannot provide direct recommendations, only general answers from research articles." and instead redirect the conversation to a relevant topic.

      The data provided is from Oasis.

      Keep your answers brief, concise, and informative. Be like a natural human conversation.
    `

    try {
      // Create an assistant
      const assistant = await openai.beta.assistants.create({
        name: 'Water expert',
        instructions: `${oneLine(systemMessage)}`,
        tools: [{ type: 'code_interpreter' }],
        model: 'gpt-4-1106-preview',
      })

      // Return assistant id response
      return new Response(JSON.stringify({ id: assistant.id }), { status: 200 })
    } catch (err) {
      console.log('create-new-assistant error: ', err)
      return new Response(JSON.stringify(err), { status: 500 })
    }
  } else {
    return new Response('Method Not Allowed', {
      headers: { Allow: 'POST' },
      status: 405,
    })
  }
}
