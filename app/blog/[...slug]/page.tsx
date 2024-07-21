import { getSubscription } from '@/app/actions/user'
import { Mdx } from '@/components/mdx-components'
import Typography from '@/components/typography'
import { Button } from '@/components/ui/button'
import { BLOG_IMAGE } from '@/lib/constants/images'
import { createSupabaseServerClient } from '@/utils/supabase/server'
import { allPosts } from 'contentlayer/generated'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface PostProps {
  params: {
    slug: string[]
  }
}

async function getPostFromParams(params: PostProps['params']) {
  const slug = params?.slug?.join('/')
  const post = allPosts.find((post) => post.slugAsParams === slug)

  if (!post) {
    null
  }

  return post
}

export async function generateMetadata({ params }: PostProps): Promise<Metadata> {
  const post = await getPostFromParams(params)

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
          url: post.image || BLOG_IMAGE,
          width: 800,
          height: 600,
        },
        {
          url: post.image || BLOG_IMAGE,
          width: 1800,
          height: 1600,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      creator: '@tellmaia_to',
      images: [post.image || BLOG_IMAGE],
    },
  }
}

export async function generateStaticParams(): Promise<PostProps['params'][]> {
  return allPosts.map((post) => ({
    slug: post.slugAsParams.split('/'),
  }))
}

export default async function PostPage({ params }: PostProps) {
  const post = await getPostFromParams(params)

  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.auth.getUser()

  const uid = data?.user?.id

  const subscription = await getSubscription(uid || null)

  if (!post) {
    notFound()
  }

  return (
    <article className="pt-6 prose pb-20">
      <Typography size="4xl" fontWeight="normal" className="mb-2">
        {post.title}
      </Typography>
      <div className="rounded-lg">
        <Image src={post.image} alt={post.title} width={500} height={500} className="rounded-lg" />
      </div>
      {post.description && (
        <Typography size="base" fontWeight="normal" className="mb-2 text-secondary">
          {post.description}
        </Typography>
      )}

      {subscription ? (
        <Mdx code={post.body.code} />
      ) : (
        <div className="flex flex-col">
          <Link href="/oasis-member" className="no-underline">
            <Button variant="outline" className="no-underline">
              Become an Oasis Member to continue reading
            </Button>
          </Link>
          <div className="filter blur-md overflow-hidden ">
            <Mdx code={post.body.code} />
          </div>
        </div>
      )}
    </article>
  )
}
