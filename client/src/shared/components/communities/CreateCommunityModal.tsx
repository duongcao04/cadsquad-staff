import { useState } from 'react'
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Textarea,
    RadioGroup,
    Radio,
    cn,
} from '@heroui/react'
import { UsersIcon, LockIcon, GlobeIcon } from 'lucide-react'

interface CreateCommunityModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit?: (data: any) => void
}

const COLORS = [
    'bg-pink-600',
    'bg-purple-600',
    'bg-indigo-600',
    'bg-blue-600',
    'bg-cyan-600',
    'bg-teal-600',
    'bg-green-600',
    'bg-orange-600',
    'bg-red-600',
    'bg-zinc-700',
]

export const CreateCommunityModal = ({
    isOpen,
    onClose,
    onSubmit,
}: CreateCommunityModalProps) => {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [selectedColor, setSelectedColor] = useState(COLORS[2]) // Default Indigo
    const [privacy, setPrivacy] = useState('public')
    const [isLoading, setIsLoading] = useState(false)

    // Generate initials for the preview icon
    const getInitials = (str: string) => {
        if (!str) return 'C'
        return str
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase()
    }

    const handleSubmit = async (onClose: () => void) => {
        if (!name.trim()) return

        setIsLoading(true)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const newCommunity = {
            name,
            description,
            color: selectedColor,
            privacy,
            icon: getInitials(name),
        }

        console.log('Creating Community:', newCommunity)
        if (onSubmit) onSubmit(newCommunity)

        setIsLoading(false)
        onClose()

        // Reset form
        setName('')
        setDescription('')
        setPrivacy('public')
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            placement="center"
            backdrop="blur"
            size="lg"
            classNames={{
                base: 'bg-zinc-900 border border-zinc-800 text-zinc-100',
                header: 'border-b border-zinc-800',
                footer: 'border-t border-zinc-800',
                closeButton: 'hover:bg-zinc-800 active:bg-zinc-700',
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Create a Community
                            <span className="text-sm font-normal text-zinc-400">
                                Communities are spaces where teams communicate
                                and collaborate.
                            </span>
                        </ModalHeader>

                        <ModalBody className="py-6">
                            <div className="flex flex-col gap-6">
                                {/* 1. Identity Section (Icon Preview & Name) */}
                                <div className="flex gap-4 items-start">
                                    {/* Icon Preview */}
                                    <div className="flex flex-col gap-2 items-center">
                                        <div
                                            className={cn(
                                                'w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-lg transition-colors duration-300',
                                                selectedColor
                                            )}
                                        >
                                            {getInitials(name)}
                                        </div>
                                        <span className="text-xs text-zinc-500">
                                            Preview
                                        </span>
                                    </div>

                                    <div className="flex-1 space-y-4">
                                        <Input
                                            autoFocus
                                            label="Community Name"
                                            placeholder="e.g. Engineering Dept"
                                            variant="bordered"
                                            value={name}
                                            onValueChange={setName}
                                            classNames={{
                                                inputWrapper:
                                                    'bg-zinc-950 border-zinc-700 hover:border-zinc-600 focus-within:border-primary data-[hover=true]:border-zinc-600',
                                                label: 'text-zinc-400',
                                            }}
                                        />

                                        {/* Color Picker */}
                                        <div>
                                            <label className="text-tiny text-zinc-400 block mb-2">
                                                Theme Color
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {COLORS.map((color) => (
                                                    <button
                                                        key={color}
                                                        type="button"
                                                        onClick={() =>
                                                            setSelectedColor(
                                                                color
                                                            )
                                                        }
                                                        className={cn(
                                                            'w-6 h-6 rounded-full transition-all hover:scale-110',
                                                            color,
                                                            selectedColor ===
                                                                color
                                                                ? 'ring-2 ring-white ring-offset-2 ring-offset-zinc-900 scale-110'
                                                                : 'opacity-70 hover:opacity-100'
                                                        )}
                                                        aria-label="Select color"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Description */}
                                <Textarea
                                    label="Description"
                                    placeholder="What is this community for?"
                                    variant="bordered"
                                    value={description}
                                    onValueChange={setDescription}
                                    classNames={{
                                        inputWrapper:
                                            'bg-zinc-950 border-zinc-700 hover:border-zinc-600 focus-within:border-primary',
                                        label: 'text-zinc-400',
                                    }}
                                />

                                {/* 3. Privacy Settings (Custom Radio) */}
                                <div>
                                    <label className="text-small font-medium text-zinc-300 mb-2 block">
                                        Privacy
                                    </label>
                                    <RadioGroup
                                        value={privacy}
                                        onValueChange={setPrivacy}
                                        color="primary"
                                    >
                                        <div
                                            className={cn(
                                                'flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer hover:bg-zinc-800/50',
                                                privacy === 'public'
                                                    ? 'border-primary bg-primary/10'
                                                    : 'border-zinc-700 bg-transparent'
                                            )}
                                        >
                                            <Radio
                                                value="public"
                                                className="mt-1"
                                            />
                                            <div
                                                className="flex flex-col"
                                                onClick={() =>
                                                    setPrivacy('public')
                                                }
                                            >
                                                <div className="flex items-center gap-2 font-medium text-zinc-200">
                                                    <GlobeIcon size={16} />{' '}
                                                    Public
                                                </div>
                                                <span className="text-tiny text-zinc-400">
                                                    Anyone in your organization
                                                    can find and join this
                                                    community.
                                                </span>
                                            </div>
                                        </div>
                                        <div className="h-2" /> {/* Spacer */}
                                        <div
                                            className={cn(
                                                'flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer hover:bg-zinc-800/50',
                                                privacy === 'private'
                                                    ? 'border-primary bg-primary/10'
                                                    : 'border-zinc-700 bg-transparent'
                                            )}
                                        >
                                            <Radio
                                                value="private"
                                                className="mt-1"
                                            />
                                            <div
                                                className="flex flex-col"
                                                onClick={() =>
                                                    setPrivacy('private')
                                                }
                                            >
                                                <div className="flex items-center gap-2 font-medium text-zinc-200">
                                                    <LockIcon size={16} />{' '}
                                                    Private
                                                </div>
                                                <span className="text-tiny text-zinc-400">
                                                    Only invited members can
                                                    view content and channels.
                                                </span>
                                            </div>
                                        </div>
                                    </RadioGroup>
                                </div>
                            </div>
                        </ModalBody>

                        <ModalFooter>
                            <Button
                                variant="flat"
                                onPress={onClose}
                                className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                            >
                                Cancel
                            </Button>
                            <Button
                                color="primary"
                                onPress={() => handleSubmit(onClose)}
                                isLoading={isLoading}
                                isDisabled={!name}
                                startContent={
                                    !isLoading && <UsersIcon size={18} />
                                }
                            >
                                Create Community
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}
