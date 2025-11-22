import { CopyButton } from '@/shared/components'
import { envConfig } from '@/lib/config'
import { Job } from '@/shared/interfaces'
import { useProfile } from '@/lib/queries'
import { Button, Tooltip } from '@heroui/react'
import { X } from 'lucide-react'
import { useLocale } from 'next-intl'
import React from 'react'
import { useTranslations } from 'use-intl'
import { ActionsDropdown } from './dropdowns'

type Props = {
    closeModal?: () => void
    data: Job
    isEditJobName: boolean
    setEditJobName: React.Dispatch<React.SetStateAction<boolean>>
}
export function JobDetailActions({
    closeModal,
    data,
    isEditJobName,
    setEditJobName,
}: Props) {
    const locale = useLocale()
    const t = useTranslations()
    const { isAdmin } = useProfile()

    return (
        <div className="w-full flex items-center justify-end gap-2">
            {isAdmin && !isEditJobName && (
                <Button
                    size="sm"
                    variant="solid"
                    className="bg-text-muted"
                    onPress={() => setEditJobName(true)}
                >
                    <p className="text-sm font-medium">{t('edit')}</p>
                </Button>
            )}
            <Tooltip content={t('copyLink')}>
                <CopyButton
                    slot="p"
                    content={
                        envConfig.NEXT_PUBLIC_URL +
                        `/${locale}/` +
                        `project-center?detail=${data?.no}`
                    }
                    variant="ghost"
                    suppressHydrationWarning
                />
            </Tooltip>
            <Tooltip content="Actions">
                <ActionsDropdown
                    data={data as Job}
                    jobNo={data?.no as string}
                />
            </Tooltip>
            <Tooltip content={t('closePanel')} color="danger">
                <Button
                    variant="light"
                    color="danger"
                    className="flex items-center justify-center"
                    size="sm"
                    isIconOnly
                    onPress={() => {
                        closeModal?.()
                    }}
                >
                    <X size={18} className="text-text-subdued" />
                </Button>
            </Tooltip>
        </div>
    )
}
