'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useMDXComponent } from 'next-contentlayer/hooks'
import Score from '@/components/shared/score'
import { useEffect } from 'react'

const components = {
  Image,
  Link,
  Button,
  Score,
}

interface MdxProps {
  code: string
}

export function Mdx({ code }: MdxProps) {
  const Component = useMDXComponent(code)

  // add ids to headings to allow jump
  useEffect(() => {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    headings.forEach((heading) => {
      const id = (heading as HTMLElement).innerText.toLowerCase().replace(/\s+/g, '-')
      heading.id = id
    })
  }, [])

  return <Component components={components} />
}
