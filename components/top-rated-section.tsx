import Link from 'next/link'
import Typography from '@/components/typography'
import React, { useMemo } from 'react'
import { Item } from '@/types/custom'

type Props = {
  items: Item[] | null
}

export default function TopRatedSection({ items }: Props) {
  const topItems = useMemo(() => {
    return items?.sort((a, b) => (b.score || 0) - (a.score || 0))
  }, [items])

  return (
    <div>
      <div className="pt-4 pb-8 flex flex-row justify-between">
        <Typography size="2xl" fontWeight="normal">
          Highest rated
        </Typography>

        <Link href="/bottled-water" className="underline italic text-primary">
          see all
        </Link>
      </div>

      <div className="grid md:grid-cols-3 grid-cols-1 w-full gap-6">
        {topItems &&
          topItems?.slice(0, 3).map((item) => (
            <article key={item.id}>
              <Link href={`/item/${item.name.toLowerCase().replace(/ /g, '-')}?id=${item.id}`}>
                <div
                  className="relative h-72 bg-cover bg-center rounded-lg overflow-hidden transform transition-transform duration-500 ease-in-out hover:-translate-y-2 hover:shadow-md flex flex-col justify-end hover:cursor-pointer"
                  style={{
                    backgroundImage: `url(${item.image})`,
                  }}
                >
                  <div className="absolute inset-0 bg-black opacity-40"></div>
                  <div className="relative p-5">
                    <Typography
                      size="xl"
                      fontWeight="normal"
                      className="text-stone-100 !no-underline"
                    >
                      {item.name}
                    </Typography>

                    {/* <div className="md:block hidden h-10 overflow-hidden text-ellipsis whitespace-nowrap">
                      <Typography size="base" fontWeight="normal" className="text-stone-100 ">
                        {item.description}
                      </Typography>
                    </div> */}
                  </div>
                </div>
              </Link>
            </article>
          ))}
      </div>
    </div>
  )
}
