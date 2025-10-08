'use client'

import React from 'react'

import ProfileCard from './components/ProfileCard'
import { useJobsByStatusCode } from '@/shared/queries/useJob'
import { DefaultJobStatusCode } from '@/shared/enums/default-job-status-code.enum'
import JobCard from './components/cards/JobCard'
import { Link } from '@/i18n/navigation'
import PageHeading from '@/shared/components/layouts/PageHeading'
import { useTranslations } from 'next-intl'

export default function ProfilePage() {
    const t = useTranslations()
    const { jobs: inprogressJobs, isLoading: inprogressLoading } =
        useJobsByStatusCode(DefaultJobStatusCode.IN_PROGRESS)
    const { jobs: revisionJobs, isLoading: revisionLoading } =
        useJobsByStatusCode(DefaultJobStatusCode.REVISION)
    const { jobs: deliveredJobs, isLoading: deliveredLoading } =
        useJobsByStatusCode(DefaultJobStatusCode.DELIVERED)
    const activeJobs = [...(inprogressJobs ?? []), ...(revisionJobs ?? [])]

    return (
        <>
            <PageHeading title={t('profile')} />
            <div className="w-full pb-3 h-[calc(100%-54px)]">
                <div className="size-full grid grid-cols-4 gap-3">
                    {/* Left Panel - User Profile */}
                    <div
                        className="col-span-1 size-full rounded-lg bg-background px-4 py-2"
                        style={{
                            boxShadow:
                                'rgba(0, 0, 0, 0.014) 0px 6px 24px 0px, rgba(0, 0, 0, 0.014) 0px 0px 0px 1px',
                        }}
                    >
                        <ProfileCard />
                    </div>

                    {/* Right Panel - Job Dashboard */}
                    <div
                        className="col-span-3 w-full h-full overflow-y-auto rounded-lg bg-background"
                        style={{
                            boxShadow:
                                'rgba(0, 0, 0, 0.014) 0px 6px 24px 0px, rgba(0, 0, 0, 0.014) 0px 0px 0px 1px',
                        }}
                    >
                        <div className="relative">
                            <div className="sticky top-0 z-10 bg-background my-5 px-6 pb-4 pt-3 border-b border-text4 shadow-xs">
                                <div className="px-4 py-2.5 border rounded-lg border-text3 shadow-xs">
                                    <p className="text-lg font-medium">
                                        {t('activeJobs')} -{' '}
                                        <span className="text-text2 font-semibold tracking-wider">
                                            {activeJobs?.length}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            {activeJobs?.length ? (
                                <ul className="space-y-4 px-6 pb-10">
                                    {activeJobs.map((aJob) => {
                                        return (
                                            <JobCard
                                                key={aJob.id}
                                                data={aJob}
                                                isLoading={
                                                    inprogressLoading ||
                                                    revisionLoading
                                                }
                                            />
                                        )
                                    })}
                                </ul>
                            ) : (
                                <div className="py-12 flex flex-col items-center justify-center gap-2 text-text2">
                                    <p className="text-base font-semibold">
                                        {t('noActiveJobFound')}
                                    </p>
                                    <p className="tracking-wide text-sm">
                                        {t('viewAllJobs')}{' '}
                                        <Link
                                            href={'/project-center?tab=active'}
                                            className="link !underline"
                                        >
                                            {t('here')}
                                        </Link>
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="sticky top-0 pt-8 pb-4 z-10 px-5 bg-background">
                            <div className="flex items-center justify-start gap-4 pl-2">
                                <p className="font-medium text-text1p5 text-nowrap">
                                    {t('awaitingResponse')}
                                    <span className="pl-2 font-semibold text-text2">
                                        ({deliveredJobs?.length})
                                    </span>
                                </p>
                                <div className="bg-text3 h-[1px] w-full" />
                            </div>
                        </div>
                        {deliveredJobs?.length ? (
                            <ul className="mt-5 space-y-4 px-6 pb-10">
                                {deliveredJobs?.map((aJob) => {
                                    return (
                                        <JobCard
                                            key={aJob.id}
                                            data={aJob}
                                            isLoading={deliveredLoading}
                                        />
                                    )
                                })}
                            </ul>
                        ) : (
                            <div className="py-12 flex flex-col items-center justify-center gap-2 text-text2">
                                <p className="text-base font-semibold">
                                    {t('noAwaitingResponseFound')}
                                </p>
                                <p className="tracking-wide text-sm">
                                    {t('viewAllJobs')}{' '}
                                    <Link
                                        href={'/project-center?tab=active'}
                                        className="link !underline"
                                    >
                                        {t('here')}
                                    </Link>
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
