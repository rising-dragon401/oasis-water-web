import BasicSearch from '@/components/basic-search'
import { P } from '@/components/ui/typography'
import { X } from 'lucide-react'
import Image from 'next/image'

export default function ItemSelector({
  item,
  setItem,
}: {
  item: any | null
  setItem: (item: any) => void
}) {
  return (
    <div>
      <BasicSearch
        showSearch={true}
        size="medium"
        placeholder="Item name"
        indices={['items', 'water_filters', 'tap_water_locations']}
        setItem={setItem}
        manualDisable={item !== null && item !== undefined}
      />

      {item && (
        <div className="mt-2 text-sm text-muted-foreground w-full max-w-sm flex flex-row items-center justify-between bg-card p-2 rounded-md border border-border">
          <div className="flex flex-row gap-2 items-center">
            <div className="flex flex-row gap-2 items-center w-8 h-8">
              <Image src={item.image} alt={item.name} width={50} height={50} />
            </div>
            <P>{item.name}</P>
          </div>

          <X className="w-5 h-5 text-muted-foreground" onClick={() => setItem(null)} />
        </div>
      )}
    </div>
  )
}
