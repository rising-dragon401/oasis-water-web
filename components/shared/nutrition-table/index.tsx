import Typography from '@/components/typography'
import { NutrientDescriptor } from '@/types/custom'

type Props = {
  nutrients: NutrientDescriptor[]
}

export default function NutritionTable({ nutrients }: Props) {
  return (
    <div className="flex flex-col gap-1 border rounded-md py-2 px-4 max-w-lg">
      {nutrients &&
        nutrients?.map((nutrient: any) => (
          <div key={nutrient.id} className="flex flex-row  items-center justify-between">
            <Typography size="lg" fontWeight="normal" className="text-secondary">
              {nutrient.name}
            </Typography>
            <div className="flex flex-row gap-2">
              <Typography size="base" fontWeight="normal" className="text-secondary w-full">
                {nutrient.amount}
              </Typography>
              <Typography size="base" fontWeight="normal" className="text-secondary w-full">
                {nutrient.unit}
              </Typography>
            </div>
          </div>
        ))}
    </div>
  )
}
