import { Skeleton } from '@/components/ui/skeleton'

export default function ItemCardSkeleton() {
  return (
    <div className="flex flex-col items-center space-x-4 w-full">
      <Skeleton className="lg:h-72 lg:w-72 md:w-64 md:h-64 w-44 h-44" />

      <div className="flex flex-row items-center justify-between w-full mt-2">
        <div className="flex flex-col gap-y-1 flex-grow">
          <Skeleton className="h-4 w-full " />
          <Skeleton className="h-4 w-full " />
        </div>

        <Skeleton className="md:h-14 md:w-14 w-10 h-10  rounded-full shrink-0 ml-4" />
      </div>
    </div>
  )
}
