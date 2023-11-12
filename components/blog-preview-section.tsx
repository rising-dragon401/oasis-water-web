import { allPosts } from '@/.contentlayer/generated'
import Link from 'next/link'
import SubpageLayout from '@/components/home-layout'
import Typography from '@/components/typography'

export default function BlogPreviewSection() {
  return (
    <div>
      <div className="pt-4 pb-8">
        <Typography size="3xl" fontWeight="normal">
          Recent Posts
        </Typography>
      </div>

      <div className="grid md:grid-cols-3 grid-cols-2 w-full">
        {allPosts.map((post) => (
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
                    className="text-stone-100 !no-underline"
                  >
                    {post.title}
                  </Typography>

                  <Typography size="base" fontWeight="normal" className="text-stone-100">
                    {post.description}
                  </Typography>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}
