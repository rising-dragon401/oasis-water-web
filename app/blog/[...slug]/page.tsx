import { Mdx } from '@/components/mdx-components'
import Typography from '@/components/typography'
import { BLOG_IMAGE } from '@/lib/constants/images'
import { allPosts } from 'contentlayer/generated'
import { Metadata } from 'next'
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

  if (!post) {
    notFound()
  }

  return (
    <article className="pt-6 prose pb-20">
      <Typography size="4xl" fontWeight="normal" className="mb-2">
        {post.title}
      </Typography>
      {post.description && (
        <Typography size="base" fontWeight="normal" className="mb-2 text-secondary">
          {post.description}
        </Typography>
      )}

      <Mdx code={post.body.code} />
    </article>
  )
}
