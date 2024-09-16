export type TabKeys =
  | 'bottled_water'
  | 'flavored_water'
  | 'gallons'
  | 'tap_water'
  | 'filter'
  | 'shower_filter'
  | 'bottle_filter'
  | 'energy_drink'
  | 'sports_drink'
  | 'coconut_water'

type CategoryType = {
  id: TabKeys
  title: string
  href?: string
  image: string
  tags?: string[]
  is_new?: boolean
}

export const CATEGORIES: CategoryType[] = [
  {
    id: 'bottled_water',
    title: 'Bottled waters',
    image:
      'https://connect.live-oasis.com/storage/v1/object/public/website/images/categories/bottled_water_cover.png',
    tags: ['still', 'sparkling'],
  },
  {
    id: 'filter',
    title: 'Water filters',
    image:
      'https://connect.live-oasis.com/storage/v1/object/public/website/images/categories/water_filters_cover.png?t=2024-09-02T23%3A58%3A21.298Z',
    tags: ['sink', 'counter', 'pitcher'],
  },
  {
    id: 'gallons',
    title: 'Water gallons',
    image:
      'https://connect.live-oasis.com/storage/v1/object/public/website/images/categories/water_gallon_cover.png?t=2024-09-03T00%3A05%3A12.584Z',
  },
  {
    id: 'shower_filter',
    title: 'Shower filters',
    image:
      'https://connect.live-oasis.com/storage/v1/object/public/website/images/categories/shower_filter_cover.png',
  },
  {
    id: 'bottle_filter',
    title: 'Bottle filters',
    image:
      'https://connect.live-oasis.com/storage/v1/object/public/website/images/categories/water_bottle_filter.png',
  },
  {
    id: 'flavored_water',
    title: 'Flavored drinks',
    image:
      'https://connect.live-oasis.com/storage/v1/object/public/website/images/categories/sparkling_water_cover.png',
    tags: ['still', 'sparkling'],
  },
  {
    id: 'energy_drink',
    title: 'Energy drinks',
    image:
      'https://connect.live-oasis.com/storage/v1/object/public/website/images/categories/energy%20drink%20cover.png',
  },
  {
    id: 'coconut_water',
    title: 'Coconut waters',
    image:
      'https://connect.live-oasis.com/storage/v1/object/public/website/images/categories/coconut%20water%20category%20cover.png',
  },
]
