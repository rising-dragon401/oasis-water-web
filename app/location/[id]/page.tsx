import SubpageLayout from '@/components/home-layout'
import LocationForm from './components/location-form'

export default function LocationPage({ params }: { params: { id: string } }) {
  const { id } = params

  return (
    <SubpageLayout>
      <LocationForm id={id} />
    </SubpageLayout>
  )
}
