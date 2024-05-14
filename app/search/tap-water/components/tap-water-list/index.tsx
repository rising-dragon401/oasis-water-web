import BasicSearch from '@/components/basic-search'
import ItemPreviewCard from '@/components/shared/item-preview-card'
import Typography from '@/components/typography'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { US_STATES } from '@/lib/constants/locations'
import { TapWaterLocation } from '@/types/custom'

type Props = {
  locations: TapWaterLocation[] | null
}

export default function TapWaterList({ locations }: Props) {
  return (
    <div className="w-full">
      <div className="py-14 flex flex-col justify-center items-center text-center gap-4">
        <Typography size="4xl" fontWeight="normal" className="mb-4 md:max-w-lg max-w-xs">
          Look up what&apos;s in your tap water
        </Typography>

        <BasicSearch
          showSearch={true}
          size="medium"
          indices={['tap_water_locations']}
          placeholder="Search US city or state"
          numResults={10}
        />
      </div>

      <div className="flex flex-row flex-wrap justify-between ">
        <Tabs defaultValue={US_STATES[0]}>
          <div className="md:!max-w-[80vw] max-w-[90vw] overflow-x-scroll hide-scrollbar">
            <TabsList>
              {US_STATES.map((state) => (
                <TabsTrigger key={state} value={state}>
                  {state}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {US_STATES.map((state) => (
            <TabsContent key={state} value={state} className="">
              <div className="flex flex-row flex-wrap justify-between w-full">
                {locations
                  ?.filter((location) => location.state === state)
                  .map((filteredLocation) => (
                    <ItemPreviewCard key={filteredLocation.id} item={filteredLocation} />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
