import { Skeleton } from '@/components/ui/skeleton'

export default function ItemSkeleton() {
  return (
    <div className="flex flex-col items-center space-x-4 w-full pt-10">
      {/* <Skeleton className="h-12 w-12 rounded-full" /> */}
      <div className="flex md:flex-row flex-col-reverse gap-6 w-full">
        <Skeleton className="h-32 w-full bg-secondary-foreground" />
        <Skeleton className="h-32 w-full bg-secondary-foreground" />
        <Skeleton className="flex h-32 md:w-full  w-32 rounded-full bg-secondary-foreground" />
      </div>

      <div className="grid grid-cols-2 gap-6 mt-6 w-full !ml-0">
        <Skeleton className="h-14 w-full bg-secondary-foreground" />
        <Skeleton className="h-14 w-full bg-secondary-foreground" />
      </div>

      <div className="flex mt-6 w-full !ml-0">
        <Skeleton className="h-60 w-full bg-secondary-foreground" />
      </div>
    </div>
  )
}
