'use client'

import { Input } from '@heroui/react'
import React, { useState } from 'react'
import { jobModalInputClassNames } from '@/shared/components/modals/CreateJobModal'
import { PlusIcon, SquareArrowOutUpRight, X } from 'lucide-react'
import { HeroButton } from '@/shared/components/customize/HeroButton'
import { Link } from '@/i18n/navigation'
import { FormikProps } from 'formik'
import { CreateJobInput } from '@/shared/validationSchemas/job.schema'

type Props = {
    formik: FormikProps<CreateJobInput>
}
export default function InsertAttachments({ formik }: Props) {
    const [inputValue, setInputValue] = useState('')
    const [touchedButton, setTouchedButton] = useState(false)
    const isInvalid = React.useMemo(() => {
        if (touchedButton && inputValue === '') return true
        return false
    }, [inputValue, touchedButton])

    return (
        <div>
            <div className="flex items-start justify-start gap-1.5">
                <Input
                    placeholder="Enter attachment url"
                    variant="faded"
                    labelPlacement="outside-left"
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value)
                    }}
                    isInvalid={isInvalid}
                    errorMessage="Please enter a valid url"
                    classNames={{
                        ...jobModalInputClassNames,
                        mainWrapper: '!w-full',
                        base: '!w-full',
                    }}
                />
                <HeroButton
                    isIconOnly
                    variant="bordered"
                    size="md"
                    onPress={() => {
                        setTouchedButton(true)
                        if (inputValue) {
                            const rest = formik.values.attachmentUrls ?? []
                            const newAttributes = [inputValue, ...rest]
                            formik.setFieldValue(
                                'attachmentUrls',
                                newAttributes
                            )
                            setTouchedButton(false)
                            setInputValue('')
                        }
                    }}
                >
                    <PlusIcon size={14} />
                </HeroButton>
            </div>
            <ul className="mt-2 max-h-[6lh] overflow-y-auto">
                {formik.values?.attachmentUrls &&
                    formik.values.attachmentUrls.length > 0 &&
                    formik.values.attachmentUrls.map((url, idx) => {
                        return (
                            <li
                                key={idx}
                                className="flex items-center justify-start gap-2.5 group !text-foreground link !w-fit"
                            >
                                <X
                                    size={14}
                                    className="!text-danger hidden group-hover:block transition duration-150"
                                />
                                <Link
                                    href={url}
                                    target={'_blank'}
                                    className="leading-loose !text-foreground link"
                                >
                                    {url}
                                </Link>
                                <SquareArrowOutUpRight
                                    size={12}
                                    className="hidden group-hover:block transition duration-150"
                                />
                            </li>
                        )
                    })}
            </ul>
        </div>
    )
}
