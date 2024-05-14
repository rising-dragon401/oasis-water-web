import BasicSearch from '@/components/basic-search'
import SubpageLayout from '@/components/home-layout'
import UserPreviewCard from '@/components/shared/user-preview-card'
import Typography from '@/components/typography'
import { getUsersWithOasis } from '../actions/user'

export default async function UsersPage() {
  const usersWithOasis = await getUsersWithOasis()

  return (
    <SubpageLayout>
      <div className="flex h-full flex-col pt-16 pb-20 md:px-0 px-4 max-w-full">
        <div className="mb-8 flex flex-col w-full items-center justify-center gap-6 ">
          <div className="flex flex-col items-center text-center gap-2 mb-4">
            <Typography size="5xl" fontWeight="bold">
              See what others drink.
            </Typography>
            <Typography size="base" fontWeight="normal" className="max-w-lg italic">
              Beta: in progress of adding more people. Add products to your Oasis to show up in
              results.
            </Typography>
          </div>

          <BasicSearch
            showSearch={true}
            size="large"
            indices={['users']}
            placeholder="Search users"
          />
        </div>

        {usersWithOasis && usersWithOasis?.length > 0 ? (
          <div className="grid md:grid-cols-4 grid-cols-2 w-full gap-6">
            {usersWithOasis.map((user: any) => (
              <UserPreviewCard key={user.id} user={user} />
            ))}
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
