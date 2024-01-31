import SubpageLayout from '@/components/home-layout'
import { getUserFavorites } from '../actions/user'
import FavoriteList from './components/favorites-list'

export default async function FiltersPage() {
  return (
    <SubpageLayout>
      <div className="md:px-4">
        <FavoriteList />
      </div>
    </SubpageLayout>
  )
}
