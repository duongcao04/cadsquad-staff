import { Button, Tooltip } from '@heroui/react'
import React from 'react'
import { CopyButton } from '@/shared/components/ui/copy-button'
import envConfig from '@/config/envConfig'
import { useLocale } from 'next-intl'
import { useTranslations } from 'use-intl'
import ActionsDropdown from './dropdowns/ActionsDropdown'
import { Job } from '@/shared/interfaces/job.interface'
import { X } from 'lucide-react'
import { useProfile } from '@/shared/queries/useAuth'

type Props = {
    closeModal?: () => void
    data?: Job
    isEditJobName: boolean
    setEditJobName: React.Dispatch<React.SetStateAction<boolean>>
}
export default function JobDetailActions({
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
                    className="bg-text3"
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
                    <X size={18} className="text-text-fore2" />
                </Button>
            </Tooltip>
        </div>
    )
}
