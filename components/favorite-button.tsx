'use client'

import { removeFavorite, addFavorite } from '@/app/actions/user'
import { mutate } from 'swr'
import React, { useMemo } from 'react'
import { Item, TapWaterLocation, WaterFilter } from '@/types/custom'
import { useUserProvider } from '@/providers/UserProvider'
import { TbCirclePlus, TbCircleCheckFilled } from 'react-icons/tb'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

type Props = {
  item: Item | TapWaterLocation | WaterFilter
  size?: number
}

export default function FavoriteButton({ item, size = 18 }: Props) {
  const { userFavorites, uid } = useUserProvider()
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

    mutate(`userFavorites`)
  }

  return (
    <Button variant="ghost" onClick={(e) => handleFavoriteClick(e)}>
      {isItemInFavorites ? (
        <TbCircleCheckFilled size={size} className="text-primary" />
      ) : (
        <TbCirclePlus size={size} className="text-primary" />
      )}
    </Button>
  )
}
