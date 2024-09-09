import BasicSearch from '@/components/basic-search'
import SubpageLayout from '@/components/home-layout'
import UserPreviewCard from '@/components/shared/user-preview-card'
import Typography from '@/components/typography'
import { getFeaturedUsers } from '../actions/admin'
export default async function UsersPage() {
  const people = await getFeaturedUsers()

  return (
    <SubpageLayout>
      <div className="flex h-full w-full flex-col md:pt-10 pt-6 md:px-0 px-4 ">
        <div className="flex flex-col w-full items-center justify-center gap-6 mb-12">
          <div className="flex flex-col items-center text-center gap-2">
            <Typography size="4xl" fontWeight="bold">
              See what others are drinking
            </Typography>
            <Typography size="base" fontWeight="normal" className="max-w-lg text-secondary">
              Add products to your Oasis to show up in the results
            </Typography>
          </div>

          <BasicSearch
            showSearch={true}
            size="large"
            indices={['users']}
            placeholder="Search users"
          />
        </div>

        {people && people?.length > 0 ? (
          <div className="flex flex-col">
            <Typography size="lg" fontWeight="normal" className="text-muted-foreground">
              Featured users
            </Typography>
            <div className="grid md:grid-cols-4 grid-cols-2 w-full gap-6">
              {people.map((user: any) => (
                <>{user.score && <UserPreviewCard key={user.id} user={user} />}</>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex w-full justify-center flex-col items-center mt-10">
            <Typography size="xl" fontWeight="normal">
              No users found.
            </Typography>
            <Typography size="base" fontWeight="normal">
              Add products to your Oasis to show up in results.
            </Typography>
          </div>
        )}
      </div>
    </SubpageLayout>
  )
}
