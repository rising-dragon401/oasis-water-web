import { getLocations } from '@/app/api/actions/locations'

export async function GET() {
  console.log('locations route')

  const data = await getLocations()

  return Response.json({ data })
}
