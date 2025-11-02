import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownSection,
    DropdownTrigger,
} from '@heroui/react'
import { ChevronDownIcon } from 'lucide-react'
import React from 'react'

type Props = {
    keys: Set<string> | 'all'
}
export default function BulkActionsDropdown({}: Props) {
    return (
        <Dropdown>
            <DropdownTrigger className="hidden sm:flex">
                <Button
                    endContent={
                        <ChevronDownIcon className="text-small" size={14} />
                    }
                    variant="flat"
                    size="sm"
                    className="shadow-SM"
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
                    <DropdownItem key="change_status">
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
