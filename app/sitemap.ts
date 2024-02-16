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
      url: `https://www.oasis.ai${path}`,
      // lastModified: new Date(),
    })),
    ...locationsPaths.map((path: string) => ({
      url: `https://www.oasis.ai${path}`,
    })),
    ...filterPaths.map((path: string) => ({
      url: `https://www.oasis.ai${path}`,
    })),
    ...ingredientPaths.map((path: string) => ({
      url: `https://www.oasis.ai${path}`,
    })),
    {
      url: `https://www.oasis.ai/`,
    },
    {
      url: `https://www.oasis.ai/recommendations`,
    },
    {
      url: `https://www.oasis.ai/search/bottled-water`,
    },
    {
      url: `https://www.oasis.ai/search/tap-water`,
    },
    {
      url: `https://www.oasis.ai/about`,
    },
    {
      url: `https://www.oasis.ai/faqs`,
    },
    {
      url: `https://www.oasis.ai/blog`,
    },
    ...blogPaths.map((path: string) => ({
      url: `https://www.oasis.ai${path}`,
    })),
  ]
}
