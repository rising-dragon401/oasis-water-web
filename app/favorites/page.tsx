import SubpageLayout from '@/components/home-layout'
import { getUserFavorites } from '../actions/user'
import FavoriteList from './components/favorites-list'

export default async function FiltersPage() {
  const favorites = await getUserFavorites()

  return (
    <SubpageLayout>
      <div className="md:px-4">
        <FavoriteList favorites={favorites} />
      </div>
    </SubpageLayout>
  )
}
