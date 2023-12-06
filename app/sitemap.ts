import { MetadataRoute } from 'next'
import { TapWaterLocation, Filter, Item } from '@/types/custom'
import { getLocations } from './api/actions/locations'
import { getItems } from './api/actions/items'
import { getFilters } from './api/actions/filters'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const items = await getItems()
  const locations = await getLocations()
  const filters = await getFilters()

  const itemsPaths = items
    ? items.map(
        (item: Item) => `/item/${item.id}?name=${item.name.toLowerCase().replace(/ /g, '-')}`
      )
    : []

  const locationsPaths =
    (locations &&
      locations.map(
        (location: TapWaterLocation) =>
          `/location/${location.id}?name=${location.name.toLowerCase().replace(/ /g, '-')}`
      )) ||
    []

  const filterPaths =
    (filters &&
      filters.map(
        (filter: Filter) =>
          `/filter/${filter.id}?name=${filter.name.toLowerCase().replace(/ /g, '-')}`
      )) ||
    []

  return [
    ...itemsPaths.map((path: string) => ({
      url: `https://www.oaisys.ai${path}`,
      lastModified: new Date(),
    })),
    ...locationsPaths.map((path: string) => ({
      url: `https://www.oaisys.ai${path}`,
      lastModified: new Date(),
    })),
    ...filterPaths.map((path: string) => ({
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
