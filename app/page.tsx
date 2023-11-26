import { SearchDialog } from '@/components/search-dialogue'
import SubpageLayout from '@/components/home-layout'
import Typography from '@/components/typography'
import BlogPreviewSection from '@/components/blog-preview-section'
import BasicSearch from '@/components/basic-search'

export default function Home() {
  return (
    <SubpageLayout>
      <div className="flex h-full flex-col justify-center pt-36 md:px-24">
        <div className="mb-14">
          <Typography size="5xl" fontWeight="bold">
            Do you know what&apos;s in your water?
          </Typography>
        </div>

        <BasicSearch />

        <div className="md:mt-56 mt-32  mb-32">
          <BlogPreviewSection />
        </div>
      </div>
    </SubpageLayout>
  )
}
