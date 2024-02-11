import { MetadataRoute } from 'next'
import { TapWaterLocation, WaterFilter, Item, Ingredient } from '@/types/custom'
import { allPosts } from 'contentlayer/generated'
import { getLocations } from '@/app/actions/locations'
import { getItems } from '@/app/actions/items'
import { getFilters } from '@/app/actions/filters'
import { getIngredients } from '@/app/actions/ingredients'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const items = await getItems()
  const locations = await getLocations()
  const filters = await getFilters()
  const ingredients = await getIngredients()

  const itemsPaths = items
    ? items.map(
        (item: Item) => `/search/item/${item.id}?name=${item.name.toLowerCase().replace(/ /g, '-')}`
      )
    : []

  const locationsPaths =
    (locations &&
      locations.map(
        (location: TapWaterLocation) =>
          `/search/location/${location.id}?name=${location.name.toLowerCase().replace(/ /g, '-')}`
      )) ||
    []

  const filterPaths =
    (filters &&
      filters.map(
        (filter: WaterFilter) =>
          `/search/filter/${filter.id}?name=${filter.name.toLowerCase().replace(/ /g, '-')}`
      )) ||
    []

  const ingredientPaths =
    (ingredients &&
      ingredients.map(
        (ingredient: Ingredient) =>
          `/search/ingredient/${ingredient.id}?name=${ingredient.name
            .toLowerCase()
            .replace(/ /g, '-')}`
      )) ||
    []

  const blogPaths = allPosts.map((post) => `${post.slug}`)

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
    ...ingredientPaths.map((path: string) => ({
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
    {
      url: `https://www.oaisys.ai/faqs`,
      lastModified: new Date(),
    },
    {
      url: `https://www.oaisys.ai/blog`,
      lastModified: new Date(),
    },
    ...blogPaths.map((path: string) => ({
      url: `https://www.oaisys.ai${path}`,
      lastModified: new Date(),
    })),
  ]
}
