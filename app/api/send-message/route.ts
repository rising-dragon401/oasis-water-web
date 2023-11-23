import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { codeBlock, oneLine } from 'common-tags'
import GPT3Tokenizer from 'gpt3-tokenizer'
import { OpenAIStream, StreamingTextResponse, LangChainStream } from 'ai'
import { ApplicationError, UserError } from '@/lib/errors'
import { getModel } from '@/app/api/utils/model'
import OpenAI from 'openai'
import { LLMChain } from 'langchain/chains'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    if (!supabaseUrl) {
      throw new ApplicationError('Missing environment variable SUPABASE_URL')
    }

    if (!supabaseServiceKey) {
      throw new ApplicationError('Missing environment variable SUPABASE_SERVICE_ROLE_KEY')
    }

    const { query, assistant_id, thread_id } = await req.json()

    const systemMessage = `
      You are a clean drinking and water assistant. 
    
      Prioritze the data from context sections to informat youre answer. Do not suggest looking for information elsewhere.

      Provide concise short answers. Only refer to the data.

      If you just get sent a location or brand of bottled water, respond with stats about that location's water quality or brand of bottled water quality. Respond with Oaisys score, water source, owner/manufacturer, ph level, flouride level, treatment process and chemicals used, and the brief breakdown of the ingredients and the benefits and harms of each one. Include all the chemicals/substances detected in the Full Testing Report with amounts over 0.0 or not ND. If missing any of these, just ignore it. Return the Oaisys Page url and hyperlink it at the bottom of your reply. Reply in markdown to format each section and data point to make it human readable but not a code snippet.
      
      If the user doesn't send a water brand or location simply answer the message to the best of your ability.

      If you don't have data about a question say "We don't have data about that yet" then suggest to help the user with something else.
      
      If someone asks a question that is not about water, respond with "I'm sorry, I can only answer questions about clean water."
      `

    const fullQuery = oneLine`
      Main query: ${query}.

      Find the ${query} ingredients, benefits, and harms of each ingredient in the water, and ${query} Full Testing Report:. Use this information for my main query if it's relevant.
    `

    if (!query) {
      throw new UserError('Missing query in request data')
    }

    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey)

    // Moderate the content to comply with OpenAI T&C
    const sanitizedQuery = fullQuery.trim()

    const moderation = await openai.moderations.create({ input: sanitizedQuery })

    const [results] = moderation.results

    if (results.flagged) {
      throw new UserError('Flagged content', {
        flagged: true,
        categories: results.categories,
      })
    }

    // Create embedding from query
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: sanitizedQuery.replaceAll('\n', ' '),
      // encoding_format: 'float',
    })

    const [{ embedding }] = embeddingResponse.data

    const { error: matchError, data: pageSections } = await supabaseClient.rpc(
      'match_page_sections',
      {
        embedding,
        match_threshold: 0.8,
        match_count: 8,
        min_content_length: 50,
      }
    )

    // console.log(`Match error: }`, matchError)
    // console.log(`Page sections: ${JSON.stringify(pageSections)}`)

    if (matchError) {
      throw new ApplicationError('Failed to match page sections', matchError)
    }

    const tokenizer = new GPT3Tokenizer({ type: 'gpt3' })
    let tokenCount = 0
    let contextText = ''
    const maxTokenCount = 20000

    for (let i = 0; i < pageSections.length; i++) {
      const pageSection = pageSections[i]
      const content = pageSection.content
      const encoded = tokenizer.encode(content)
      tokenCount += encoded.text.length

      if (tokenCount + encoded.text.length > maxTokenCount) {
        // If adding the entire content would exceed the limit, add a portion of it
        const remainingSpace = maxTokenCount - tokenCount
        const partialContent = content.slice(0, remainingSpace)
        contextText += `${partialContent.trim()}\n---\n`
        break
      } else {
        // If adding the entire content would not exceed the limit, add it all
        tokenCount += encoded.text.length
        contextText += `${content.trim()}\n---\n`
      }
    }

    console.log(`Context text: `, contextText)

    const prompt = codeBlock`
      Context sections:
      ${contextText}

       Question: """
      ${sanitizedQuery}
      """
    `

    /////// Legacy - Langchain    ///////
    // Make query

    const response = await openai.chat.completions.create({
      model: 'gpt-4-1106-preview',
      stream: true,
      messages: [
        {
          role: 'system',
          content: systemMessage,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    })
    const stream = OpenAIStream(response)

    // Respond with the stream
    return new StreamingTextResponse(stream)

    /////// Assistants API - commenting out until stremaing is supported   ///////
    // let threadId = thread_id
    // // Create a thread
    // if (!thread_id) {
    //   const thread = await openai.beta.threads.create()
    //   threadId = thread.id
    // }

    // // adds message to thread
    // const message = await openai.beta.threads.messages.create(threadId, {
    //   role: 'user',
    //   content: prompt,
    // })

    // // runs assistant thread
    // let run = await openai.beta.threads.runs.create(threadId, {
    //   assistant_id: assistant_id,
    //   // instructions: "Please address the user as Jane Doe. The user has a premium account."
    // })

    // // create a timeout loop that checks if run.status === completed
    // while (run.status !== 'completed') {
    //   await new Promise((resolve) => setTimeout(resolve, 1000)) // wait for 1 second before checking again
    //   run = await openai.beta.threads.runs.retrieve(threadId, run.id) // update the run status
    // }

    // // once completed, get updated messages
    // const messages = await openai.beta.threads.messages.list(threadId)

    // const chatReply = messages.data[messages.data.length - 1]

    // // @ts-ignore
    // const chatReplyText = messages.data[0].content[0].text.value

    // return new Response(
    //   JSON.stringify({
    //     content: chatReplyText,
    //     thread_id: threadId,
    //   }),
    //   {
    //     status: 200,
    //     headers: { 'Content-Type': 'application/json' },
    //   }
    // )
  } catch (err) {
    if (err instanceof UserError) {
      return new Response(
        JSON.stringify({
          error: err.message,
          data: err.data,
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    } else if (err instanceof ApplicationError) {
      // Print out application errors with their additional data
      console.error(`${err.message}: ${JSON.stringify(err.data)}`)
    } else {
      // Print out unexpected errors as is to help with debugging
      console.error(err)
    }

    // TODO: include more response info in debug environments
    return new Response(
      JSON.stringify({
        error: 'There was an error processing your request',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
