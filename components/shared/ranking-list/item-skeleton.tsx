import { Skeleton } from '@/components/ui/skeleton'

export default function ItemSkeleton() {
  return (
    <div className="flex flex-col items-center space-x-4 w-full">
      <Skeleton className="lg:h-80 lg:w-80 md:w-72 md:h-72 w-48 h-48  bg-indigo-200" />
      <div className="flex flex-row items-center justify-between w-full mt-2 !ml-0">
        <div className="flex flex-col gap-y-1 !pl-0">
          <Skeleton className="h-4 w-32 bg-indigo-200" />
          <Skeleton className="h-4 w-32 bg-indigo-200" />
        </div>

        <Skeleton className="h-14 w-14 bg-indigo-200 rounded-full" />
      </div>
    </div>
  )
}
