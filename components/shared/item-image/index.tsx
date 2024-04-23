import Image from 'next/image'

type ItemImageProps = {
  src: string
  alt: string
}

export default function ItemImage({ src, alt }: ItemImageProps) {
  //  {
  //    item.score > 70 && (
  //      <Typography
  //        size="base"
  //        fontWeight="normal"
  //        className="absolute top-0 right-0 text-secondary-foreground text-center italic bg-card border-2 px-2 border-secondary-foreground rounded-full m-2"
  //      >
  //        Recommended
  //      </Typography>
  //    )
  //  }
  return (
    <Image
      src={src}
      alt={alt}
      width={1000}
      height={1000}
      blurDataURL={src || ''}
      placeholder="blur"
      className="rounded-lg md:w-[600px] md:h-full w-72 h-72 object-cover"
    />
  )
}
