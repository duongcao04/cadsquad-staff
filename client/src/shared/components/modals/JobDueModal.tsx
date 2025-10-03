'use client'

import React from 'react'

import { Modal } from 'antd'
import { useKeyboardShortcuts } from 'use-keyboard-shortcuts'
import { useJobsDueOnDate } from '@/shared/queries/useJob'
import { VietnamDateFormat } from '@/lib/dayjs'
import { JobCard } from '@/app/(routes)/[locale]/(dashboard)/profile'
import { Link } from '@/i18n/navigation'

type Props = {
    isOpen: boolean
    onClose: () => void
    currentDate: string
}

export default function JobDueModal({ isOpen, onClose, currentDate }: Props) {
    const { jobs } = useJobsDueOnDate(currentDate)

    useKeyboardShortcuts([
        {
            keys: ['escape'],
            onEvent: () => onClose(),
        },
    ])

    return (
        <Modal
            open={isOpen && Boolean(currentDate)}
            onCancel={onClose}
            title={
                <p className="text-xl font-semibold">
                    Job đến hạn trong ngày{' '}
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
                        return <JobCard key={job.id} data={job} />
                    })
                ) : (
                    <div className="py-12 flex flex-col items-center justify-center gap-2 text-text2">
                        <p className="text-base font-semibold">
                            No active job found
                        </p>
                        <p className="tracking-wide text-sm">
                            View all jobs{' '}
                            <Link
                                href={'/onboarding'}
                                className="link !underline"
                            >
                                here
                            </Link>
                        </p>
                    </div>
                )}
            </div>
        </Modal>
    )
}
