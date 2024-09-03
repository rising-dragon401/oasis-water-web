import { getUserByUsername } from '@/app/actions/user'
import SubpageLayout from '@/components/home-layout'
import FavoriteList from '@/components/shared/favorites-list'

export default async function MyOaisysPage({ params }: { params: any }) {
  const id = params.id

  const user = await getUserByUsername(id)

  return (
    <SubpageLayout>
      <FavoriteList userId={user?.id} />
    </SubpageLayout>
  )
}
