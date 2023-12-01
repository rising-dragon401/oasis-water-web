import Typography from '@/components/typography'

export default function Sources({ data }: any) {
  return (
    <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
      {data.map((source: any) => (
        <div key={source.url} className="flex flex-col gap-2">
          <a href={source.url} target="_blank" rel="noopener noreferrer">
            <Typography size="base" fontWeight="normal" className="text-secondary underline">
              {source.label}
            </Typography>
          </a>
        </div>
      ))}
    </div>
  )
}
