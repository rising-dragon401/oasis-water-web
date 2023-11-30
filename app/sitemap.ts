import { MetadataRoute } from 'next'
import { getItems } from './actions/items'
import { getLocations } from './actions/locations'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const items = await getItems()
  const locations = await getLocations()

  console.log('items', items)
  console.log('locations', locations)

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
