'use client'

import { getBlogs } from '@/app/actions/blogs'
import Typography from '@/components/typography'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import useSWR from 'swr'
import { Skeleton } from '../ui/skeleton'

const fetcher = async () => {
  const blogs = await getBlogs()
  return blogs
}

export default function BlogPreviewSection() {
  const { data: blogs, error } = useSWR('oasis-blogs', fetcher)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row justify-between items-center">
        <Typography size="2xl" fontWeight="normal">
          News and research
        </Typography>

        <Link href="/blog" className="flex flex-row items-center gap-x-2">
          <Typography size="base" fontWeight="normal" className="italic text-secondary">
            read more
          </Typography>
          <ArrowRight className="w-4 h-4 text-secondary" />
        </Link>
      </div>

      <div className="w-full">
        <div className="left-0 right-0 overflow-x-auto hide-scrollbar transition-all duration-500 ease-in-out">
          <div className="flex flex-nowrap gap-6 pb-4">
            {blogs
              ? blogs.slice(0, 4).map((post) => (
                  <article key={post.id}>
                    <Link
                      href={`/blog/${post.attributes.slug}`}
                      className="relative md:w-72 w-48 md:h-64 h-full bg-cover bg-center rounded-lg overflow-hidden transform transition-transform duration-500 ease-in-out hover:opacity-70 flex flex-col items-start justify-start"
                    >
                      <Image
                        src={post.cover}
                        alt={post.attributes.title}
                        width={500}
                        height={384}
                        className="w-full md:h-48 h-32 object-cover rounded-lg"
                      />
                      <Typography
                        size="base"
                        fontWeight="normal"
                        className="text-stone-800 !no-underline flex mt-1 line-clamp-2 overflow-hidden h-12"
                      >
                        {post.attributes.title.length > 48
                          ? `${post.attributes.title.substring(0, 48)}...`
                          : post.attributes.title}
                      </Typography>
                    </Link>
                  </article>
                ))
              : // Render loading skeletons
                Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="relative md:w-96 w-72 md:h-48 h-48 rounded-lg" />
                ))}
          </div>
        </div>
      </div>
    </div>
  )
}
