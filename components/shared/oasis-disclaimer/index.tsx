import Typography from '@/components/typography'

export default function OasisDisclaimer() {
  return (
    <div className="bg-muted p-4 rounded-md border-secondary-foreground border mt-4">
      <Typography size="xs" fontWeight="normal" className="text-secondary">
        Important note: These results have not been internally verified by Oasis. All data is
        provided by the applicable company. Ratings are subject to drastically change based on new
        data / research.
      </Typography>
    </div>
  )
}
