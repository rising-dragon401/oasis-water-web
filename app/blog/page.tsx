import { allPosts } from '@/.contentlayer/generated'
import SubpageLayout from '@/components/home-layout'
import { AISearchDialog } from '@/components/shared/ai-search-dialogue'
import Typography from '@/components/typography'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { getResearch } from '../actions/admin'

export default async function ResearchPage() {
  const studies = await getResearch()

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
        <Tabs defaultValue="articles">
          <div className="md:!max-w-[80vw] max-w-[90vw] overflow-x-auto hide-scrollbar pb-2">
            <TabsList>
              <TabsTrigger value="articles">Articles</TabsTrigger>
              <TabsTrigger value="studies">Studies</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="articles">
            <div className="grid md:grid-cols-3 grid-cols-2 md:gap-8 gap-4 w-full">
              {allPosts
                .filter((post) => post?.is_research)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((post) => (
                  <article key={post._id} className="flex flex-col h-full">
                    <Link
                      href={post.slug}
                      className="relative w-full md:h-64 h-40 rounded-lg overflow-hidden transform transition-transform duration-500 ease-in-out hover:-translate-y-2 hover:opacity-70"
                    >
                      <Image
                        src={post.image}
                        alt={post.title}
                        width={500}
                        height={384}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </Link>
                    <Typography
                      size="lg"
                      fontWeight="normal"
                      className="text-stone-800 !no-underline mt-2 line-clamp-2"
                    >
                      {post.title}
                    </Typography>
                  </article>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="studies" className="grid md:grid-cols-3 grid-cols-2 gap-4 w-full">
            {studies.map((study) => (
              <a
                href={study.file_url ?? '#'}
                target="_blank"
                rel="noopener noreferrer"
                key={study.id}
                className="rounded-xl bg-muted p-4 h-full transform transition-transform duration-500 ease-in-out hover:-translate-y-2 cursor-pointer block relative group"
              >
                <Typography size="base" fontWeight="normal" className="pr-6 line-clamp-5">
                  {study.title}
                </Typography>
                <ArrowUpRight className="w-4 h-4 text-secondary absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </SubpageLayout>
  )
}
