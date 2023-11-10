import { SearchDialog } from '@/components/SearchDialog'
import SubpageLayout from '@/components/home-layout'
import Typography from '@/components/typography'

export default function Home() {
  return (
    <SubpageLayout>
      <div className="flex h-full flex-col justify-center py-28">
        <div className="mb-8">
          <Typography size="3xl" fontWeight="bold">
            Do you know what&apos;s in your water?
          </Typography>
        </div>
        <SearchDialog />
      </div>
    </SubpageLayout>
  )
}
