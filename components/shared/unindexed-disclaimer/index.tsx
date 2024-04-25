import Typography from '@/components/typography'

export default function UnindexedDisclaimer() {
  return (
    <>
      <Typography size="base" fontWeight="normal" className="text-secondary">
        ⚠️ NO REPORTS LOCATED – PROCEED WITH CAUTION.
      </Typography>
      <div className="flex flex-col gap-6 mt-6">
        <Typography size="base" fontWeight="normal" className="text-secondary">
          This item has not been tested or rated yet. This usally means the company has not
          publicized or refuses to share their lab reports so we cannot recommend or provide a score
          for this item.
        </Typography>
      </div>
    </>
  )
}
