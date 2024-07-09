import PaywallContent from '@/components/shared/paywall-content'
import Typography from '@/components/typography'
import { ArrowUpRight } from 'lucide-react'

export default function Sources({ data }: any) {
  return (
    <div className="flex flex-col gap-2 my-10">
      <Typography size="2xl" fontWeight="normal">
        Sources
      </Typography>
      <PaywallContent label="🔒" hideButton>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
          {data?.map((source: any) => (
            <div key={source.url} className="flex flex-row items-center gap-1">
              <a href={source.url} target="_blank" rel="noopener noreferrer">
                <Typography size="base" fontWeight="normal" className="text-secondary underline">
                  {source.label}
                </Typography>
              </a>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          ))}
        </div>
      </PaywallContent>
    </div>
  )
}
