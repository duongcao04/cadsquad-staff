import {
    Button,
    Checkbox,
    CheckboxGroup,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
} from '@heroui/react'
import { TPermission } from '../../types/_role.type'

type CreateRoleModalProps = {
    isOpen: boolean
    onClose: () => void
    allPermission: TPermission[]
}
export default function CreateRoleModal({
    isOpen,
    onClose,
    allPermissions,
}: CreateRoleModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalContent>
                <ModalHeader>Configure Role</ModalHeader>
                <ModalBody className="pb-8">
                    <Input
                        label="Role Name"
                        placeholder="e.g. Moderator"
                        variant="bordered"
                        className="mb-4"
                    />

                    <p className="text-sm font-bold mb-2">
                        Select Permissions for this Role
                    </p>
                    <div className="grid grid-cols-2 gap-4 h-64 overflow-y-auto noscrollbar p-1">
                        {/* Nhóm theo thực thể để dễ chọn */}
                        {['Post', 'Comment', 'Community'].map((entity) => (
                            <CheckboxGroup
                                key={entity}
                                label={entity}
                                color="primary"
                                size="sm"
                            >
                                <Checkbox value="create">Create</Checkbox>
                                <Checkbox value="update">Update</Checkbox>
                                <Checkbox value="delete">Delete</Checkbox>
                            </CheckboxGroup>
                        ))}
                    </div>
                    <Button
                        color="primary"
                        fullWidth
                        className="mt-6 font-bold"
                    >
                        Save Role
                    </Button>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
