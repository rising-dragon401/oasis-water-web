import SubpageLayout from '@/components/home-layout'
import { PropsWithChildren } from 'react'

export default function BlogLayout({ children }: PropsWithChildren) {
  return (
    <SubpageLayout>
      <div className="md:px-8 px-2 py-3 md:flex justify-center flex-col items-center w-full overflow-hidden">
        {children}
      </div>
    </SubpageLayout>
  )
}
