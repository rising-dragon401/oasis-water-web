import { Skeleton } from '@/components/ui/skeleton'

export default function AccountSkeleton() {
  return (
    <>
      <div className="flex flex-col items-center space-x-4 w-full pt-10">
        <div className="flex flex-col items-center w-full">
          <Skeleton className="flex h-24 w-24 rounded-full " />

          <div className="flex flex-col gap-2 w-64 mt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>

          <div className="flex flex-col gap-4 w-full mt-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    </>
  )
}
