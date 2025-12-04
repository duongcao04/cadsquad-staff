'use client'

import { Avatar } from '@heroui/react'
import { Slash } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { jobTypeApi } from '../../../lib/api'
import { mapJobType } from '../../../lib/queries'
import { IJobTypeResponse } from '../../interfaces'
import { TJobType } from '../../types' // Adjust path as needed
import { HeroAutocomplete, HeroAutocompleteItem } from '../ui/hero-autocomplete'

type JobNoFieldProps = {
    jobTypes: TJobType[]
    selectedKey?: string | null
    onSelectionChange: (key: string | null) => void
    label?: string
    placeholder?: string
    isLoading?: boolean
    isInvalid?: boolean
    errorMessage?: React.ReactNode
}

export function JobNoField({
    jobTypes,
    selectedKey,
    onSelectionChange,
    label = 'No.',
    placeholder = 'Select type',
    errorMessage,
    isInvalid,
    isLoading,
}: JobNoFieldProps) {
    const [selectedType, setSelectedType] = useState<TJobType | null>(null)

    useEffect(() => {
        if (!selectedKey) {
            setSelectedType(null)
            return
        }

        console.log(selectedKey)
        jobTypeApi.findOne(selectedKey).then((res) => {
            setSelectedType(mapJobType(res.data.result as IJobTypeResponse))
        })
    }, [selectedKey])

    // 2. Calculate the Result String: code + "." + count
    const jobNoResult = useMemo(() => {
        if (!selectedType) return '...' // Default state

        // Safely access count. Assuming the relation name is 'jobs' inside _count
        // The type definition says Record<string, string>, but usually counts are numbers/strings
        const count = selectedType._count?.jobs ?? '0'

        return `${selectedType.code}.${count}`
    }, [selectedType])

    const handleSelectionChange = (key: React.Key | null) => {
        onSelectionChange(key as string | null)
    }

    // 3. Define error rendering
    const errorRender =
        isInvalid && errorMessage ? (
            <div className="text-tiny text-danger">{errorMessage}</div>
        ) : null

    return (
        <div className="grid grid-cols-3 items-end gap-4">
            <HeroAutocomplete
                isRequired
                label={label}
                placeholder={placeholder}
                defaultItems={jobTypes}
                selectedKey={selectedKey}
                onSelectionChange={handleSelectionChange}
                isInvalid={isInvalid}
                errorMessage={errorMessage} // Pass to component if it handles it internally
                isLoading={isLoading}
                labelPlacement="outside"
                // Hide internal error message if we are rendering it manually below,
                // otherwise remove the manual errorRender block below
                className="max-w-full"
            >
                {(item) => {
                    const jobItem = item as TJobType

                    return (
                        <HeroAutocompleteItem
                            key={jobItem.id}
                            textValue={jobItem.displayName}
                        >
                            <div className="flex gap-3 items-center">
                                {/* Logo / Avatar Section */}
                                <Avatar
                                    alt={jobItem.displayName}
                                    className="shrink-0"
                                    size="sm"
                                    name={jobItem.displayName.charAt(0)}
                                    style={{
                                        backgroundColor:
                                            jobItem.hexColor || undefined,
                                        color: jobItem.hexColor
                                            ? '#fff'
                                            : undefined,
                                    }}
                                />

                                {/* Text Details Section */}
                                <div className="flex flex-col">
                                    <span className="text-small text-foreground font-medium">
                                        {jobItem.displayName}
                                    </span>
                                    <div className="flex gap-2 text-tiny text-default-400">
                                        <span>Code: {jobItem.code}</span>
                                        {jobItem._count?.jobs && (
                                            <span>
                                                • {jobItem._count.jobs} Jobs
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </HeroAutocompleteItem>
                    )
                }}
            </HeroAutocomplete>

            {/* Display the calculated result */}
            <div className="h-12 flex items-center justify-start gap-3">
                <Slash className="rotate-[-20deg] text-default-300" />

                <p className="text-lg font-semibold text-foreground">
                    {jobNoResult}
                </p>
            </div>

            {/* Render error if not handled by HeroAutocomplete internally */}
            {/* If HeroAutocomplete handles errorMessage via props, you might not need this line */}
            {/* {errorRender} */}
        </div>
    )
}
