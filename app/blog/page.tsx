import { allPosts } from '@/.contentlayer/generated'
import SubpageLayout from '@/components/home-layout'
import { AISearchDialog } from '@/components/shared/ai-search-dialogue'
import Typography from '@/components/typography'
import Image from 'next/image'
import Link from 'next/link'

export default function ResearchPage() {
  return (
    <SubpageLayout>
      <div className="flex flex-col w-full md:px-0 px-4">
        <div className="pt-4 pb-8">
          <Typography size="3xl" fontWeight="normal">
            Latest research
          </Typography>
          <Typography size="lg" fontWeight="normal" className="text-secondary">
            Stay up to date on the latest scientific research regarding product health
          </Typography>

          <div className="md:w-[40vw] mt-4">
            <AISearchDialog size="medium" variant="input" placeholder="Ask Oasis AI" />
          </div>
        </div>

        <div className="grid md:grid-cols-3 grid-cols-2 md:gap-8 gap-4 w-full">
          {allPosts
            .filter((post) => post?.is_research)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((post) => (
              <article key={post._id}>
                <Link
                  href={post.slug}
                  className="relative w-full md:h-64 h-40 items-end bg-cover bg-center rounded-lg overflow-hidden transform transition-transform duration-500 ease-in-out hover:-translate-y-2 hover:opacity-70"
                >
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={500}
                    height={384}
                    className="w-full md:h-64 h-40 object-cover rounded-lg"
                  />
                  <Typography
                    size="lg"
                    fontWeight="normal"
                    className="text-stone-800 !no-underline h-14 mt-1"
                  >
                    {post.title}
                  </Typography>
                </Link>
              </article>
            ))}
        </div>
      </div>
    </SubpageLayout>
  )
}
