import SubpageLayout from '@/components/home-layout'
import FavoriteList from './components/favorites-list'

export default async function MyOaisysPage({ params }: { params: any }) {
  const id = params.id

  return (
    <SubpageLayout>
      <FavoriteList userId={id} />
    </SubpageLayout>
  )
}
