'use client'

import { getBlogs } from '@/app/actions/blogs'
import Typography from '@/components/typography'
import Image from 'next/image'
import Link from 'next/link'
import useSWR from 'swr'

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
          New research
        </Typography>

        <Link href="/blog">
          <Typography size="base" fontWeight="normal" className="italic">
            read more
          </Typography>
        </Link>
      </div>

      <div className="w-full">
        <div className="left-0 right-0 overflow-x-auto hide-scrollbar ">
          <div className="flex flex-nowrap gap-6 pb-4">
            {blogs &&
              blogs.slice(0, 4).map((post) => (
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
                      className="text-stone-800 !no-underline flex mt-1"
                    >
                      {post.attributes.title}
                    </Typography>
                  </Link>
                </article>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
