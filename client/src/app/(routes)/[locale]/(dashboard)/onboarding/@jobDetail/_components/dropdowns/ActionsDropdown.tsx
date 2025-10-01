'use client'
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
import React from 'react'
import { Job } from '@/shared/interfaces/job.interface'
import { Link } from '@/i18n/navigation'
import { handleCopy } from '@/shared/components/ui/copy-button'
import envConfig from '@/config/envConfig'
import { useLocale } from 'next-intl'

type Props = { data: Job; jobNo: string }
export default function ActionsDropdown({ jobNo }: Props) {
    const locale = useLocale()
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
                        href={`/onboarding/${jobNo}`}
                        className="block size-full"
                        target="_blank"
                    >
                        Open in new tab
                    </Link>
                </DropdownItem>
                <DropdownItem
                    key="copy_link_in_onboarding"
                    startContent={<PanelsTopLeft size={14} />}
                    onPress={() => {
                        handleCopy(
                            `${envConfig.NEXT_PUBLIC_URL}/${locale}/onboarding/${jobNo}`,
                            () => {
                                addToast({
                                    title: 'Copy successfully',
                                    color: 'success',
                                })
                            }
                        )
                    }}
                >
                    Copy link in Onboarding
                </DropdownItem>
                <DropdownItem
                    key="delete_job"
                    color="danger"
                    startContent={<Trash size={14} />}
                >
                    Delete job
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    )
}
