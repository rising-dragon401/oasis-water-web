import Typography from '@/components/typography'

export default function OasisDisclaimer() {
  return (
    <div className="bg-muted px-4 py-2 rounded-md border-secondary-foreground border mt-4">
      <Typography size="xs" fontWeight="normal" className="text-secondary">
        This report has not yet been independently tested by Oasis
      </Typography>
    </div>
  )
}
