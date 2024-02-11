import SubpageLayout from '@/components/home-layout'
import FavoriteList from './components/favorites-list'

export default async function MyOaisysPage() {
  return (
    <SubpageLayout>
      <FavoriteList />
    </SubpageLayout>
  )
}
