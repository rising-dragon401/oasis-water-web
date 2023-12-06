import { getItems } from '@/app/api/actions/items'

export async function GET() {
  console.log('items route')
  const data = await getItems()

  return Response.json({ data })
}
