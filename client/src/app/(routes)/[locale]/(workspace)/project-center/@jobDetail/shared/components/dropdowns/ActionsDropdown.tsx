'use client'

import { Link } from '@/i18n/navigation'
import { ApiError } from '@/lib/axios'
import { ConfirmDeleteModal, handleCopy } from '@/shared/components'
import { envConfig } from '@/lib/config'
import { Job } from '@/shared/interfaces'
import { useDeleteJobMutation } from '@/lib/queries'
import {
    addToast,
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    useDisclosure,
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
    const {
        isOpen: isOpenModal,
        onOpen: onOpenModal,
        onClose: onCloseModal,
    } = useDisclosure({
        id: 'ConfirmDeleteModal',
    })

    const { mutateAsync: deleteJobMutation, isPending: isDeleting } =
        useDeleteJobMutation()

    const handleDelete = async () => {
        if (data?.id) {
            await deleteJobMutation(data?.id, {
                onSuccess: (res) => {
                    addToast({
                        title: t('successfully'),
                        description: t('deletedJob', {
                            jobNo: `#${res.data.result?.jobNo ?? data?.no}`,
                        }),
                        color: 'success',
                    })
                    onCloseModal()
                },
                onError(error) {
                    const err = error as unknown as ApiError
                    addToast({
                        title: t('failed'),
                        description: err.message,
                        color: 'danger',
                    })
                },
            })
        }
    }

    return (
        <>
            <ConfirmDeleteModal
                isOpen={isOpenModal}
                onClose={onCloseModal}
                onConfirm={handleDelete}
                title={t('deleteJob')}
                description={t('deleteJobDesc', {
                    jobNo: `#${data?.no}`,
                })}
                isLoading={isDeleting}
                style={{
                    zIndex: 9999999999,
                }}
            />
            <Dropdown showArrow placement="bottom-end">
                <DropdownTrigger>
                    <Button
                        variant="light"
                        color="primary"
                        className="flex items-center justify-center"
                        size="sm"
                        isIconOnly
                    >
                        <Ellipsis size={18} className="text-text-subdued" />
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
                        onClick={onOpenModal}
                    >
                        {t('delete')}
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </>
    )
}
