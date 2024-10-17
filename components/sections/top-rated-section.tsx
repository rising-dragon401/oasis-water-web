import { getTopItems } from '@/app/actions/items'
import ItemPreviewCard from '@/components/shared/item-preview-card'
import Typography from '@/components/typography'
import Link from 'next/link'

export default async function TopRatedSection() {
  const topItems = await getTopItems()

  return (
    <div>
      <div className="py-4 flex flex-row justify-between">
        <Typography size="2xl" fontWeight="normal">
          Top rated bottled water
        </Typography>

        <Link href="/search/bottled-water" className="underline italic text-primary">
          see all
        </Link>
      </div>

      <div
        className="flex flex-row gap-8 hide-scrollbar overflow-x-scroll"
        style={{ animation: 'fadeIn 1s' }}
      >
        {topItems &&
          topItems
            ?.slice(0, 5)
            .map((item: any) => <ItemPreviewCard key={item.id} item={item} alwaysShow />)}
      </div>
    </div>
  )
}
