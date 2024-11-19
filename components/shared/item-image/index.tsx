import { PLACEHOLDER_IMAGE } from '@/lib/constants/images'
import Image from 'next/image'

type ItemImageProps = {
  src: string
  alt: string
  item: any
}

export default function ItemImage({ src, alt, item }: ItemImageProps) {
  return (
    <div className="relative h-full">
      <Image
        src={src}
        alt={alt}
        width={1000}
        height={1000}
        blurDataURL={src || PLACEHOLDER_IMAGE}
        placeholder="blur"
        className="rounded-2xl md:w-full md:h-full w-64 h-64 object-cover bg-card border border-border shadow-md"
        objectFit="contain"
      />
    </div>
  )
}
