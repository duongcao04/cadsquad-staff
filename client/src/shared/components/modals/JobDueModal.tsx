'use client'

import { Link } from '@/i18n/navigation'
import { VietnamDateFormat } from '@/lib/dayjs'
import { useJobsDueOnDate } from '@/shared/queries'
import { Modal } from 'antd'
import { useTranslations } from 'next-intl'
import React from 'react'
import { JobCard } from '../../../app/(routes)/[locale]/(workspace)/profile/shared'

type Props = {
    isOpen: boolean
    onClose: () => void
    currentDate: string
}

function JobDueModal({ isOpen, onClose, currentDate }: Props) {
    const t = useTranslations()
    const { jobs, isLoading } = useJobsDueOnDate(currentDate)

    return (
        <Modal
            open={isOpen && Boolean(currentDate)}
            onCancel={onClose}
            title={
                <p className="text-xl font-semibold">
                    {t('jobDueOn')}{' '}
                    <span className="text-primary">
                        {VietnamDateFormat(currentDate)}
                    </span>
                </p>
            }
            width={{
                xs: '90%',
                sm: '80%',
                md: '70%',
                lg: '60%',
                xl: '60%',
                xxl: '60%',
            }}
            style={{ top: 80 }}
            footer={<></>}
        >
            <div className="py-8 space-y-5 border-t border-border">
                {jobs?.length ? (
                    jobs?.map((job) => {
                        return (
                            <JobCard
                                key={job.id}
                                data={job}
                                isLoading={isLoading}
                            />
                        )
                    })
                ) : (
                    <div className="py-12 flex flex-col items-center justify-center gap-2 text-text2">
                        <p className="text-base font-semibold">
                            {t('emptyDueOnToday')}
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
        </Modal>
    )
}
export default React.memo(JobDueModal)
