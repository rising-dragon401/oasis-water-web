import SubpageLayout from '@/components/home-layout'
import IngredientForm from './components/ingredient-form'
import type { Metadata } from 'next'
import { getIngredient } from '@/app/actions/ingredients'
import { OG_IMAGE } from '@/lib/constants/images'
import { Ingredient } from '@/types/custom'

type Props = {
  params: { id: string }
  searchParams: { name: string; [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id

  const ingredient = (await getIngredient(id)) as Ingredient | null

  const name = ingredient && ingredient.name + ' Health Benefits and Risks'
  const image = ingredient && ingredient.image

  return {
    title: name || 'Oaisys',
    openGraph: {
      images: [image || OG_IMAGE],
    },
  }
}

export default function ItemPage({ params, searchParams }: Props) {
  const id = params.id

  return (
    <SubpageLayout>
      <IngredientForm id={id} />
    </SubpageLayout>
  )
}
