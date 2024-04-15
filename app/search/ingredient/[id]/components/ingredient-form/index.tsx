'use client'

import { getIngredient } from '@/app/actions/ingredients'
import Sources from '@/components/shared/sources'
import Typography from '@/components/typography'
import { Ingredient } from '@/types/custom'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import BenefitCard from '../benefit-card'
import IngredientSkeleton from '../ingredient-skeleton'
import ProductsWithIngredientsRow from '../products-with-ingredient-row'

type Props = {
  id: string
}

export default function IngredientForm({ id }: Props) {
  const [ingredient, setIngredient] = useState<Ingredient | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchIngredient = async (id: string) => {
    const item = await getIngredient(id)
    setIngredient(item)
    setIsLoading(false)
    return item
  }

  useEffect(() => {
    fetchIngredient(id)
  }, [id])

  if (isLoading || !ingredient) {
    return <IngredientSkeleton />
  }

  return (
    <div className="flex-col flex w-full md:py-10 py-6">
      <div className="flex flex-col justify-center items-center gap-6 w-full">
        <Typography size="3xl" fontWeight="normal">
          {ingredient.name}
        </Typography>

        {ingredient.image && (
          <div className="relative">
            <Image
              src={ingredient.image || ''}
              alt={ingredient.name}
              width={400}
              height={400}
              className="rounded-lg"
            />
          </div>
        )}
      </div>

      <Typography size="base" fontWeight="normal" className="mt-6 text-center">
        {ingredient.description}
      </Typography>

      <div className="flex flex-col items-center w-full">
        <Typography size="base" fontWeight="normal" className="mt-6">
        ➜ Health guideline: {ingredient.health_guideline} {ingredient.measure}
      </Typography>
      <Typography size="base" fontWeight="normal" className="mt-6">
        ➜ Legal limit: {ingredient.legal_limit} {ingredient.measure}
        </Typography>
        </div>
   

        
      <div className="grid md:grid-cols-2 md:grid-rows-1 grid-rows-2 gap-4 mt-6">
        <BenefitCard title="Risks" description={ingredient.risks} />
        <BenefitCard title="Benefits" description={ingredient.benefits} />
      </div>

      {ingredient.sources && <Sources data={ingredient.sources} />}

      <ProductsWithIngredientsRow ingredientId={ingredient.id} ingredientName={ingredient.name} />
    </div>
  )
}
