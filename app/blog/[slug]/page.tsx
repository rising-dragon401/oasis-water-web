import { getEntryBySlug } from '@/app/actions/blogs'
import { Mdx } from '@/components/mdx-components'
import Typography from '@/components/typography'
import { createSupabaseServerClient } from '@/utils/supabase/server'
import Image from 'next/image'

export async function generateMetadata({ params }: any): Promise<any> {
  const slug = params.slug

  const post = await getEntryBySlug(slug)

  if (!post) {
    return {}
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      images: [
        {
          url: post.cover,
          width: 800,
          height: 600,
        },
        {
          url: post.cover,
          width: 1800,
          height: 1600,
        },
      ],
    },
  }
}

export default async function PostPage({ params }: { params: any }) {
  const slug = params.slug

  const post = await getEntryBySlug(slug)

  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.auth.getUser()

  const uid = data?.user?.id

  // const subscription = await getSubscription(uid || null)

  if (!post) return null

  return (
    <article className="prose pb-20">
      <div className="rounded-lg overflow-hidden w-full max-w-3xl mx-auto aspect-[16/9]">
        <Image
          src={post.attributes.cover.data.attributes.url}
          alt={post.attributes.title}
          width={800}
          height={450}
          className="rounded-xl object-cover w-full h-full my-0"
        />
      </div>

      <Typography size="3xl" fontWeight="normal" className="mt-4 mb-6">
        {post.attributes.title}
      </Typography>

      {post?.attributes?.blocks.map((block: any, index: number) => {
        const content = <Mdx content={block.body} />

        if (index === 0 || index === post?.attributes?.blocks.length - 1) {
          return content
        }

        // if (index > 0 && !subscription) {
        //   return (
        //     <div key={index} className="relative">
        //       <PaywallBlock />
        //       <div className="blur-md pointer-events-none">{content}</div>
        //       <PaywallBlock />
        //     </div>
        //   )
        // }

        return content
      })}
    </article>
  )
}
