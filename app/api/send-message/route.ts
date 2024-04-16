import { ApplicationError, UserError } from '@/lib/errors'
import { determineLink } from '@/utils/helpers'
import { createClient } from '@supabase/supabase-js'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { codeBlock, oneLine } from 'common-tags'
import GPT3Tokenizer from 'gpt3-tokenizer'
import OpenAI from 'openai'

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

    const oasisPaths = {
      'All bottled water': `https://${process.env.NEXT_PUBLIC_BASE_URL}search/bottled-water`,
      'All filters': `https://${process.env.NEXT_PUBLIC_BASE_URL}search/filters`,
      'All tap water': `https://${process.env.NEXT_PUBLIC_BASE_URL}search/tap-water`,
    }

    const systemMessage = `
      You are a clean drinking water and healhty product longevity companion, scientist, and expert.

      Users ask you about specific water items or general questions about research and health. Provide them with research backed, concise answers to lead them to a healthy lifestyle.
          
      Reply in markdown to format including data but sounding like a human conversation. Keep your answers brief.

      Prioritze data from Oasis. And display the relevant data in your answer in addition to the helpful links for the user to learn more.

      Include markdown relative learn more button. "Learn more" buttons should link to PagePath

      These general paths might help too: ${JSON.stringify(oasisPaths, null, 2)}

      Only link to Oasis pages. Buttons should contain descriptive labels based on the content  titleand only use them where necessary.

      Button Syntax: [Click Me](http://example.com "oasis-button")
    `

    // console.log('systemMessage: ', systemMessage)

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

    // console.log('query: ', query)

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

    // console.log(`Match error:`, matchError)
    // console.log(`Documents: ${JSON.stringify(documents)}`)

    if (matchError) {
      throw new ApplicationError('Failed to match page sections', matchError)
    }

    const tokenizer = new GPT3Tokenizer({ type: 'gpt3' })
    const maxTokenCount = 20000

    const formulateItemData = async (document: any) => {
      let contentData
      if (typeof document.content !== 'string') {
        contentData = JSON.parse(document.content)
      } else {
        contentData = document.content
      }

      const itemObject = {
        id: document.original_id,
        type: contentData?.type || '',
        name: contentData?.name || '',
      }

      const pagePath = await determineLink(itemObject)

      let content = document.content
      const encoded = tokenizer.encode(content)
      let contentField = ''

      if (encoded.text.length > maxTokenCount) {
        // If content exceeds the limit, truncate it
        content = content.slice(0, maxTokenCount)
        contentField = `${content.trim()}\n---\n`
      } else {
        // If content does not exceed the limit, use it as is
        contentField = `${content.trim()}\n---\n`
      }

      return {
        itemID: document?.original_id,
        table: document?.original_table,
        name: contentData?.name,
        affiliateLink: contentData?.affiliateLink,
        pagePath,
        content: contentField,
      }
    }

    const getResearchMetadata = async (researchDocument: any) => {
      const { data, error } = await supabaseClient
        .from('research')
        .select('file_url, title')
        .eq('id', researchDocument.original_id)
        .single()

      if (error) {
        console.error('Error fetching research document URL:', error)
        throw new Error('Failed to fetch research document URL')
      }

      return {
        link: data.file_url,
        title: data.title,
      }
    }

    const formulateResearchData = async (document: any) => {
      const { link, title } = await getResearchMetadata(document)

      return {
        itemID: document?.original_id,
        table: document?.original_table,
        title: title,
        pagePath: link,
        content: document.content,
      }
    }

    const getData = async () => {
      return await Promise.all(
        documents.map(async (document: any) => {
          if (
            document.original_table === 'water_filters' ||
            document.original_table === 'items' ||
            document.original_table === 'tap_water_locations'
          ) {
            return await formulateItemData(document)
          } else if (document.original_table === 'research') {
            return await formulateResearchData(document)
          }
        })
      )
    }

    const data = await getData()

    console.log('data: ', data)

    const prompt = codeBlock`
      Oasis data: ${JSON.stringify(data)}

      Question: ${sanitizedQuery}
    `

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
