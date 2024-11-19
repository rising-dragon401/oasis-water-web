'use client'

import { getBlogs } from '@/app/actions/blogs'
import SubpageLayout from '@/components/home-layout'
import Typography from '@/components/typography'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { H2, P } from '@/components/ui/typography'
import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import useSWR from 'swr'
import { getResearch } from '../actions/admin'

const fetcher = async () => {
  const blogs = await getBlogs()
  return blogs
}

export default function ResearchPage() {
  const { data: blogs, error } = useSWR('oasis-blogs', fetcher)
  const { data: studies, error: studiesError } = useSWR('oasis-studies', getResearch)

  return (
    <SubpageLayout>
      <div className="flex flex-col w-full md:px-0 px-4">
        <div className="pt-4 pb-8">
          <H2>Research</H2>
          <P>Stay up to date on the latest scientific research regarding product health</P>

          {/* <div className="md:w-[40vw] mt-4">
            <AISearchDialog size="medium" variant="input" placeholder="Ask Oasis Research" />
          </div> */}
        </div>
        <Tabs defaultValue="articles">
          <div className="md:!max-w-[80vw] max-w-[90vw] overflow-x-auto hide-scrollbar pb-2">
            <TabsList className="gap-2">
              <TabsTrigger value="articles">Posts</TabsTrigger>
              <TabsTrigger value="studies">Studies</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="articles">
            <div className="grid md:grid-cols-3 grid-cols-2 md:gap-8 gap-4 w-full">
              {blogs &&
                blogs.map((post) => (
                  <article key={post.id} className="flex flex-col h-full">
                    <Link
                      href={`/blog/${post.attributes.slug}`}
                      className="relative w-full md:h-64 h-40 rounded-lg overflow-hidden transform transition-transform duration-500 ease-in-out hover:-translate-y-2 hover:opacity-70"
                    >
                      <Image
                        src={post.cover}
                        alt={post.attributes.title}
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
                      {post.attributes.title}
                    </Typography>
                  </article>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="studies" className="grid grid-cols-1 gap-4 w-full">
            {studies &&
              studies.map((study) => (
                <a
                  href={study.file_url ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={study.id}
                  className="rounded-xl bg-card border border-border p-4 h-full transform transition-transform duration-500 ease-in-out hover:-translate-y-2 cursor-pointer block relative group"
                >
                  <P>{study.title}</P>
                  <P className="text-muted-foreground">
                    {new Date(study.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </P>
                  <ArrowUpRight className="w-4 h-4 text-secondary absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
          </TabsContent>
        </Tabs>
      </div>
    </SubpageLayout>
  )
}
