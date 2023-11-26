import { Item } from '@/types/custom'
import Image from 'next/image'
import Typography from '@/components/typography'
import Link from 'next/link'

type Props = {
  itemResult: Item
}

export default function ResultsRow({ itemResult }: Props) {
  return (
    <Link
      className="flex flex-row gap-2  px-2 py-1 justify-start items-center"
      href={`/item/${itemResult.id}`}
    >
      <Image src={itemResult.image || ''} alt={itemResult.name} width={50} height={50} />
      <Typography size="base" fontWeight="normal">
        {itemResult.name}
      </Typography>
    </Link>
  )
}
