import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Select,
    SelectItem,
} from '@heroui/react'

type CreatePermissionModalProps = {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => {}
}
export default function CreatePermissionModal({
    isOpen,
    onClose,
    onConfirm,
}: CreatePermissionModalProps) {
    const entities = ['community', 'topic', 'post', 'comment']
    const actions = [
        'create',
        'read',
        'update',
        'delete',
        'moderate',
        'lock_pin',
    ]

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="sm">
            <ModalContent>
                <ModalHeader>Create New Permission</ModalHeader>
                <ModalBody className="space-y-4">
                    <Select label="Entity" variant="bordered">
                        {entities.map((e) => (
                            <SelectItem key={e} textValue={e}>
                                {e.toUpperCase()}
                            </SelectItem>
                        ))}
                    </Select>
                    <Select label="Action" variant="bordered">
                        {actions.map((a) => (
                            <SelectItem key={a} textValue={a}>
                                {a.toUpperCase()}
                            </SelectItem>
                        ))}
                    </Select>
                    <Input
                        label="Description"
                        placeholder="Optional explanation"
                        variant="bordered"
                    />
                </ModalBody>
                <ModalFooter>
                    <Button variant="light" onPress={onClose}>
                        Cancel
                    </Button>
                    <Button
                        color="primary"
                        onPress={onConfirm}
                        className="font-bold"
                    >
                        Create
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
