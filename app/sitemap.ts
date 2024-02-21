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
    ? items
        .filter((item: Item) => item.id !== null && item.name !== null)
        .map(
          (item: Item) =>
            `/search/item/${item.id}?name=${item.name.toLowerCase().replace(/ /g, '-')}`
        )
    : []

  const locationsPaths = locations
    ? locations
        .filter((location: TapWaterLocation) => location.id !== null && location.name !== null)
        .map(
          (location: TapWaterLocation) =>
            `/search/location/${location.id}?name=${location.name.toLowerCase().replace(/ /g, '-')}`
        )
    : []

  const filterPaths = filters
    ? filters
        .filter((filter: WaterFilter) => filter.id !== null && filter.name !== null)
        .map(
          (filter: WaterFilter) =>
            `/search/filter/${filter.id}?name=${filter.name.toLowerCase().replace(/ /g, '-')}`
        )
    : []

  const ingredientPaths = ingredients
    ? ingredients
        .filter((ingredient: Ingredient) => ingredient.id !== null && ingredient.name !== null)
        .map(
          (ingredient: Ingredient) =>
            `/search/ingredient/${ingredient.id}?name=${ingredient.name
              .toLowerCase()
              .replace(/ /g, '-')}`
        )
    : []

  const blogPaths = allPosts.map((post) => `${post.slug}`)

  return [
    ...itemsPaths.map((path: string) => ({
      url: `https://www.oasiswaters.co${path}`,
      // lastModified: new Date(),
    })),
    ...locationsPaths.map((path: string) => ({
      url: `https://www.oasiswaters.co${path}`,
    })),
    ...filterPaths.map((path: string) => ({
      url: `https://www.oasiswaters.co${path}`,
    })),
    ...ingredientPaths.map((path: string) => ({
      url: `https://www.oasiswaters.coi${path}`,
    })),
    {
      url: `https://www.oasiswaters.co`,
    },
    {
      url: `https://www.oasiswaters.co/recommendations`,
    },
    {
      url: `https://www.oasiswaters.co/search/bottled-water`,
    },
    {
      url: `https://www.oasiswaters.co/search/tap-water`,
    },
    {
      url: `https://www.oasiswaters.co/about`,
    },
    {
      url: `https://www.oasiswaters.co/faqs`,
    },
    {
      url: `https://www.oasiswaters.co/blog`,
    },
    ...blogPaths.map((path: string) => ({
      url: `https://www.oasiswaters.co${path}`,
    })),
  ]
}
