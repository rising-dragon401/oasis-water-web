import { getMostRecentItems } from '@/app/actions/items'
import ItemPreviewCard from '@/components/shared/item-preview-card'
import Typography from '@/components/typography'
import Link from 'next/link'

export default async function MostRecentSection() {
  const items = await getMostRecentItems()

  return (
    <div>
      <div className="flex flex-row justify-between mb-2">
        <Typography size="2xl" fontWeight="normal">
          Recently added
        </Typography>

        <Link href="/top-rated" className="italic text-primary">
          see all
        </Link>
      </div>

      <div className="flex overflow-x-auto gap-8 hide-scrollbar" style={{ animation: 'fadeIn 1s' }}>
        <div className="flex flex-nowrap gap-4">
          {items &&
            items?.slice(0, 10).map((item: any) => (
              <div key={item.id} className="flex-shrink-0 md:w-64 w-36">
                <ItemPreviewCard item={item} size="small" />
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
