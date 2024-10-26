import { ApplicationError, UserError } from '@/lib/errors'
import { createClient } from '@supabase/supabase-js'
import { codeBlock, oneLine } from 'common-tags'
import GPT3Tokenizer from 'gpt3-tokenizer'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export const maxDuration = 300

export async function POST(req: Request, res: Response) {
  try {
    console.log('helllooooo')
    if (!supabaseUrl) {
      throw new ApplicationError('Missing environment variable SUPABASE_URL')
    }

    if (!supabaseServiceKey) {
      throw new ApplicationError('Missing environment variable SUPABASE_SERVICE_ROLE_KEY')
    }

    const { query, assistant_id, thread_id, is_stream } = await req.json()

    console.log('query: ', query)
    console.log('thread_id: ', thread_id)
    console.log('assistant_id: ', assistant_id)

    if (!query || !assistant_id || !thread_id) {
      throw new UserError('Missing query, assistant_id, or thread_id in request data')
    }

    // cancel any existing runs
    const runs = await openai.beta.threads.runs.list(thread_id)
    if (runs.data.length > 0) {
      for (const run of runs.data) {
        if (run.status !== 'completed') {
          console.log(`Cancelling run with ID: ${run.id} because status is ${run.status}`)
          await openai.beta.threads.runs.cancel(thread_id, run.id)
        }
      }
    }

    // const oasisPaths = {
    //   'All bottled water': `https://${process.env.NEXT_PUBLIC_BASE_URL}search/bottled-water`,
    //   'All filters': `https://${process.env.NEXT_PUBLIC_BASE_URL}search/filters`,
    //   'All tap water': `https://${process.env.NEXT_PUBLIC_BASE_URL}search/tap-water`,
    // }

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
      match_count: 47,
    })

    console.log('documents: ', documents)

    // console.log(`Match error:`, matchError)
    console.log(`Documents: ${JSON.stringify(documents)}`)

    if (matchError) {
      throw new ApplicationError('Failed to match page sections', matchError)
    }

    const tokenizer = new GPT3Tokenizer({ type: 'gpt3' })
    const maxTokenCount = 20000

    // deprecate item fetching in AI
    // const formulateItemData = async (document: any) => {
    //   let contentData
    //   if (typeof document.content !== 'string') {
    //     contentData = JSON.parse(document.content)
    //   } else {
    //     contentData = document.content
    //   }

    //   const itemObject = {
    //     id: document.original_id,
    //     type: contentData?.type || '',
    //     name: contentData?.name || '',
    //   }

    //   const pagePath = await determineLink(itemObject)

    //   let content = document.content
    //   const encoded = tokenizer.encode(content)
    //   let contentField = ''

    //   if (encoded.text.length > maxTokenCount) {
    //     // If content exceeds the limit, truncate it
    //     content = content.slice(0, maxTokenCount)
    //     contentField = `${content.trim()}\n---\n`
    //   } else {
    //     // If content does not exceed the limit, use it as is
    //     contentField = `${content.trim()}\n---\n`
    //   }

    //   return {
    //     itemID: document?.original_id,
    //     table: document?.original_table,
    //     name: contentData?.name,
    //     affiliateLink: contentData?.affiliateLink,
    //     pagePath,
    //     content: contentField,
    //   }
    // }

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
          if (document.original_table === 'research') {
            return await formulateResearchData(document)
          }
          // deprecate item fetching in AI
          // if (
          //   document.original_table === 'water_filters' ||
          //   document.original_table === 'items' ||
          //   document.original_table === 'tap_water_locations'
          // ) {
          //   return await formulateItemData(document)
          // } else if (document.original_table === 'research') {
          //   return await formulateResearchData(document)
          // }
        })
      )
    }

    const data = await getData()

    // console.log('data: ', JSON.stringify(data))

    const prompt = codeBlock`
      Question: ${sanitizedQuery}

      Relevent oasis research data to use to formulate your answer: ${JSON.stringify(data)}
    `
    // console.log('prompt: ', prompt)

    if (is_stream === false) {
      // create run and wait for completion
      const run = await openai.beta.threads.runs.create(thread_id, {
        assistant_id: assistant_id,
        model: 'gpt-4o',
        additional_messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      })

      // Polling to wait until the run status is 'completed'
      let completion
      while (true) {
        const statusCheck = await openai.beta.threads.runs.retrieve(thread_id, run.id)
        if (statusCheck.status === 'completed') {
          completion = statusCheck
          break
        }
        // Wait for a short period before checking the status again
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }

      // now retrieve messages in the thread
      const messages = await openai.beta.threads.messages.list(thread_id)
      const lastMessage = messages.data[0]
      const lastMessageContent = lastMessage.content

      return new Response(
        JSON.stringify({
          content: lastMessageContent,
        }),
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
    } else {
      console.log('creating response with stream')

      const stream = await openai.beta.threads.runs.create(thread_id, {
        assistant_id: assistant_id,
        stream: true,
        model: 'gpt-4o',
        additional_messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      })

      return new Response(stream.toReadableStream())
    }
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
