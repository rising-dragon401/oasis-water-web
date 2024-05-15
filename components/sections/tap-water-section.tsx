import { getRandomLocations } from '@/app/actions/locations'
import ItemPreviewCard from '@/components/shared/item-preview-card'
import Typography from '@/components/typography'
import Link from 'next/link'

export default async function TapWaterSection() {
  const featured = await getRandomLocations()

  return (
    <div>
      <div className="py-4 flex flex-row justify-between">
        <Typography size="2xl" fontWeight="normal">
          Tap water ratings
        </Typography>

        <Link href="/search/tap-water" className="underline italic text-primary">
          see all
        </Link>
      </div>

      <div className="flex overflow-x-auto gap-8 hide-scrollbar" style={{ animation: 'fadeIn 1s' }}>
        {featured &&
          featured.map((location) => <ItemPreviewCard key={location.name} item={location} />)}
      </div>
    </div>
  )
}
