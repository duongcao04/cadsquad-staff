'use client'

import React from 'react'
import { appTheme } from '../constants/AppTheme'
import { Image } from 'antd'
import { Link } from '@/i18n/navigation'
import { useTheme } from 'next-themes'
import { Check } from 'lucide-react'
import { appTableSize } from '../constants/AppTableSize'
import { useSettingStore } from '@/app/(routes)/[locale]/settings/shared/store/useSettingStore'

export const THEME_COLORS = [
    'var(--color-primary)',
    '#e11d48',
    '#ea580c',
    '#f59e0b',
    '#16a34a',
    '#0284c7',
    '#4f46e5',
    '#3f3f46',
]

export default function EditAppearanceForm() {
    const { theme, setTheme } = useTheme()
    const { table, setTableSize } = useSettingStore()

    return (
        <div className="space-y-8">
            <div className="size-full border-[1px] border-text3 rounded-xl px-6 py-4">
                <div className="grid grid-cols-[330px_1fr] gap-8">
                    <div>
                        <h2 className="text-base font-semibold">Theme Color</h2>
                        <p className="text-xs text-text2">
                            Choose a preferred theme for the app
                        </p>
                    </div>
                    <div className="flex items-center justify-start gap-3 flex-wrap">
                        {THEME_COLORS.map((item, idx) => {
                            const isActived = THEME_COLORS[0] === item

                            return (
                                <div
                                    key={idx}
                                    className="p-[2px] border-2 rounded-lg"
                                    style={{
                                        borderColor: isActived
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
            <div className="size-full border-[1px] border-text3 rounded-xl px-6 py-4">
                <div className="grid grid-cols-[330px_1fr] gap-8">
                    <div>
                        <h2 className="text-base font-semibold">Theme</h2>
                        <p className="text-xs text-text2">
                            How the theme looks.
                        </p>
                    </div>
                    <div className="flex items-center justify-start gap-6">
                        {appTheme.map((themeI) => {
                            const isActived = themeI.code === theme
                            return (
                                <div
                                    key={themeI.id}
                                    className="relative flex flex-col items-center gap-1 cursor-pointer"
                                    onClick={() => setTheme(themeI.code)}
                                >
                                    {isActived && (
                                        <div className="absolute -top-[5px] -right-[5px] z-1">
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
                                        className="!size-full"
                                        wrapperStyle={{
                                            borderColor: isActived
                                                ? 'var(--color-primary)'
                                                : 'transparent',
                                        }}
                                        preview={false}
                                    />
                                    <p className="text-xs font-medium text-text1p5">
                                        {themeI.title}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
            <div className="size-full border-[1px] border-text3 rounded-xl px-6 py-4">
                <div className="grid grid-cols-[330px_1fr] gap-8">
                    <div>
                        <h2 className="text-base font-semibold">Tables</h2>
                        <p className="text-xs text-text2">
                            How tables are displayed.
                        </p>
                        <Link
                            href={'/onboarding'}
                            className="block mt-1 text-xs font-semibold underline text-primary"
                            target="_blank"
                        >
                            View examples
                        </Link>
                    </div>
                    <div className="flex items-center justify-start gap-6">
                        {appTableSize.map((size) => {
                            const isActived = size.code === table.size
                            return (
                                <div
                                    key={size.id}
                                    className="relative flex flex-col items-center gap-1 cursor-pointer"
                                    onClick={() => setTableSize(size.code)}
                                >
                                    {isActived && (
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
                                            borderColor: isActived
                                                ? 'var(--color-primary)'
                                                : 'transparent',
                                        }}
                                        preview={false}
                                    />
                                    <p className="text-xs font-medium text-text1p5">
                                        {size.title}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
