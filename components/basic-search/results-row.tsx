import { Ingredient, Item, TapWaterLocation, WaterFilter } from '@/types/custom'
import { determineLink } from '@/utils/helpers'
import { Atom, Building, Droplet, Filter, Milk, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { P } from '../ui/typography'

type ExtendedType = {
  type?: string
}

type Props = {
  itemResult:
    | (Item & ExtendedType)
    | (TapWaterLocation & ExtendedType)
    | (WaterFilter & ExtendedType)
    | (Ingredient & ExtendedType)
  setItem?: (item: any) => void
}

export default function ResultsRow({ itemResult, setItem }: Props) {
  const getIcon = () => {
    if (itemResult.type === 'tap_water') {
      return <Droplet className="text-secondary-foreground" />
    } else if (itemResult.type === 'filter') {
      return <Filter className="text-secondary-foreground" />
    } else if (itemResult.type === 'ingredient') {
      return <Atom className="text-secondary-foreground" />
    } else if (itemResult.type === 'company') {
      return <Building className="text-secondary-foreground" />
    } else if (itemResult.type === 'user') {
      return <User className="text-secondary-foreground" />
    } else {
      return <Milk className="text-secondary-foreground" />
    }
  }

  //  @ts-ignore
  const image = itemResult.image || itemResult.image_url || ''

  //  @ts-ignore
  if (itemResult.type === 'user' && !itemResult?.username) {
    return null
  }

  return (
    <Link
      className="flex flex-row gap-2 px-2 py-1 justify-between items-center hover:bg-muted rounded-md"
      href={determineLink(itemResult)}
      onClick={(e) => {
        if (setItem) {
          e.stopPropagation()
          e.preventDefault()
          setItem(itemResult)
        }
      }}
    >
      <div className="flex flex-row gap-2 items-center">
        <Image
          src={image}
          alt={itemResult.name || ''}
          width={50}
          height={50}
          quality={40}
          blurDataURL={image}
          placeholder={image ? 'blur' : 'empty'}
          className="rounded-md h-10 w-10 object-cover"
        />
        <P className="max-w-64 overflow-hidden line-clamp-2 md:text-base text-sm leading-tight sm:text-sm sm:leading-snug">
          {itemResult.name}
        </P>
      </div>

      {/* {getIcon()} */}
    </Link>
  )
}
