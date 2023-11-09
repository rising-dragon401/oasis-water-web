import { allPosts } from '@/.contentlayer/generated'
import Link from 'next/link'
import SubpageLayout from '@/components/home-layout'
import Typography from '@/components/typography'

export default function Home() {
  return (
    <SubpageLayout>
      <div className="pt-4 pb-8">
        <Typography size="3xl" fontWeight="bold">
          Blog
        </Typography>
      </div>

      <div className="prose dark:prose-invert min-h-[60vh] grid grid-cols-1">
        {allPosts.map((post) => (
          <article key={post._id}>
            <Link href={post.slug}>
              <div
                className="relative bg-cover bg-center rounded-lg overflow-hidden transform transition-transform duration-500 ease-in-out hover:-translate-y-2"
                style={{
                  backgroundImage: `url(${post.image})`,
                }}
              >
                <div className="absolute inset-0 bg-black opacity-30"></div>
                <div className="relative p-5">
                  <h2 className="text-white">{post.title}</h2>
                  {post.description && <p className="text-white">{post.description}</p>}
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </SubpageLayout>
  )
}
