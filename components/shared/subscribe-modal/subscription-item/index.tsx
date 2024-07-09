import Typography from '@/components/typography'

export const SubscriptionItem = ({ label, icon }: { label: string; icon: React.ReactNode }) => {
  return (
    <div className="flex items-center gap-2">
      <Typography size="xl" fontWeight="medium">
        {icon}
      </Typography>
      <Typography size="base" fontWeight="medium">
        {label}
      </Typography>
    </div>
  )
}
