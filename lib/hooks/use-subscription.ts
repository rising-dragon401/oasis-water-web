'use client'

import { getActiveProductsWithPrices, getSubscription } from '@/app/actions/user'
import { ProductWithPrices, SubscriptionWithProduct } from '@/types/custom'
import useSWR from 'swr'

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
