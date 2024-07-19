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
    <div>
      <div className="pt-4 pb-2 flex flex-row justify-between items-center">
        <Typography size="3xl" fontWeight="normal">
          Scientific research
        </Typography>

        <Link href="/blog">
          <Typography size="base" fontWeight="normal" className="underline">
            read more
          </Typography>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 grid-cols-1 w-full gap-6">
        {sortedPosts.slice(0, 3).map((post) => (
          <article key={post._id}>
            <Link href={post.slug}>
              <div
                className="relative h-72 bg-cover bg-center rounded-lg overflow-hidden transform transition-transform duration-500 ease-in-out hover:-translate-y-2 hover:shadow-md flex flex-col justify-end hover:cursor-pointer"
                style={{
                  backgroundImage: `url(${post.image})`,
                }}
              >
                <div className="absolute inset-0 bg-black opacity-40"></div>
                <div className="relative p-5">
                  <Typography
                    size="xl"
                    fontWeight="normal"
                    className="text-stone-100 !no-underline h-14"
                  >
                    {post.title}
                  </Typography>

                  {/* <div className="md:block hidden">
                    <Typography size="base" fontWeight="normal" className="text-stone-100 ">
                      {post.description}
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
