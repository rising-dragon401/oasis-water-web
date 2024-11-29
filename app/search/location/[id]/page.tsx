import { getLocation } from '@/app/actions/locations'
import SubpageLayout from '@/components/home-layout'
import { Item } from '@/types/custom'
import type { Metadata, ResolvingMetadata } from 'next'
import LocationForm from './components/location-form'

type Props = {
  params: { id: string }
  searchParams: { id: string; [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = params.id

  // fetch data
  const item = (await getLocation(id)) as Item | null

  const name = item && item.name + ' Tap Water Quality'

  return {
    title: name || 'Oasis',
    description: `Disocver the toxins and contaminants in ${item?.name} tap water.`,
  }
}

export default async function LocationPage({ params, searchParams }: Props) {
  const id = params.id

  return (
    <SubpageLayout>
      <LocationForm id={id} />
    </SubpageLayout>
  )
}
