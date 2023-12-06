import { MetadataRoute } from 'next'
import { TapWaterLocation, Filter, Item } from '@/types/custom'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const items = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/items/get`).then((res) => {
    if (!res.ok) {
      console.log('Error fetching items:', res.statusText)
      return
    }
    return res.json()
  })

  const locations = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/locations/get`).then(
    (res) => {
      if (!res.ok) {
        console.log('Error fetching locations:', res.statusText)
        return
      }
      return res.json()
    }
  )

  const filters = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/filters/get`).then((res) => {
    if (!res.ok) {
      console.log('Error fetching filters:', res.statusText)
      return
    }
    return res.json()
  })

  const itemsPaths = items?.data
    ? items.data.map(
        (item: Item) => `/item/${item.id}?name=${item.name.toLowerCase().replace(/ /g, '-')}`
      )
    : []

  const locationsPaths =
    (locations?.data &&
      locations.data.map(
        (location: TapWaterLocation) =>
          `/location/${location.id}?name=${location.name.toLowerCase().replace(/ /g, '-')}`
      )) ||
    []

  const filterPaths =
    (filters?.data &&
      filters.data.map(
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
