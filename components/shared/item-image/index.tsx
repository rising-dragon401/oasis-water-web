import { PLACEHOLDER_IMAGE } from '@/lib/constants/images'
import Image from 'next/image'
import FavoriteButton from '../favorite-button'

type ItemImageProps = {
  src: string
  alt: string
  item: any
}

export default function ItemImage({ src, alt, item }: ItemImageProps) {
  return (
    <div className="relative">
      <Image
        src={src}
        alt={alt}
        width={1000}
        height={1000}
        blurDataURL={src || PLACEHOLDER_IMAGE}
        placeholder="blur"
        className="rounded-lg md:w-[600px] md:h-full w-64 h-64 object-cover"
      />
      <div className="absolute top-1 right-1">
        <FavoriteButton item={item} />
      </div>
    </div>
  )
}
