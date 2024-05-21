import { getFeaturedUsers } from '@/app/actions/admin'
import UserPreviewCard from '@/components/shared/user-preview-card'
import Typography from '@/components/typography'
import Link from 'next/link'

export default async function PeopleSection() {
  const people = await getFeaturedUsers()

  return (
    <div>
      <div className="flex flex-row justify-between">
        <Typography size="2xl" fontWeight="normal">
          People
        </Typography>

        <Link href="/users" className="underline italic text-primary">
          see all
        </Link>
      </div>

      <div className="flex overflow-x-auto gap-8 hide-scrollbar" style={{ animation: 'fadeIn 1s' }}>
        {people &&
          people?.slice(0, 5).map((user: any) => <UserPreviewCard key={user.id} user={user} />)}
      </div>
    </div>
  )
}
