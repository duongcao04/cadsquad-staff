'use client'

import { Job } from '@/shared/interfaces'

export const Description = ({}: { isLoading: boolean; data: Job }) => {
    return (
        // <div className="w-full">
        //     <Skeleton className="w-full h-fit rounded-md" isLoaded={!isLoading}>
        //         <button className="w-full pl-2 pr-3 py-1.5 rounded-lg hover:bg-background-muted flex items-center justify-between cursor-pointer">
        //             <p className="text-xs text-text-muted">Description</p>
        //             <Settings size={16} />
        //         </button>
        //     </Skeleton>
        //     <Skeleton
        //         className="pl-2 pr-3 mt-1 rounded-md"
        //         isLoaded={!isLoading}
        //     >
        //         <TextClamp>{data?.description}</TextClamp>
        //     </Skeleton>
        // </div>
        <></>
    )
}
