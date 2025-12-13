import { userApi } from '@/lib/api'
import { type ApiError } from '@/lib/axios'
import { useUpdateUserMutation } from '@/lib/queries'
import type { TUser } from '@/shared/types'
import { addToast, Button, Input, Spinner } from '@heroui/react'
import lodash from 'lodash'
import React, { useEffect, useState } from 'react'
import {
    HeroModal,
    HeroModalBody,
    HeroModalContent,
    HeroModalFooter,
    HeroModalHeader,
} from '../ui/hero-modal'

type Props = {
    isOpen: boolean
    onClose: () => void
    isLoading?: boolean
    data: TUser
}

export default function UpdateUsernameModal({ isOpen, onClose, data }: Props) {
    const [usernameInput, setUsernameInput] = useState('')
    const [isChecking, setIsChecking] = useState(false)
    const [usernameError, setUsernameError] = useState<string | null>(null)
    const [isValid, setIsValid] = useState<boolean | null>(null)
    const [isTouched, setIsTouched] = useState(false)

    const handleClose = () => {
        onClose()
        setUsernameInput('')
        setUsernameError(null)
        setIsValid(null)
        setIsTouched(false)
    }

    const { mutateAsync: updateUserMutation, isPending: isResetting } =
        useUpdateUserMutation()

    const usernameRegex = /^[A-Za-z][A-Za-z0-9.-]*$/

    // ✅ Kiểm tra username bất đồng bộ
    const checkUsernameValid = React.useCallback(
        lodash.debounce(async (value: string) => {
            if (!value) return
            setIsChecking(true)
            try {
                const res = await userApi.checkUsernameValid(value)
                const valid = res.data.result?.isValid
                setIsValid(Boolean(valid))
                if (!valid) {
                    setUsernameError('Username already exists')
                } else {
                    setUsernameError(null)
                }
            } catch {
                setUsernameError('Failed to check username')
            } finally {
                setIsChecking(false)
            }
        }, 500),
        []
    )

    // ✅ Validate chỉ sau khi người dùng đã click vào input
    useEffect(() => {
        if (!isTouched) return // chưa chạm thì bỏ qua
        if (!usernameRegex.test(usernameInput)) {
            setUsernameError(Username must start with a letter or number, contain only letters, numbers, dots (.) and hyphens (-), and cannot be empty.)
            setIsValid(false)
            return
        }
        checkUsernameValid(usernameInput)
    }, [usernameInput, checkUsernameValid, isTouched])

    const handleUpdateUsername = async () => {
        setIsTouched(true)
        if (!data?.id) {
            addToast({
                title: 'Update username error',
                color: 'danger',
            })
            return
        }

        if (!isValid) {
            addToast({
                title: t('failed'),
                description: usernameError || t('invalidUsername'),
                color: 'danger',
            })
            return
        }

        await updateUserMutation(
            {
                userId: data.id,
                updateUserInput: {
                    username: usernameInput,
                },
            },
            {
                onSuccess: (res) => {
                    addToast({
                        title: t('success'),
                        description: res.data.message,
                        color: 'success',
                    })
                    onClose()
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
                <HeroModalHeader className="font-semibold text-lg text-white bg-primary">
                    <p>
                        {t('updateUsernameFor', {
                            fullname: `${data?.displayName}`,
                        })}
                    </p>
                </HeroModalHeader>
                <HeroModalBody>
                    <div className="pt-2.5 px-0">
                        <p>{t('inputNewUsername')}</p>
                        <div className="w-full">
                            <Input
                                isRequired
                                label="Username"
                                value={usernameInput}
                                onChange={(e) =>
                                    setUsernameInput(e.target.value)
                                }
                                errorMessage={
                                    isTouched
                                        ? (usernameError ?? undefined)
                                        : undefined
                                }
                                isInvalid={isTouched && !!usernameError}
                                endContent={
                                    isChecking && (
                                        <Spinner size="sm" color="primary" />
                                    )
                                }
                                variant="underlined"
                                autoFocus
                            />
                        </div>
                    </div>
                </HeroModalBody>
                <HeroModalFooter>
                    <Button variant="light" onPress={handleClose}>
                        {t('cancel')}
                    </Button>
                    <Button
                        color="primary"
                        isLoading={isResetting}
                        onPress={handleUpdateUsername}
                    >
                        {t('update')}
                    </Button>
                </HeroModalFooter>
            </HeroModalContent>
        </HeroModal>
    )
}
