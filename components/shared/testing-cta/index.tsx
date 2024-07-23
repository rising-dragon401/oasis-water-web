import Typography from '@/components/typography'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function TestingCta() {
  return (
    <div className="flex flex-col gap-2 px-4 py-6 rounded-lg border bg-muted">
      <Typography size="2xl" fontWeight="normal">
        Test your water
      </Typography>
      <Typography size="base" fontWeight="normal">
        Order your own test kit to analyze the contaminants in your bottled or tap water.
      </Typography>
      <div className="w-full justify-start flex mt-4">
        <Link href="/lab-testing">
          <Button>Explore test kits</Button>
        </Link>
      </div>
    </div>
  )
}
