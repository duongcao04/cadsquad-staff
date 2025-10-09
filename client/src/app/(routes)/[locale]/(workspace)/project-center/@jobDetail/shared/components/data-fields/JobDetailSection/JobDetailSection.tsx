'use client'

import { Job } from '@/shared/interfaces'
import { CommentForm } from '../../forms'
import { ActivityPanel, JobDetailPanel } from '../../panels'
import { Description } from '../Description'
import { CostView } from './CostView'

type Props = {
    data?: Job
    isLoading?: boolean
}
export function JobDetailSection({ data, isLoading = false }: Props) {
    return (
        <>
            <CostView data={data} isLoading={isLoading} />
            <hr className="text-text3 my-5" />
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 w-full space-y-2.5">
                    <Description data={data as Job} isLoading={isLoading} />
                    <hr className="text-text3" />
                    <div className="px-1.5">
                        <ActivityPanel
                            data={data as Job}
                            isLoading={isLoading}
                        />
                    </div>
                    <hr className="text-text3 mx-auto max-w-[60%]" />
                    <CommentForm jobId={data?.id as string} />
                </div>
                <div className="col-span-1 w-full">
                    <div className="sticky top-[20px]">
                        <JobDetailPanel
                            data={data as Job}
                            isLoading={isLoading}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
