'use client'

import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownSection,
    DropdownTrigger,
    useDisclosure,
} from '@heroui/react'
import { ChevronDownIcon } from 'lucide-react'

type Props = {
    keys: Set<string> | 'all'
    onBulkChangeStatus: () => void
}
export default function BulkActionsDropdown({ onBulkChangeStatus }: Props) {
    const { isOpen, onClose, onOpen } = useDisclosure({
        id: 'BulkActionsDropdown',
    })
    return (
        <Dropdown isOpen={isOpen} onClose={onClose} onOpenChange={onOpen}>
            <DropdownTrigger className="hidden sm:flex" onPress={onOpen}>
                <Button
                    endContent={
                        <ChevronDownIcon className="text-small" size={14} />
                    }
                    variant="bordered"
                    size="sm"
                    className="hover:shadow-SM"
                >
                    <span className="font-medium">Selected Actions</span>
                </Button>
            </DropdownTrigger>
            <DropdownMenu
                disallowEmptySelection
                aria-label="Table bulk actions"
                closeOnSelect={false}
                // onSelectionChange={setVisibleColumns}
            >
                <DropdownSection title="Status">
                    <DropdownItem
                        key="change_status"
                        onPress={() => {
                            onClose()
                            onBulkChangeStatus()
                        }}
                    >
                        Bulk change status
                    </DropdownItem>
                    <DropdownItem key="delete_all">Delete all</DropdownItem>
                </DropdownSection>
                <DropdownSection title="Payment">
                    <DropdownItem key="mark_paid">Mark as Paid</DropdownItem>
                    <DropdownItem key="mark_un_paid">
                        Mark as Unpaid
                    </DropdownItem>
                </DropdownSection>
                <DropdownSection title="Assign member">
                    <DropdownItem key="bulk_assign">Bulk assign</DropdownItem>
                </DropdownSection>
            </DropdownMenu>
        </Dropdown>
    )
}
