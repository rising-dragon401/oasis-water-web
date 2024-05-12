import { algoliaClient } from '@/app/api/utils/algolia'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const { objects, indexName } = (await req.json()) as { objects: any[]; indexName: string }

    console.log('objects', objects)

    if (!objects) {
      return new Response('No objects provided', { status: 400 })
    }

    const algoliaTableIndex = algoliaClient.initIndex(indexName)

    const objectIDs = await algoliaTableIndex
      .partialUpdateObjects(objects, {
        createIfNotExists: true,
      })
      .then(({ objectIDs }) => {
        return objectIDs
      })
      .catch((err) => {
        console.error('Error updating item object:', err)
        throw new Error(`Failed to update item object: ${JSON.stringify(err)}`)
      })

    if (!objectIDs) {
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

    return new Response(
      JSON.stringify({
        message: 'item updated',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (err) {
    console.error('Error updating ingredient index:', err)
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
