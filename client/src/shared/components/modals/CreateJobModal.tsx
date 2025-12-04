'use client'

import { ScrollArea } from '@radix-ui/react-scroll-area'
import CreateJobForm from '../forms/CreateJobForm'
import {
    HeroModal,
    HeroModalBody,
    HeroModalContent,
    HeroModalHeader,
} from '../ui/hero-modal'
import { ScrollBar } from '../ui/scroll-area'

type Props = {
    isOpen: boolean
    onClose: () => void
}
export function CreateJobModal({ isOpen, onClose }: Props) {
    return (
        <HeroModal
            isOpen={isOpen}
            onClose={onClose}
            classNames={{
                base: 'max-w-[90%] sm:max-w-[80%] md:max-w-[80%] xl:max-w-[60%]',
            }}
        >
            <HeroModalContent>
                <HeroModalHeader>
                    <div className="space-y-1">
                        <p className="text-lg font-semibold">Create new job</p>
                    </div>
                </HeroModalHeader>
                <HeroModalBody>
                    <ScrollArea className="size-full">
                        <ScrollBar orientation="horizontal" />
                        <ScrollBar orientation="vertical" />
                        <CreateJobForm onSubmit={onClose} />
                    </ScrollArea>
                </HeroModalBody>
            </HeroModalContent>
        </HeroModal>
    )
}
