'use client'

import { getSubscription, getActiveProductsWithPrices } from '@/app/actions/user'
import useSWR from 'swr'
import { SubscriptionWithProduct, ProductWithPrices } from '@/types/custom'

export default function useSubscription() {
  const { data: subscription } = useSWR<SubscriptionWithProduct | null>(
    'subscription',
    getSubscription
  )
  const { data: products } = useSWR<ProductWithPrices[] | null>(
    'products',
    getActiveProductsWithPrices
  )

  return {
    subscription: subscription,
    products: products,
  }
}
