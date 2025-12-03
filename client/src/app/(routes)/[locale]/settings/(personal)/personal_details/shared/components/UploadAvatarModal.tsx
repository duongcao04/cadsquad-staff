'use client'

import { useResetPasswordMutation } from '@/lib/queries'
import { handleCopy, PasswordInput } from '@/shared/components'
import { HeroButton } from '@/shared/components/ui/hero-button'
import { TUser } from '@/shared/types'
import {
    addToast,
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Radio,
    RadioGroup,
} from '@heroui/react'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'

type Props = {
    isOpen: boolean
    onClose: () => void
    isLoading?: boolean
    data?: TUser
}
export default function UploadAvatarModal({ isOpen, onClose, data }: Props) {
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

    const { isPending: isResetting } = useResetPasswordMutation()

    const handleDone = async () => {
        // if (data?.id) {
        // 	if (resetOption === 'automatic') {
        // 		setPasswordInput(generatePassword())
        // 	}
        // 	await resetPasswordMutation(
        // 		{
        // 			userId: data.id,
        // 			resetPasswordInput: {
        // 				newPassword: passwordInput,
        // 			},
        // 		},
        // 		{
        // 			onSuccess: (res) => {
        // 				addToast({
        // 					title: t('success'),
        // 					description: res.data.message,
        // 					color: 'success',
        // 				})
        // 				setSuccess(true)
        // 			},
        // 			onError: (error) => {
        // 				const err = error as unknown as ApiError
        // 				addToast({
        // 					title: t('failed'),
        // 					description: err.message,
        // 					color: 'danger',
        // 				})
        // 			},
        // 		}
        // 	)
        // } else {
        // 	addToast({
        // 		title: t('error'),
        // 		color: 'danger',
        // 	})
        // }
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
                <ModalHeader
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
                </ModalHeader>
                <ModalBody>
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
                                        <PasswordInput
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
                                <PasswordInput
                                    isRequired
                                    value={passwordInput}
                                    autoFocus={false}
                                    variant="underlined"
                                />
                                <HeroButton
                                    className="mt-2 text-white"
                                    color="blue"
                                    size="sm"
                                    variant="solid"
                                    onPress={() => {
                                        handleCopy(passwordInput, () => {
                                            addToast({
                                                title: t('copiedToClipboard'),
                                                color: 'success',
                                            })
                                        })
                                    }}
                                >
                                    {t('copyPassword')}
                                </HeroButton>
                            </>
                        )}
                    </div>
                </ModalBody>
                <ModalFooter>
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
                                onPress={handleDone}
                            >
                                {t('reset')}
                            </Button>
                        </>
                    )}
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
