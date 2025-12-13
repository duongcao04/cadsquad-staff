import { useState } from 'react'
import CreateUserForm from '../forms/CreateUserForm'
import {
    HeroModal,
    HeroModalBody,
    HeroModalContent,
    HeroModalHeader,
} from '../ui/hero-modal'

type Props = {
    isOpen: boolean
    onClose: () => void
}
export function CreateUserModal({ isOpen, onClose }: Props) {
    const [isSuccess, setIsSuccess] = useState(false)

    return (
        <HeroModal
            isOpen={isOpen}
            onClose={onClose}
            classNames={{
                base: 'max-w-[90%] sm:max-w-[80%] md:max-w-[80%] xl:max-w-[800px]',
            }}
        >
            <HeroModalContent>
                <HeroModalHeader
                    className={isSuccess ? 'bg-success' : 'bg-background'}
                >
                    {!isSuccess ? (
                        <p className="text-lg font-semibold">Create new user</p>
                    ) : (
                        <div className="text-white">
                            <p className="text-lg font-semibold">
                                Create new user
                            </p>
                            <p className="text-sm">
                                The system has successfully registered the new
                                user and saved all provided information.
                            </p>
                        </div>
                    )}
                </HeroModalHeader>
                <HeroModalBody className="px-0 pt-0">
                    <CreateUserForm
                        onClose={onClose}
                        isSuccess={isSuccess}
                        onSuccess={setIsSuccess}
                    />
                </HeroModalBody>
            </HeroModalContent>
        </HeroModal>
    )
}
