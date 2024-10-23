import { getFeaturedUsers } from '@/app/actions/admin'
import UserPreviewCard from '@/components/shared/user-preview-card'
import Typography from '@/components/typography'
import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

export default async function PeopleSection() {
  const people = await getFeaturedUsers()

  return (
    <div>
      <div className="flex flex-row justify-between">
        <Typography size="2xl" fontWeight="normal">
          See what others are drinking
        </Typography>
      </div>

      <div
        className="flex overflow-x-auto md:gap-8 gap-2 hide-scrollbar pb-4"
        style={{ animation: 'fadeIn 1s' }}
      >
        {people &&
          people?.slice(0, 5).map((user: any) => <UserPreviewCard key={user.id} user={user} />)}

        <Link
          href={`/favorites`}
          className="flex w-full items-center justify-between border-border mt-4 relative bg-card rounded-full hover:shadow-md p-2 pr-4 md:p-3 md:pr-6"
        >
          <div className="flex flex-col min-w-0 pl-2">
            <Typography
              size="sm"
              fontWeight="bold"
              className="!no-underline text-primary md:text-base truncate"
            >
              Share what you drink
            </Typography>
            <Typography
              size="xs"
              fontWeight="normal"
              className="!no-underline text-secondary md:text-sm"
            >
              add your products
            </Typography>
          </div>
          <div className="relative flex-shrink-0 md:w-8 md:h-8 w-6 h-6 ml-auto">
            <ArrowUpRight className="w-full h-full" />
          </div>
        </Link>
      </div>
    </div>
  )
}
