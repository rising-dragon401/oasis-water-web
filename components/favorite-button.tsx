'use client'

import { removeFavorite, addFavorite } from '@/app/actions/user'
import { mutate } from 'swr'
import React, { useMemo } from 'react'
import { Item, TapWaterLocation, Filter } from '@/types/custom'
import useUser from '@/lib/hooks/use-user'
import { FaHeart, FaRegHeart } from 'react-icons/fa6'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

type Props = {
  item: Item | TapWaterLocation | Filter
  size?: number
}

export default function FavoriteButton({ item, size = 18 }: Props) {
  const { uid, userFavorites } = useUser()
  const router = useRouter()

  const isItemInFavorites = useMemo(
    () =>
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

    if (userFavorites.length === 0) {
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

    mutate(`userFavorites`)
  }

  return (
    <Button variant="ghost" onClick={(e) => handleFavoriteClick(e)}>
      {isItemInFavorites ? (
        <FaHeart size={size} className="text-primary" />
      ) : (
        <FaRegHeart size={size} className="text-primary" />
      )}
    </Button>
  )
}
