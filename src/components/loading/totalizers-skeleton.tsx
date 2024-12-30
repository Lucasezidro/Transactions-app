import { Skeleton } from '../ui/skeleton'

export function TotalizersSkeleton() {
  return (
    <div className="flex items-center gap-12 mt-16">
      <div className="w-[200px] h-[100px] border border-emerald-500 rounded-lg p-4 flex flex-col items-center justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="w-[200px] h-[100px] border border-red-500 rounded-lg p-4 flex flex-col items-center justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="w-[200px] h-[100px] border border-blue-500 rounded-lg p-4 flex flex-col items-center justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  )
}
