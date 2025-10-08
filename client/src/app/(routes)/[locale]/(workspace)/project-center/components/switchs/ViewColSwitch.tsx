'use client'

import { Spinner, Switch } from '@heroui/react'
import React from 'react'
import { JobColumn } from '@/shared/types/job.type'

type Props = {
    isSelected: boolean
    onSwitch: (key: JobColumn, isSelected: boolean) => void
    colKey: JobColumn
    isLoading?: boolean
}
export default function ViewColSwitch({
    colKey,
    isSelected,
    onSwitch,
    isLoading = false,
}: Props) {
    if (isLoading) {
        return <Spinner size="sm" />
    }
    return (
        <Switch
            size="sm"
            isSelected={isSelected}
            classNames={{
                base: 'bg-background',
            }}
            onValueChange={(isSelected) => {
                onSwitch(colKey, isSelected)
            }}
        />
    )
}
