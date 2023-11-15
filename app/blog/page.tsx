import { allPosts } from '@/.contentlayer/generated'
import Link from 'next/link'
import SubpageLayout from '@/components/home-layout'
import Typography from '@/components/typography'

export default function Home() {
  return (
    <SubpageLayout>
      <div className="px-8">
        <div className="pt-4 pb-8">
          <Typography size="3xl" fontWeight="bold">
            Blog
          </Typography>
        </div>

        <div className="grid grid-cols-2 gap-10">
          {allPosts.map((post) => (
            <article key={post._id}>
              <Link href={post.slug}>
                <div
                  className="relative max-w-lg h-72 bg-cover bg-center rounded-lg overflow-hidden transform transition-transform duration-500 ease-in-out hover:-translate-y-2"
                  style={{
                    backgroundImage: `url(${post.image})`,
                  }}
                >
                  <div className="absolute inset-0 bg-black opacity-30"></div>
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
    </SubpageLayout>
  )
}
