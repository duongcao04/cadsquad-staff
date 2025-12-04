'use client'

import { ApiError } from '@/lib/axios'
import { useResetPasswordMutation } from '@/lib/queries'
import { addToast, Button, Radio, RadioGroup } from '@heroui/react'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'
import { TUser } from '../../types'
import HeroCopyButton from '../ui/hero-copy-button'
import {
    HeroModal,
    HeroModalBody,
    HeroModalContent,
    HeroModalFooter,
    HeroModalHeader,
} from '../ui/hero-modal'
import { HeroPasswordInput } from '../ui/hero-password-input'

const generatePassword = () => {
    const length = 12
    const charset =
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let password = ''
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length)
        password += charset[randomIndex]
    }
    return password
}

type Props = {
    isOpen: boolean
    onClose: () => void
    isLoading?: boolean
    data: TUser
}
export default function ResetPasswordModal({ isOpen, onClose, data }: Props) {
    const [resetOption, setResetOption] = React.useState('automatic')
    const [passwordInput, setPasswordInput] = useState('')
    const [isSuccess, setSuccess] = useState(false)

    const t = useTranslations()

    const handleClose = () => {
        onClose()
        setResetOption('automatic')
        setPasswordInput('')
        setSuccess(false)
    }

    const { mutateAsync: resetPasswordMutation, isPending: isResetting } =
        useResetPasswordMutation()

    const handleResetPassword = async () => {
        if (data?.id) {
            if (resetOption === 'automatic') {
                setPasswordInput(generatePassword())
            }
            await resetPasswordMutation(
                {
                    userId: data.id,
                    resetPasswordInput: {
                        newPassword: passwordInput,
                    },
                },
                {
                    onSuccess: (res) => {
                        addToast({
                            title: t('success'),
                            description: res.data.message,
                            color: 'success',
                        })
                        setSuccess(true)
                    },
                    onError: (error) => {
                        const err = error as unknown as ApiError
                        addToast({
                            title: t('failed'),
                            description: err.message,
                            color: 'danger',
                        })
                    },
                }
            )
        } else {
            addToast({
                title: t('error'),
                color: 'danger',
            })
        }
    }

    return (
        <HeroModal
            isOpen={isOpen}
            onClose={handleClose}
            placement="center"
            hideCloseButton
            classNames={{
                base: '!p-0',
            }}
            size="lg"
        >
            <HeroModalContent className="p-2">
                <HeroModalHeader
                    className="font-semibold text-lg text-white"
                    style={{
                        backgroundColor: isSuccess
                            ? '#138748'
                            : 'var(--color-primary)',
                    }}
                >
                    {isSuccess ? (
                        <div>
                            <p>{t('resetPasswordSuccess')}</p>
                            <p>@{data?.username}</p>
                        </div>
                    ) : (
                        <p>
                            {t('resetPasswordFor', {
                                username: `@${data?.username}`,
                            })}
                        </p>
                    )}
                </HeroModalHeader>
                <HeroModalBody>
                    <div className="pt-2.5 px-0">
                        {!isSuccess && (
                            <>
                                <RadioGroup
                                    value={resetOption}
                                    onValueChange={setResetOption}
                                >
                                    <Radio
                                        value="automatic"
                                        description={t(
                                            'automaticallyGeneratePasswordDesc'
                                        )}
                                        classNames={{
                                            base: 'gap-2 items-start',
                                            wrapper: 'mt-1.5',
                                        }}
                                    >
                                        {t('automaticallyGeneratePassword')}
                                    </Radio>
                                    <Radio
                                        value="manual"
                                        classNames={{
                                            base: 'gap-2',
                                        }}
                                    >
                                        {t('createPassword')}
                                    </Radio>
                                </RadioGroup>
                                {resetOption === 'manual' && (
                                    <div className="mt-4 w-full">
                                        <HeroPasswordInput
                                            isRequired
                                            value={passwordInput}
                                            onChange={(e) =>
                                                setPasswordInput(e.target.value)
                                            }
                                            validate={(value) => {
                                                const passwordRegex = /^.{8,}$/
                                                if (
                                                    !passwordRegex.test(value)
                                                ) {
                                                    return 'Password least 8 characters'
                                                } else {
                                                    return ''
                                                }
                                            }}
                                            variant="underlined"
                                            description="Password must have at least 8 characters"
                                            autoFocus
                                        />
                                    </div>
                                )}
                            </>
                        )}
                        {isSuccess && (
                            <>
                                <HeroPasswordInput
                                    isRequired
                                    value={passwordInput}
                                    autoFocus={false}
                                    variant="underlined"
                                />
                                <HeroCopyButton
                                    className="mt-2 text-white"
                                    size="sm"
                                    variant="solid"
                                    textValue={passwordInput}
                                >
                                    {t('copyPassword')}
                                </HeroCopyButton>
                            </>
                        )}
                    </div>
                </HeroModalBody>
                <HeroModalFooter>
                    {isSuccess ? (
                        <Button variant="light" onPress={handleClose}>
                            {t('done')}
                        </Button>
                    ) : (
                        <>
                            <Button variant="light" onPress={handleClose}>
                                {t('cancel')}
                            </Button>
                            <Button
                                color="primary"
                                isLoading={isResetting}
                                onPress={handleResetPassword}
                            >
                                {t('reset')}
                            </Button>
                        </>
                    )}
                </HeroModalFooter>
            </HeroModalContent>
        </HeroModal>
    )
}
