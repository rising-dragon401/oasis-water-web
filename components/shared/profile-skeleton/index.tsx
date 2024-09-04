import { Skeleton } from '@/components/ui/skeleton'

export default function ProfileSkeleton() {
  return (
    <>
      <div className="md:flex hidden flex-col items-center space-x-4 w-full pt-10">
        <div className="flex md:flex-row flex-col-reverse gap-6 w-full">
          <Skeleton className="flex h-56 w-72 rounded-full " />

          <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-row justify-between w-full">
              <div className="flex flex-col gap-4 w-64">
                <Skeleton className="h-8 w-full " />
                <Skeleton className="h-8 w-full " />
              </div>

              <Skeleton className="h-32 w-40 " />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mt-6 w-full !ml-0">
          <Skeleton className="h-72 w-full" />
          <Skeleton className="h-72 w-full" />
          <Skeleton className="h-72 w-full" />
        </div>
      </div>

      <div className="md:hidden flex flex-col items-center space-x-4 w-full pt-6 px-2">
        <div className="flex flex-row gap-6 w-full">
          <Skeleton className="flex h-44 w-44 rounded-full " />
          <div className="flex flex-col gap-4 w-32">
            <Skeleton className="h-8 w-full " />
            <Skeleton className="h-8 w-full " />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mt-6 w-full !ml-0">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    </>
  )
}
