import SubpageLayout from '@/components/home-layout'
import FavoriteList from './components/favorites-list'
import Typography from '@/components/typography'

export default async function MyOaisysPage() {
  return (
    <SubpageLayout>
      <Typography size="xl" fontWeight="bold" className="text-primary">
        Settings
      </Typography>
      <FavoriteList />
    </SubpageLayout>
  )
}
