import { getItems } from '@/app/actions/items'
import BottledWaterList from './components/all-bottled-water-list'
import SubpageLayout from '@/components/home-layout'

export default async function BottledWater() {
  const items = await getItems()

  return (
    <SubpageLayout>
      <div className="md:px-4">
        <BottledWaterList items={items} />
      </div>
    </SubpageLayout>
  )
}
