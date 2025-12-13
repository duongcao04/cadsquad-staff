import { Button, Radio, RadioGroup } from '@heroui/react'
import React, { useState } from 'react'

import { useResetPasswordMutation } from '@/lib/queries'
import type { TUser } from '@/shared/types'

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
                    onSuccess: () => {
                        setSuccess(true)
                    },
                }
            )
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
                            <p>Reset password successfully</p>
                            <p>@{data?.username}</p>
                        </div>
                    ) : (
                        <p>Reset password for user @{data?.username}</p>
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
                                        description={`You'll be able to view and copy the password in the next step`}
                                        classNames={{
                                            base: 'gap-2 items-start',
                                            wrapper: 'mt-1.5',
                                        }}
                                    >
                                        Automatically generate a password
                                    </Radio>
                                    <Radio
                                        value="manual"
                                        classNames={{
                                            base: 'gap-2',
                                        }}
                                    >
                                        Create password
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
                                    Copy password
                                </HeroCopyButton>
                            </>
                        )}
                    </div>
                </HeroModalBody>
                <HeroModalFooter>
                    {isSuccess ? (
                        <Button variant="light" onPress={handleClose}>
                            Done
                        </Button>
                    ) : (
                        <>
                            <Button variant="light" onPress={handleClose}>
                                Cancel
                            </Button>
                            <Button
                                color="primary"
                                isLoading={isResetting}
                                onPress={handleResetPassword}
                            >
                                Reset
                            </Button>
                        </>
                    )}
                </HeroModalFooter>
            </HeroModalContent>
        </HeroModal>
    )
}
