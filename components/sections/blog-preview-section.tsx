import { allPosts } from '@/.contentlayer/generated'
import Typography from '@/components/typography'
import Link from 'next/link'
import { useMemo } from 'react'

export default function BlogPreviewSection() {
  const sortedPosts = useMemo(() => {
    return allPosts
      .filter((post) => post.is_research !== false)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row justify-between items-center">
        <Typography size="3xl" fontWeight="normal">
          New research
        </Typography>

        <Link href="/blog">
          <Typography size="base" fontWeight="normal" className="underline">
            read more
          </Typography>
        </Link>
      </div>

      <div className="w-full">
        <div className="left-0 right-0 overflow-x-auto hide-scrollbar ">
          <div className="flex flex-nowrap gap-2 pb-4 ">
            {sortedPosts.slice(0, 3).map((post) => (
              <article key={post._id}>
                <Link href={post.slug}>
                  <div
                    className="relative w-[200px] md:w-[360px] h-full md:h-[284px] bg-cover bg-center rounded-lg overflow-hidden transform transition-transform duration-500 ease-in-out hover:-translate-y-2 hover:shadow-md flex flex-col justify-end hover:cursor-pointer"
                    style={{
                      backgroundImage: `url(${post.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    <div className="absolute inset-0 bg-black opacity-40 rounded-lg"></div>
                    <div className="relative px-4 py-2">
                      <Typography
                        size="lg"
                        fontWeight="normal"
                        className="text-stone-100 !no-underline md:h-14"
                      >
                        {post.title}
                      </Typography>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
