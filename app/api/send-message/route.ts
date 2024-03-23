import { createClient } from '@supabase/supabase-js'
import { codeBlock, oneLine } from 'common-tags'
import GPT3Tokenizer from 'gpt3-tokenizer'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { ApplicationError, UserError } from '@/lib/errors'
import OpenAI from 'openai'
import { determineLink } from '@/utils/helpers'

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
      You are a clean drinking water assistant, scientist, and expert.

      Users ask you about specific water items or general questions about research and health. Provide them with research backed, concise answers to lead them to a healthy lifestyle.
          
      Reply in markdown to format including data but sounding like a human conversation.

      Prioritze data from Oasis.  

      Include markdown for two buttons at the bottom if possible. Includes blank_ attribute. Only include if applicable.
      1. Learn more button linking to PagePath in new tab
      2. Buy button linking to AffilateLink in new tab

      Button Syntax: [Click Me](http://example.com "oasis-button")
    `

    const fullQuery = oneLine`
     ${query}    
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

    console.log('query: ', query)

    // Create embedding from query
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: query,
    })

    const [{ embedding }] = embeddingResponse.data

    const { error: matchError, data: documents } = await supabaseClient.rpc('match_documents', {
      query_embedding: embedding,
      match_threshold: 0.4,
      match_count: 5,
    })

    console.log(`Match error:`, matchError)
    console.log(`Documents: ${console.log(`Page sections: ${JSON.stringify(documents)}`)}`)

    if (matchError) {
      throw new ApplicationError('Failed to match page sections', matchError)
    }

    const itemId = documents[0].original_id
    const table = documents[0].original_table

    console.log('itemId: ', itemId)
    console.log('table: ', table)

    const { data: item, error: itemError } = await supabaseClient
      .from(table)
      .select('*')
      .eq('id', itemId)
      .single()

    if (itemError) {
      throw new ApplicationError('Failed to fetch item', itemError)
    }

    const pagePath = await determineLink(item)
    const affiliateLink = item.affiliate_url

    const tokenizer = new GPT3Tokenizer({ type: 'gpt3' })
    let tokenCount = 0
    let contextText = ''
    const maxTokenCount = 20000

    for (let i = 0; i < documents.length; i++) {
      const pageSection = documents[i]
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

    // console.log(`Context text: `, contextText)

    const prompt = codeBlock`
      Oasis data:
      ${contextText}

      PagePath:  ${pagePath}
      AffilateLink:  ${affiliateLink}

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
