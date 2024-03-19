import SubpageLayout from '@/components/home-layout'
import LocationForm from './components/location-form'
import type { Metadata, ResolvingMetadata } from 'next'
import { getLocation } from '@/app/actions/locations'
import { OG_IMAGE } from '@/lib/constants/images'
import { Item } from '@/types/custom'

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
