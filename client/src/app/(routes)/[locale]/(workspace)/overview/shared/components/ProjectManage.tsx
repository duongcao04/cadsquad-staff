'use client'

import { Button } from '@heroui/react'
import { ChevronRight } from 'lucide-react'

import { Link } from '@/i18n/navigation'

export default function ProjectManage() {
    return (
        <div
            className="p-2 rounded-2xl h-full border border-gray-100"
            style={{
                boxShadow:
                    'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px',
            }}
        >
            <div className="pl-3 pr-5 py-3 w-full flex items-center justify-between">
                <h3 className="font-semibold text-lg text-secondary">
                    Active Projects
                </h3>
                <Link className="block" href={'/project-center?tab=active'}>
                    <Button
                        size="sm"
                        endContent={<ChevronRight size={16} />}
                        variant="light"
                        color="secondary"
                        className="rounded-full"
                    >
                        View all
                    </Button>
                </Link>
            </div>
        </div>
    )
}
