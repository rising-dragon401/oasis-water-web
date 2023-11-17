import Typography from '@/components/typography'

interface Props {
  numerator: number
}

export default function Score({ numerator }: Props) {
  return (
    <div>
      Oaisys score:
      <Typography size="3xl" fontWeight="normal" className="text-primary !y-0">
        {numerator} /100
      </Typography>
    </div>
  )
}
