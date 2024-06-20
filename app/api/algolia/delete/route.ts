import { algoliaClient } from '@/app/api/utils/algolia'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const { objectId, indexName } = (await req.json()) as { objectId: string; indexName: string }

    if (!objectId) {
      console.error('No objectId provided')
      return new Response('No objectId', { status: 400 })
    }

    const algoliaTableIndex = algoliaClient.initIndex(indexName)

    algoliaTableIndex
      .deleteObject(objectId)
      .then(() => {
        return true
      })
      .catch((err) => {
        console.error('Error deleteing object:', err)
        throw new Error(`Failed to delete object: ${JSON.stringify(err)}`)
      })

    return new Response(
      JSON.stringify({
        message: 'delete updated',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (err) {
    console.error('Error updating delete index:', err)
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
