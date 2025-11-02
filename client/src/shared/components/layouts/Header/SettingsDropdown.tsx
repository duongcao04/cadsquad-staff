'use client'

import { Link } from '@/i18n/navigation'
import {
    ADMIN_SETTINGS_DROPDOWN,
    USER_SETTINGS_DROPDOWN,
} from '@/shared/actions'
import { SettingsGearIcon } from '@/shared/components'
import { RoleEnum } from '@/shared/enums'
import { useProfile } from '@/lib/queries'
import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownSection,
    DropdownTrigger,
} from '@heroui/react'
import { useTranslations } from 'next-intl'

export function SettingsDropdown() {
    const { userRole } = useProfile()
    const t = useTranslations('settings')

    const dropdownActions =
        userRole === RoleEnum.ADMIN
            ? ADMIN_SETTINGS_DROPDOWN
            : USER_SETTINGS_DROPDOWN
    return (
        <Dropdown
            placement="bottom-end"
            showArrow
            classNames={{
                content: 'rounded-lg',
            }}
        >
            <DropdownTrigger>
                <Button
                    variant="light"
                    startContent={<SettingsGearIcon size={18} />}
                    size="sm"
                    isIconOnly
                />
            </DropdownTrigger>
            <DropdownMenu
                aria-label="User notification"
                disabledKeys={[
                    'title',
                    'system',
                    'job',
                    'payment',
                    'articles',
                    'notificationSettings',
                ]}
                classNames={{
                    base: 'w-[520px] overflow-y-auto left-0',
                }}
            >
                {dropdownActions.map((group) => {
                    return (
                        <DropdownSection
                            key={group.groupTitleKey}
                            title={t(group.groupTitleKey)}
                        >
                            {group.children.map((item) => {
                                return (
                                    <DropdownItem
                                        key={item.titleKey}
                                        startContent={
                                            <div className="size-[32px] grid place-items-center">
                                                {item.icon && (
                                                    <item.icon size={18} />
                                                )}
                                            </div>
                                        }
                                    >
                                        <Link
                                            href={item.href}
                                            className="block size-full"
                                            passHref
                                        >
                                            <p>{t(item.titleKey)}</p>
                                            <p className="text-xs text-text-muted">
                                                {t(item.descriptionKey)}
                                            </p>
                                        </Link>
                                    </DropdownItem>
                                )
                            })}
                        </DropdownSection>
                    )
                })}
            </DropdownMenu>
        </Dropdown>
    )
}
