'use client'

import React from 'react'
import useAuth from '@/queries/useAuth'
import { Button, Input, InputProps } from '@heroui/react'
import { useFormik } from 'formik'
import { Link } from '../../../../../i18n/navigation'
import { appTheme } from '../constants/AppTheme'
import { Image } from 'antd'

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
    const {
        profile: { data },
    } = useAuth()

    const initialValues = {
        email: data?.email,
        name: data?.name,
        username: data?.username,
        department: data?.department ?? '',
        jobTitle: data?.jobTitle ?? '',
        phoneNumber: data?.phoneNumber ?? '',
        avatar: data?.avatar ?? '',
    }

    const formik = useFormik({
        initialValues,
        enableReinitialize: true,
        onSubmit(values) {
            console.log(values)
        },
    })

    const inputClassNames: InputProps['classNames'] = {
        label: 'pb-0',
        inputWrapper: 'border-[1px]',
    }

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-8">
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
                            How theme are displayed.
                        </p>
                        <Link
                            href={'/onboarding'}
                            className="block mt-1 text-xs font-semibold underline text-primary"
                            target="_blank"
                        >
                            View examples
                        </Link>
                    </div>
                    <div className="flex items-center justify-start gap-4">
                        {appTheme.map((theme) => {
                            const isActived = theme.id === 1
                            return (
                                <div
                                    key={theme.id}
                                    className="flex flex-col items-center gap-1"
                                >
                                    <Image
                                        src={theme.thumbnail}
                                        alt="Theme thumb"
                                        rootClassName="!h-12 border-1 size-full rounded-sm"
                                        className="!size-full"
                                        wrapperStyle={{
                                            borderColor: isActived
                                                ? 'var(--color-primary)'
                                                : 'transparent',
                                        }}
                                        preview={false}
                                    />
                                    <p className="text-xs">{theme.title}</p>
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
                </div>
            </div>
            <Input
                id="email"
                name="email"
                label="Email"
                labelPlacement="outside-top"
                value={formik.values.email}
                classNames={inputClassNames}
                variant="bordered"
                isDisabled
            />
            <div className="mt-5 flex items-center justify-end gap-4">
                <Button
                    type="submit"
                    className="w-[120px] border-[1.5px]"
                    variant="bordered"
                    color="danger"
                >
                    Hủy
                </Button>
                <Button type="submit" className="w-[120px]" color="primary">
                    Lưu thay đổi
                </Button>
            </div>
        </form>
    )
}
