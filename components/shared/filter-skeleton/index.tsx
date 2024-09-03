import { Skeleton } from '@/components/ui/skeleton'

export default function FilterSkeleton() {
  return (
    <>
      <div className="md:flex hidden flex-col items-center space-x-4 w-full pt-10">
        <div className="flex md:flex-row flex-col-reverse gap-6 w-full">
          <Skeleton className="flex h-64 w-96 rounded-md bg-secondary" />
          <div className="flex flex-col gap-4 w-full">
            <Skeleton className="h-32 w-full bg-secondary" />
            <div className="flex flex-row gap-4">
              <Skeleton className="h-12 w-full bg-secondary" />
              <Skeleton className="h-12 w-full bg-secondary" />
            </div>
            <div className="flex flex-row gap-4">
              <Skeleton className="h-12 w-full bg-secondary" />
              <Skeleton className="h-12 w-full bg-secondary" />
            </div>
          </div>
        </div>

        <div className="flex mt-6 w-full !ml-0">
          <Skeleton className="h-32 w-full bg-secondary" />
        </div>

        <div className="flex flex-col gap-6 mt-6 w-full !ml-0">
          <Skeleton className="h-10 w-full bg-secondary" />
          <Skeleton className="h-10 w-full bg-secondary" />
          <Skeleton className="h-10 w-full bg-secondary" />
        </div>
      </div>

      <div className="md:hidden flex flex-col items-center space-x-4 w-full pt-6">
        <Skeleton className="flex h-48 w-48 rounded-md bg-secondary mb-4" />

        <div className="flex md:flex-row flex-col-reverse gap-6 w-full">
          <div className="flex flex-col gap-4 w-full">
            <Skeleton className="h-20 w-full bg-secondary" />
            <div className="flex flex-row gap-4">
              <Skeleton className="h-12 w-full bg-secondary" />
              <Skeleton className="h-12 w-full bg-secondary" />
            </div>
            <div className="flex flex-row gap-4">
              <Skeleton className="h-12 w-full bg-secondary" />
              <Skeleton className="h-12 w-full bg-secondary" />
            </div>
          </div>
        </div>

        <div className="flex mt-6 w-full">
          <Skeleton className="h-32 w-full bg-secondary" />
        </div>

        <div className="flex flex-col gap-6 mt-6 w-full">
          <Skeleton className="h-10 w-full bg-secondary" />
          <Skeleton className="h-10 w-full bg-secondary" />
          <Skeleton className="h-10 w-full bg-secondary" />
        </div>
      </div>
    </>
  )
}
