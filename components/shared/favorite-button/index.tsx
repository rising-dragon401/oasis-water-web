'use client'

import { addFavorite, calculateUserScore, removeFavorite } from '@/app/actions/user'
import { Button } from '@/components/ui/button'
import { useUserProvider } from '@/providers/UserProvider'
import { Item, TapWaterLocation, WaterFilter } from '@/types/custom'
import { CheckCircle, PlusCircle } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { toast } from 'sonner'

type Props = {
  item: Item | TapWaterLocation | WaterFilter
  size?: number
}

export default function FavoriteButton({ item, size = 18 }: Props) {
  const { userFavorites, uid, fetchUserFavorites } = useUserProvider()
  const router = useRouter()
  const pathname = usePathname()

  const [loadingFavorite, setLoadingFavorite] = React.useState(false)
  const [isItemInFavorites, setItemInFavorites] = React.useState(false)

  useEffect(() => {
    const favoriteExists =
      userFavorites?.some(
        (favorite) => favorite && favorite.id === item.id && favorite.type === item.type
      ) || false
    setItemInFavorites(favoriteExists)
  }, [userFavorites, item, setItemInFavorites])

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()

    // prevent spam clicking
    if (loadingFavorite) return

    setLoadingFavorite(true)

    // first check if user is logged in
    if (!uid) {
      toast('Please sign in to add items to your Oasis')
      router.push(`/auth/signin?redirectUrl=${pathname}`)
      return
    }

    if (userFavorites && userFavorites.length === 0) {
      console.log('add item to favorites')
      addFavorite(uid, item.type, item.id)
    } else {
      if (isItemInFavorites) {
        // Remove item from favorites
        console.log('remove item from favorites')
        setItemInFavorites(false)
        removeFavorite(uid, item.type, item.id)
      } else {
        // Add item to favorites
        console.log('add item to favorites')
        addFavorite(uid, item.type, item.id)
      }
    }

    // recalculate score and fetch updated favs
    calculateUserScore(uid)
    fetchUserFavorites(uid)

    setLoadingFavorite(false)
  }

  return (
    <Button variant="ghost" onClick={(e) => handleFavoriteClick(e)}>
      {isItemInFavorites ? (
        <CheckCircle size={size} className="text-primary w-6 h-6 " />
      ) : (
        <PlusCircle size={size} className="text-primary w-6 h-6" />
      )}
    </Button>
  )
}
