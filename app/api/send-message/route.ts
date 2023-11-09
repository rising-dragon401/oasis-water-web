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

const openAiKey = process.env.OPENAI_API_KEY
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// const config = new Configuration({
//   apiKey: openAiKey,
// })
// const openai = new OpenAIApi(config)

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    if (!openAiKey) {
      throw new ApplicationError('Missing environment variable OPENAI_KEY')
    }

    if (!supabaseUrl) {
      throw new ApplicationError('Missing environment variable SUPABASE_URL')
    }

    if (!supabaseServiceKey) {
      throw new ApplicationError('Missing environment variable SUPABASE_SERVICE_ROLE_KEY')
    }

    const requestData = await req.json()

    if (!requestData) {
      throw new UserError('Missing request data')
    }

    const { prompt: query, assistant_id } = requestData

    if (!query) {
      throw new UserError('Missing query in request data')
    }

    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey)

    // Moderate the content to comply with OpenAI T&C
    const sanitizedQuery = query.trim()

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
        match_threshold: 0.5,
        match_count: 10,
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

    const prompt = codeBlock`
      Context sections:
      ${contextText}

      Prioritze the data from context sections to informat youre answer. Do not suggest looking for information elsewhere.

      Provide concise short answers. Only refer to the data.

      If no clear answer help the user as a clean drinking water expert would.

      Question: """
      ${sanitizedQuery}
      """
    `

    console.log(`assistant_id: `, assistant_id)

    // Create a thread
    const thread = await openai.beta.threads.create()

    // adds message to thread
    const message = await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: prompt,
    })

    // runs assistant thread
    let run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistant_id,
      // instructions: "Please address the user as Jane Doe. The user has a premium account."
    })

    // create a timeout loop that checks if run.status === completed
    while (run.status !== 'completed') {
      await new Promise((resolve) => setTimeout(resolve, 1000)) // wait for 1 second before checking again
      run = await openai.beta.threads.runs.retrieve(thread.id, run.id) // update the run status
    }

    // once completed, get updated messages
    const messages = await openai.beta.threads.messages.list(thread.id)

    const chatReply = messages.data[messages.data.length - 1]

    // @ts-ignore
    const chatReplyText = messages.data[0].content[0].text.value

    return new Response(
      JSON.stringify({
        chatReplyText,
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
