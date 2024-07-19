import { allPosts } from '@/.contentlayer/generated'
import SubpageLayout from '@/components/home-layout'
import { AISearchDialog } from '@/components/shared/ai-search-dialogue'
import Typography from '@/components/typography'
import Link from 'next/link'

export default function ResearchPage() {
  return (
    <SubpageLayout>
      <div className="flex flex-col w-full md:px-0 px-4">
        <div className="pt-4 pb-8">
          <Typography size="3xl" fontWeight="normal">
            Scientific studies
          </Typography>
          <Typography size="lg" fontWeight="normal" className="text-secondary">
            Stay up to date on the latest scientific research regarding product health
          </Typography>

          <div className="md:w-[40vw]">
            <AISearchDialog size="medium" variant="input" placeholder="Ask Oasis AI" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 w-full">
          {allPosts
            .filter((post) => post?.is_research)
            .map((post) => (
              <article key={post._id}>
                <Link href={post.slug}>
                  <div
                    className="relative w-full h-40 bg-cover bg-center rounded-lg overflow-hidden transform transition-transform duration-500 ease-in-out hover:-translate-y-2"
                    style={{
                      backgroundImage: `url(${post.image})`,
                    }}
                  >
                    <div className="absolute inset-0 bg-black opacity-30"></div>
                    <div className="relative p-5">
                      <Typography
                        size="xl"
                        fontWeight="normal"
                        className="text-stone-100 !no-underline h-14"
                      >
                        {post.title}
                      </Typography>

                      <Typography size="base" fontWeight="normal" className="text-stone-100 h-14">
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
