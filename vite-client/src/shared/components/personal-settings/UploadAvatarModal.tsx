import { useUpdateUserMutation, useUploadImageMutation } from '@/lib/queries'
import { addToast, Divider } from '@heroui/react'
import React, { useState } from 'react'
import AvatarUpload from '../file-upload/avatar-upload'
import { HeroButton } from '../ui/hero-button'
import {
    HeroModal,
    HeroModalBody,
    HeroModalContent,
    HeroModalFooter,
    HeroModalHeader,
} from '../ui/hero-modal'

type Props = {
    userId: string
    isOpen: boolean
    onClose: () => void
}

function UploadAvatarModal({ userId, isOpen, onClose }: Props) {
    const uploadImageMutation = useUploadImageMutation()
    const updateUserMutation = useUpdateUserMutation()

    const [file, setFile] = useState<File | null>(null)

    const handleClose = () => {
        onClose()
        setFile(null)
    }

    const handleChangeAvatar = async () => {
        if (file) {
            const avatarUrl = await uploadImageMutation.mutateAsync(file)
            if (avatarUrl) {
                await updateUserMutation.mutateAsync(
                    {
                        userId,
                        updateUserInput: {
                            avatar: avatarUrl,
                        },
                    },
                    {
                        onSuccess: () => {
                            addToast({
                                title: 'Update avatar successfully',
                                color: 'success',
                            })
                            handleClose()
                        },
                    }
                )
            }
        } else {
            addToast({
                title: 'Please choose image',
                color: 'danger',
            })
        }
    }

    return (
        <HeroModal
            isOpen={isOpen}
            onClose={handleClose}
            classNames={{
                base: 'max-w-[90%] sm:max-w-[80%] md:max-w-[80%] xl:max-w-[740px]',
            }}
            style={{
                bottom: '200px',
            }}
        >
            <HeroModalContent>
                <HeroModalHeader>
                    <p className="text-lg font-semibold">Upload avatar</p>
                </HeroModalHeader>
                <Divider />
                <HeroModalBody>
                    <AvatarUpload
                        onFileChange={(file) => {
                            // FIX: Wrap in setTimeout to avoid "Cannot update during render" error
                            setTimeout(() => {
                                if (file) {
                                    setFile(file.file as File)
                                }
                            }, 0)
                        }}
                        onRemoveFile={() => setFile(null)}
                        maxSize={10 * 1024 * 1024} // 10MB
                        imgClassName="size-48!"
                        iconClassName="size-24! text-text-7"
                    />
                </HeroModalBody>
                <Divider />
                <HeroModalFooter>
                    <HeroButton variant="light" onPress={onClose}>
                        Cancel
                    </HeroButton>
                    <HeroButton onPress={handleChangeAvatar}>Save</HeroButton>
                </HeroModalFooter>
            </HeroModalContent>
        </HeroModal>
    )
}
export default React.memo(UploadAvatarModal)
