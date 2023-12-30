'use client'

import { removeFavorite, addFavorite } from '@/app/actions/user'
import { mutate } from 'swr'
import React, { useMemo } from 'react'
import { Item, TapWaterLocation, Filter } from '@/types/custom'
import useUser from '@/lib/hooks/use-user'
import { FaHeart, FaRegHeart } from 'react-icons/fa6'
import { Button } from '@/components/ui/button'

type Props = {
  item: Item | TapWaterLocation | Filter
}

export default function FavoriteButton({ item }: Props) {
  const { uid, userFavorites } = useUser()

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
        <FaHeart size={18} className="text-primary" />
      ) : (
        <FaRegHeart size={18} className="text-primary" />
      )}
    </Button>
  )
}
