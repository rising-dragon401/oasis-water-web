'use client'

import Score from '@/components/shared/score'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'
import ReactMarkdown from 'react-markdown'

const components = {
  img: ({ src, alt }: { src: string; alt: string }) => (
    <Image src={src} alt={alt} width={800} height={600} layout="responsive" />
  ),
  a: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link href={href}>{children}</Link>
  ),
  h1: ({ children }: { children: React.ReactNode }) => (
    <h1 className="mt-2 mb-4 text-3xl font-bold">{children}</h1>
  ),
  h2: ({ children }: { children: React.ReactNode }) => (
    <h2 className="mt-2 mb-3 text-xl font-semibold">{children}</h2>
  ),
  button: Button,
  Score,
}

interface MdxProps {
  content: string
}

export function Mdx({ content }: MdxProps) {
  // add ids to headings to allow jump
  useEffect(() => {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    headings.forEach((heading) => {
      const text = heading.textContent?.toLowerCase().replace(/\s+/g, '-')
      if (text) {
        heading.id = text
      }
    })
  }, [])

  // @ts-ignore
  return <ReactMarkdown components={components}>{content}</ReactMarkdown>
}
