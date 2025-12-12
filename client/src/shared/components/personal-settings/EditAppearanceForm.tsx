'use client'

import { Link } from '@/i18n/navigation'
import { Image } from 'antd'
import { Check } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'
// import {  APP_TABLE_SIZES } from '@/lib/utils'
import { APP_THEME_COLORS, APP_THEMES } from '@/lib/utils'

export function EditAppearanceForm() {
    const t = useTranslations()
    const { theme, setTheme } = useTheme()
    // const { table, setTableSize } = useSettingStore()

    return (
        <div className="space-y-8">
            <div className="size-full border-px border-text-muted rounded-xl px-6 py-4">
                <div className="grid grid-cols-[330px_1fr] gap-8">
                    <div>
                        <h2 className="text-base font-semibold">
                            {t('themeColor')}
                        </h2>
                        <p className="text-xs text-text-subdued">
                            {t('themeColorDesc')}
                        </p>
                    </div>
                    <div className="flex items-center justify-start gap-3 flex-wrap">
                        {APP_THEME_COLORS.map((item, idx) => {
                            const isActivated = APP_THEME_COLORS[0] === item

                            return (
                                <div
                                    key={idx}
                                    className="p-0.5 border-2 rounded-lg"
                                    style={{
                                        borderColor: isActivated
                                            ? item
                                            : 'transparent',
                                    }}
                                >
                                    <div
                                        className="size-8 rounded-md"
                                        style={{
                                            background: item,
                                        }}
                                    />
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
            <div className="size-full border-px border-text-muted rounded-xl px-6 py-4">
                <div className="grid grid-cols-[330px_1fr] gap-8">
                    <div>
                        <h2 className="text-base font-semibold">
                            {t('theme')}
                        </h2>
                        <p className="text-xs text-text-subdued">
                            {t('themeDesc')}
                        </p>
                    </div>
                    <div className="flex items-center justify-start gap-6">
                        {APP_THEMES.map((themeI) => {
                            const isActivated = themeI.code === theme
                            return (
                                <div
                                    key={themeI.id}
                                    className="relative flex flex-col items-center gap-1 cursor-pointer"
                                    onClick={() => setTheme(themeI.code)}
                                >
                                    {isActivated && (
                                        <div className="absolute -top-1.25 -right-1.25 z-1">
                                            <Check
                                                size={16}
                                                className="p-0.5 rounded-full bg-primary text-white"
                                            />
                                        </div>
                                    )}
                                    <Image
                                        src={themeI.thumbnail}
                                        alt="Theme thumb"
                                        rootClassName="!h-20 border-[1.5px] p-0.5 size-full rounded-sm"
                                        className="size-full!"
                                        wrapperStyle={{
                                            borderColor: isActivated
                                                ? 'var(--color-primary)'
                                                : 'transparent',
                                        }}
                                        preview={false}
                                    />
                                    <p className="text-xs font-medium text-text-default">
                                        {themeI.title}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
            <div className="size-full border-px border-text-muted rounded-xl px-6 py-4">
                <div className="grid grid-cols-[330px_1fr] gap-8">
                    <div>
                        <h2 className="text-base font-semibold">
                            {t('tables')}
                        </h2>
                        <p className="text-xs text-text-subdued">
                            {t('tablesDesc')}
                        </p>
                        <Link
                            href={'/project-center'}
                            className="block mt-1 text-xs font-semibold underline text-primary"
                            target="_blank"
                        >
                            {t('viewExamples')}
                        </Link>
                    </div>
                    <div className="flex items-center justify-start gap-6">
                        {/* {appTableSize.map((size) => {
                            // const isActivated = size.code === table.size
                            return (
                                <div
                                    key={size.id}
                                    className="relative flex flex-col items-center gap-1 cursor-pointer"
                                    // onClick={() => setTableSize(size.code)}
                                >
                                    {true && (
                                        <div className="absolute -top-[5px] -right-[5px] z-1">
                                            <Check
                                                size={16}
                                                className="p-0.5 rounded-full bg-primary text-white"
                                            />
                                        </div>
                                    )}
                                    <Image
                                        src={size.thumbnail}
                                        alt="Theme thumb"
                                        rootClassName="!h-20 border-[1.5px] p-0.5 size-full rounded-sm"
                                        className="!size-full"
                                        wrapperStyle={{
                                            borderColor: true
                                                ? 'var(--color-primary)'
                                                : 'transparent',
                                        }}
                                        preview={false}
                                    />
                                    <p className="text-xs font-medium text-text-default">
                                        {size.title}
                                    </p>
                                </div>
                            )
                        })} */}
                        {t('featureUnderDevelopment')}
                    </div>
                </div>
            </div>
        </div>
    )
}
