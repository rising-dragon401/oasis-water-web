import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { codeBlock, oneLine } from 'common-tags'
import GPT3Tokenizer from 'gpt3-tokenizer'
// import {
//   Configuration,
//   OpenAIApi,
//   CreateModerationResponse,
//   CreateEmbeddingResponse,
//   ChatCompletionRequestMessage,
// } from 'openai-edge'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { ApplicationError, UserError } from '@/lib/errors'

import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// const config = new Configuration({
//   apiKey: openAiKey,
// })
// const openai = new OpenAIApi(config)

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

    const fullQuery = oneLine`
      query: ${query}.

      What is the  ${query} flouride level, source, ph level, company owner, full breakdown of the  ${query} ingredients and the ${query} Full Testing Report of ${query} water?"
    `

    if (!query) {
      throw new UserError('Missing query in request data')
    }

    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey)

    // Moderate the content to comply with OpenAI T&C
    const sanitizedQuery = fullQuery.trim()

    const moderation = await openai.moderations.create({ input: sanitizedQuery })

    // const moderationResponse: CreateModerationResponse = await openai
    //   .createModeration({ input: sanitizedQuery })
    //   .then((res) => res.json())

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

    for (let i = 0; i < pageSections.length; i++) {
      const pageSection = pageSections[i]
      const content = pageSection.content
      // const encoded = tokenizer.encode(content)
      // tokenCount += encoded.text.length

      // if (tokenCount >= 1500) {
      //   break
      // }

      contextText += `${content.trim()}\n---\n`
    }

    console.log(`Context text: `, contextText)

    const prompt = codeBlock`
      Context sections:
      ${contextText}

       Question: """
      ${sanitizedQuery}

      Prioritze the data from context sections to informat youre answer. Do not suggest looking for information elsewhere.

      Provide concise short answers. Only refer to the data.

      If no clear answer help the user as a clean drinking water expert would.

      If you just get sent a location or brand of bottled water, respond with stats about that location's water quality or brand of bottled water quality.

      Respond with water source, owner/manufacturer, ph level, flouride level, treatment process and chemicals used, and the full breakdown of the ingredients the benefits and harms of each one.

      Include all the chemicals detected in the Essentia Full Testing Report and the amounts of each one over 0.0.

      If missing any of the above, just ignore it.

      Return the Essentia Oaisys Page url and hyperlink it at the bottom of your reply.

      Reply in markdown to format each section and data point to make it human readable but not a code snippet.
      """
    `

    console.log(`assistant_id: `, assistant_id)

    let threadId = thread_id
    // Create a thread
    if (!thread_id) {
      const thread = await openai.beta.threads.create()
      threadId = thread.id
    }

    console.log(`threadId: `, threadId)

    // adds message to thread
    const message = await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: prompt,
    })

    // runs assistant thread
    let run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistant_id,
      // instructions: "Please address the user as Jane Doe. The user has a premium account."
    })

    // create a timeout loop that checks if run.status === completed
    while (run.status !== 'completed') {
      await new Promise((resolve) => setTimeout(resolve, 1000)) // wait for 1 second before checking again
      run = await openai.beta.threads.runs.retrieve(threadId, run.id) // update the run status
    }

    // once completed, get updated messages
    const messages = await openai.beta.threads.messages.list(threadId)

    const chatReply = messages.data[messages.data.length - 1]

    // @ts-ignore
    const chatReplyText = messages.data[0].content[0].text.value

    return new Response(
      JSON.stringify({
        content: chatReplyText,
        thread_id: threadId,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
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
