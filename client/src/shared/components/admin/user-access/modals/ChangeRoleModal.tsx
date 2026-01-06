import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Select,
    SelectItem,
} from '@heroui/react'
import { AlertTriangle, UserCog } from 'lucide-react'
import { useState } from 'react'

interface ChangeRoleModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (newRoleId: string) => void
    currentRoleId: number | string
    roles: { id: number | string; displayName: string; code: string }[]
    isPending: boolean
}

export const ChangeRoleModal = ({
    isOpen,
    onClose,
    onConfirm,
    currentRoleId,
    roles,
    isPending,
}: ChangeRoleModalProps) => {
    const [selectedRole, setSelectedRole] = useState<string>('')

    const handleConfirm = () => {
        if (selectedRole) onConfirm(selectedRole)
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} backdrop="blur">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex gap-2 items-center text-warning-600">
                            <AlertTriangle /> Change Primary Role
                        </ModalHeader>
                        <ModalBody className="gap-4">
                            <div className="p-3 bg-warning-50 rounded-lg text-sm text-warning-800 border border-warning-200">
                                <strong>Warning:</strong> Changing the role will{' '}
                                <b>reset all custom permission overrides</b>{' '}
                                (Grants/Denials) for this user to the defaults
                                of the new role.
                            </div>

                            <Select
                                label="Select New Role"
                                placeholder="Choose a role..."
                                variant="bordered"
                                selectedKeys={
                                    selectedRole ? [selectedRole] : []
                                }
                                onChange={(e) =>
                                    setSelectedRole(e.target.value)
                                }
                                startContent={
                                    <UserCog
                                        size={16}
                                        className="text-default-400"
                                    />
                                }
                            >
                                {roles
                                    .filter(
                                        (r) =>
                                            String(r.id) !==
                                            String(currentRoleId)
                                    ) // Exclude current
                                    .map((role) => (
                                        <SelectItem
                                            key={role.id}
                                            textValue={role.displayName}
                                        >
                                            {role.displayName}
                                        </SelectItem>
                                    ))}
                            </Select>
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="light" onPress={onClose}>
                                Cancel
                            </Button>
                            <Button
                                color="warning"
                                onPress={handleConfirm}
                                isDisabled={!selectedRole}
                                isLoading={isPending}
                            >
                                Confirm Change
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}
