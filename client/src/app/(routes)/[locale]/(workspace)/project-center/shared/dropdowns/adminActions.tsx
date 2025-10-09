import { ActionGroup } from '../components/TableActionDropdown'

import {
    CircleCheck,
    CircleDollarSign,
    PinIcon,
    SquareArrowOutUpRight,
    Trash,
    UserPlus,
} from 'lucide-react'

export function adminActions(
    jobNo: string,
    onOpenAssignModal: (jobNo: string) => void,
    handleDeleteJob: () => void
): ActionGroup[] {
    return [
        {
            key: 'View detail',
            groupTitle: 'View detail',
            children: [
                {
                    key: 'openInNewTab',
                    title: 'Open in new tab',
                    icon: <SquareArrowOutUpRight size={14} />,
                    childProps: {
                        onPress: () => {
                            window.open(`/project-center/${jobNo}`, '_blank')
                        },
                    },
                },
            ],
        },
        {
            key: 'Job menu',
            groupTitle: 'Job',
            children: [
                {
                    key: 'pin',
                    title: 'Pin Job',
                    icon: <PinIcon size={14} className="rotate-45" />,
                    childProps: {
                        onPress: () => {
                            alert('Tính năng đang được phát triển')
                        },
                    },
                },
                {
                    key: 'assignReassign',
                    title: 'Assign / Reassign',
                    icon: <UserPlus size={14} />,
                    childProps: {
                        onPress: () => {
                            onOpenAssignModal(jobNo as string)
                        },
                    },
                },
                {
                    key: 'deleteJob',
                    title: 'Delete',
                    icon: <Trash size={14} />,
                    childProps: {
                        color: 'danger',
                        onPress: () => {
                            handleDeleteJob()
                        },
                    },
                },
            ],
        },
        {
            key: 'Payment menu',
            groupTitle: 'Payment',
            children: [
                {
                    key: 'updateCost',
                    title: 'Update Cost',
                    icon: <CircleDollarSign size={14} />,
                    childProps: {
                        onPress: () => {
                            alert('Tính năng đang được phát triển')
                        },
                    },
                },
                {
                    key: 'markAsPaid',
                    title: 'Mark as Paid',
                    icon: <CircleCheck size={14} />,
                    childProps: {
                        onPress: () => {
                            alert('Tính năng đang được phát triển')
                        },
                    },
                },
            ],
        },
    ]
}
