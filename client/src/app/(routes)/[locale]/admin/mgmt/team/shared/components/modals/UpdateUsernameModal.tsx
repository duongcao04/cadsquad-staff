'use client'

import { userApi } from '@/lib/api'
import { ApiError } from '@/lib/axios'
import { User } from '@/shared/interfaces'
import { useUpdateUserMutation } from '@/lib/queries'
import {
    addToast,
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Spinner,
} from '@heroui/react'
import lodash from 'lodash'
import { useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'

type Props = {
    isOpen: boolean
    onClose: () => void
    isLoading?: boolean
    data?: User
}

export function UpdateUsernameModal({ isOpen, onClose, data }: Props) {
    const [usernameInput, setUsernameInput] = useState('')
    const [isChecking, setIsChecking] = useState(false)
    const [usernameError, setUsernameError] = useState<string | null>(null)
    const [isValid, setIsValid] = useState<boolean | null>(null)
    const [isTouched, setIsTouched] = useState(false)

    const t = useTranslations()

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
                    setUsernameError(t('usernameAlreadyExists'))
                } else {
                    setUsernameError(null)
                }
            } catch {
                setUsernameError(t('failedToCheckUsername'))
            } finally {
                setIsChecking(false)
            }
        }, 500),
        [t]
    )

    // ✅ Validate chỉ sau khi người dùng đã click vào input
    useEffect(() => {
        if (!isTouched) return // chưa chạm thì bỏ qua
        if (!usernameRegex.test(usernameInput)) {
            setUsernameError(t('invalidUsername'))
            setIsValid(false)
            return
        }
        checkUsernameValid(usernameInput)
    }, [usernameInput, checkUsernameValid, isTouched, t])

    const handleUpdateUsername = async () => {
        setIsTouched(true)
        if (!data?.id) {
            addToast({
                title: t('error'),
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
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            placement="center"
            hideCloseButton
            classNames={{
                base: '!p-0',
            }}
            size="lg"
        >
            <ModalContent className="p-2">
                <ModalHeader className="font-semibold text-lg text-white bg-primary">
                    <p>
                        {t('updateUsernameFor', {
                            fullname: `${data?.displayName}`,
                        })}
                    </p>
                </ModalHeader>
                <ModalBody>
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
                                        ? usernameError ?? undefined
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
                </ModalBody>
                <ModalFooter>
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
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
