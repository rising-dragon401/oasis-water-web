import { getFilters } from '@/app/api/actions/filters'

export async function GET() {
  const data = await getFilters()

  return Response.json({ data })
}
