import { Button, Divider } from '@heroui/react'
import { type TJobFiltersInput } from '@/lib/validationSchemas'
import type { JobColumn } from '@/shared/types'
import {
    HeroDrawer,
    HeroDrawerBody,
    HeroDrawerContent,
    HeroDrawerFooter,
    HeroDrawerHeader,
} from '../ui/hero-drawer'
import FilterView from './FilterView'

export type THeaderColumns = {
    title: string
    key: JobColumn
    icon?: React.ReactNode
}[]

type FilterDrawerProps = {
    isOpen: boolean
    onClose: () => void
    filters: TJobFiltersInput
    onFiltersChange: (filters: TJobFiltersInput) => void
}
export function FilterDrawer({
    isOpen,
    onClose,
    filters,
    onFiltersChange,
}: FilterDrawerProps) {
    return (
        <HeroDrawer isOpen={isOpen} onClose={onClose} closeButton>
            <HeroDrawerContent className="max-w-full lg:max-w-[50%] xl:max-w-[30%]">
                <HeroDrawerHeader>Filter jobs</HeroDrawerHeader>
                <Divider />
                <HeroDrawerBody>
                    <FilterView
                        filters={filters}
                        onFiltersChange={onFiltersChange}
                    />
                </HeroDrawerBody>
                <HeroDrawerFooter className="grid grid-cols-2 gap-3">
                    <Button
                        variant="light"
                        className="w-full!"
                        onPress={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="solid"
                        color="primary"
                        className="w-full!"
                        onPress={() => {
                            alert('Tính năng đang được phát triển')
                        }}
                    >
                        Apply
                    </Button>
                </HeroDrawerFooter>
            </HeroDrawerContent>
        </HeroDrawer>
    )
}
