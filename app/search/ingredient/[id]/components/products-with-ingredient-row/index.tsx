'use client'

import { getItemsWithIngredient } from '@/app/actions/items'
import { useEffect, useState } from 'react'
import Typography from '@/components/typography'
import ItemPreviewCard from '@/components/item-preview-card'

type Props = {
  ingredientId: number
  ingredientName: string
}

export default function ProductsWithIngredientsRow({ ingredientId, ingredientName }: Props) {
  const [products, setProducts] = useState<any>([])

  const fetchProducts = async () => {
    const items = await getItemsWithIngredient(ingredientId)
    if (items) {
      setProducts(items)
    }
  }

  useEffect(() => {
    fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="mb-10">
      <div className="pt-14 flex flex-row justify-between">
        <Typography size="2xl" fontWeight="normal">
          Items with {ingredientName}
        </Typography>
      </div>

      <div className="flex overflow-x-auto gap-6 hide-scrollbar">
        {products &&
          products.map((item: any) => (
            <div key={item.id} className="flex-shrink-0" style={{ minWidth: '20%' }}>
              <ItemPreviewCard item={item} />
            </div>
          ))}
      </div>
    </div>
  )
}
