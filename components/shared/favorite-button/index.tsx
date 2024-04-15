'use client'

import { addFavorite, removeFavorite } from '@/app/actions/user'
import { Button } from '@/components/ui/button'
import { useUserProvider } from '@/providers/UserProvider'
import { Item, TapWaterLocation, WaterFilter } from '@/types/custom'
import { CheckCircle, PlusCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useMemo } from 'react'

type Props = {
  item: Item | TapWaterLocation | WaterFilter
  size?: number
}

export default function FavoriteButton({ item, size = 18 }: Props) {
  const { userFavorites, uid, fetchUserFavorites } = useUserProvider()

  const router = useRouter()

  const isItemInFavorites = useMemo(
    () =>
      userFavorites &&
      userFavorites.some(
        (favorite) => favorite && favorite.id === item.id && favorite.type === item.type
      ),
    [userFavorites, item]
  )

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()

    // first check if user is logged in
    if (!uid) {
      router.push('/auth/signin')
      return
    }

    if (userFavorites && userFavorites.length === 0) {
      console.log('add item to favorites')
      addFavorite(uid, item.type, item.id)
      return
    }

    if (isItemInFavorites) {
      // Remove item from favorites
      console.log('remove item from favorites')
      removeFavorite(uid, item.type, item.id)
    } else {
      // Add item to favorites
      console.log('add item to favorites')
      addFavorite(uid, item.type, item.id)
    }

    fetchUserFavorites()
  }

  return (
    <Button variant="ghost" onClick={(e) => handleFavoriteClick(e)}>
      {isItemInFavorites ? (
        <CheckCircle size={size} className="text-primary" />
      ) : (
        <PlusCircle size={size} className="text-primary" />
      )}
    </Button>
  )
}
