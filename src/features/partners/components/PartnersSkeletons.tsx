import { Skeleton } from '@/components/ui/skeleton'

export function PartnersTableSkeleton() {
    return (
        <div className="space-y-2 rounded-lg border p-4">
            {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="flex items-center gap-4">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16 ml-auto" />
                </div>
            ))}
        </div>
    )
}

export function PartnersFiltersSkeleton() {
    return (
        <div className="flex flex-col gap-3 rounded-lg border p-4 md:flex-row md:items-center">
            <Skeleton className="h-10 w-full md:w-64" />
            <Skeleton className="h-10 w-full md:w-44" />
            <Skeleton className="h-10 w-full md:w-44" />
            <Skeleton className="h-10 w-full md:w-44" />
            <Skeleton className="h-10 w-full md:w-32" />
        </div>
    )
}
