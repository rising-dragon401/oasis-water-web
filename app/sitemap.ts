import { supabase } from '@/utils/supabase'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: items, error } = await supabase.from('items').select()
  const { data: locations, error: locationsError } = await supabase
    .from('tap_water_locations')
    .select()

  const itemsPaths = items
    ? items.map((item) => `/item/${item.id}?name=${item.name.toLowerCase().replace(/ /g, '-')}`)
    : []

  const locationsPaths =
    (locations &&
      locations.map(
        (location) =>
          `/location/${location.id}?name=${location.name.toLowerCase().replace(/ /g, '-')}`
      )) ||
    []

  return [
    ...itemsPaths.map((path) => ({
      url: `https://www.oaisys.ai${path}`,
      lastModified: new Date(),
    })),
    ...locationsPaths.map((path) => ({
      url: `https://www.oaisys.ai${path}`,
      lastModified: new Date(),
    })),
    {
      url: `https://www.oaisys.ai/`,
      lastModified: new Date(),
    },
    {
      url: `https://www.oaisys.ai/recommendations`,
      lastModified: new Date(),
    },
    {
      url: `https://www.oaisys.ai/bottled/bottled-water`,
      lastModified: new Date(),
    },
    {
      url: `https://www.oaisys.ai/tap-water`,
      lastModified: new Date(),
    },
    {
      url: `https://www.oaisys.ai/about`,
      lastModified: new Date(),
    },
  ]
}
