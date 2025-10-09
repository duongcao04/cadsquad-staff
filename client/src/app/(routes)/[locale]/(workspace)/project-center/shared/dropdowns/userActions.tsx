import { ActionGroup } from '../components/TableActionDropdown'

import { CopyIcon, PinIcon, SquareArrowOutUpRight } from 'lucide-react'

export function userActions(jobNo: string): ActionGroup[] {
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
                    key: 'duplicateJob',
                    title: 'Duplicate Job',
                    icon: <CopyIcon size={14} />,
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
