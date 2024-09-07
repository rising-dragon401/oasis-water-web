'use server'

import { getActiveProductsWithPrices } from '@/app/actions/user'
import { ProductWithPrices } from '@/types/custom'
import PaywallBlock from './components'

export default async function PaywallBlockWrapper() {
  const products = await getActiveProductsWithPrices().then(
    (products: ProductWithPrices[]) => products
  )

  const proProduct = products?.find(
    (product: any) => product.name === process.env.NEXT_PUBLIC_PRO_STRIPE_PRICE_NAME
  )

  const proPriceAnnual =
    proProduct?.prices.find(
      (price: any) => price.id === process.env.NEXT_PUBLIC_PRO_STRIPE_PRICE_ID_ANNUAL
    ) ?? null

  return (
    <div className="flex flex-col">
      <PaywallBlock price={proPriceAnnual} />
    </div>
  )
}
