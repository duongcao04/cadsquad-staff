'use client'

import { Link } from '@/i18n/navigation'
import { ApiError } from '@/lib/axios'
import { handleCopy } from '@/shared/components'
import { envConfig } from '@/shared/config'
import { Job } from '@/shared/interfaces'
import { useDeleteJobMutation } from '@/shared/queries'
import {
    addToast,
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
} from '@heroui/react'
import {
    Ellipsis,
    PanelsTopLeft,
    SquareArrowOutUpRight,
    Trash,
} from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'

type Props = { data: Job; jobNo: string }
export function ActionsDropdown({ jobNo, data }: Props) {
    const t = useTranslations()
    const locale = useLocale()
    const { mutateAsync: deleteJobMutation } = useDeleteJobMutation()
    const handleDelete = async () => {
        await deleteJobMutation(data.id, {
            onSuccess: (res) => {
                addToast({
                    title: res.data.message,
                    color: 'success',
                })
            },
            onError(error) {
                const err = error as unknown as ApiError
                addToast({
                    title: err.message,
                    color: 'danger',
                })
            },
        })
    }
    return (
        <Dropdown showArrow placement="bottom-end">
            <DropdownTrigger>
                <Button
                    variant="light"
                    color="primary"
                    className="flex items-center justify-center"
                    size="sm"
                    isIconOnly
                >
                    <Ellipsis size={18} className="text-text-fore2" />
                </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
                <DropdownItem
                    key="open_in_new_tab"
                    startContent={<SquareArrowOutUpRight size={14} />}
                >
                    <Link
                        href={`/project-center/${jobNo}`}
                        className="block size-full"
                        target="_blank"
                    >
                        {t('openInNewTab')}
                    </Link>
                </DropdownItem>
                <DropdownItem
                    key="copy_link_in_project-center"
                    startContent={<PanelsTopLeft size={14} />}
                    onPress={() => {
                        handleCopy(
                            `${envConfig.NEXT_PUBLIC_URL}/${locale}/project-center/${jobNo}`,
                            () => {
                                addToast({
                                    title: 'Copy successfully',
                                    color: 'success',
                                })
                            }
                        )
                    }}
                >
                    {t('copyLinkInPage', { page: t('projectCenter') })}
                </DropdownItem>
                <DropdownItem
                    key="delete_job"
                    color="danger"
                    startContent={<Trash size={14} />}
                    onClick={handleDelete}
                >
                    {t('delete')}
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    )
}
