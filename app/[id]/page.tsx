import SubpageLayout from '@/components/home-layout'
import FavoriteList from '@/components/shared/favorites-list'

export default async function MyOaisysPage({ params }: { params: any }) {
  const id = params.id

  return (
    <SubpageLayout>
      <FavoriteList userName={id} />
    </SubpageLayout>
  )
}
