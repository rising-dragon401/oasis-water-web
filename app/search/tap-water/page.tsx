import { getLocations } from '@/app/actions/locations'
import TapWaterList from './components/tap-water-list'
import SubpageLayout from '@/components/home-layout'

export default async function TapWater() {
  const locations = await getLocations()

  return (
    <SubpageLayout>
      <div className="md:px-4">
        <TapWaterList locations={locations} />
      </div>
    </SubpageLayout>
  )
}
