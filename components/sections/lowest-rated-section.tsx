import { getWorstItems } from '@/app/actions/items'
import ItemPreviewCard from '@/components/shared/item-preview-card'
import Typography from '@/components/typography'
import Link from 'next/link'

export default async function LowestRatedSection() {
  const lowestItems = await getWorstItems()

  return (
    <div>
      <div className="flex flex-row justify-between">
        <Typography size="2xl" fontWeight="normal">
          Bottled water
        </Typography>

        <Link href="/search/bottled-water" className="underline italic text-primary">
          see all
        </Link>
      </div>

      <div className="flex overflow-x-auto gap-8 hide-scrollbar" style={{ animation: 'fadeIn 1s' }}>
        {lowestItems &&
          lowestItems
            ?.slice(0, 5)
            .map((item) => <ItemPreviewCard key={item.id} item={item} alwaysShow />)}
      </div>
    </div>
  )
}
