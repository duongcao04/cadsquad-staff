'use client'

import { Link } from '@/i18n/navigation'
import { PageHeading } from '@/shared/components'
import { BreadcrumbItem, Breadcrumbs, Skeleton } from '@heroui/react'
import { useStore } from '@tanstack/react-store'
import { HouseIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { metadataStore } from '../stores'

export function ProjectCenterHeader() {
    const t = useTranslations()
    const tMetadata = useTranslations('metadata.projectCenter')
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(false)
    }, [])

    const metadata = useStore(metadataStore, (state) => ({
        title: state.title,
        description: state.description,
    }))

    return (
        <PageHeading
            title={t('projectCenter')}
            description={tMetadata('description')}
            classNames={{
                wrapper: '!pb-3',
            }}
            breadcrumbs={
                false && (
                    <Skeleton
                        className="w-fit h-fit rounded-md"
                        isLoaded={!isLoading}
                    >
                        <Breadcrumbs>
                            <BreadcrumbItem>
                                <Link
                                    href={'/'}
                                    title="Home"
                                    className="block text-text-subdued hover:text-primary transition duration-100"
                                >
                                    <HouseIcon size={14} />
                                </Link>
                            </BreadcrumbItem>
                            <BreadcrumbItem>
                                <Link
                                    href="/project-center"
                                    title="Project Center"
                                    className="block text-text-subdued hover:text-primary transition duration-100"
                                >
                                    {t('projectCenter')}
                                </Link>
                            </BreadcrumbItem>
                            <BreadcrumbItem>
                                <p className="text-primary font-medium">
                                    {metadata.title}
                                </p>
                            </BreadcrumbItem>
                        </Breadcrumbs>
                    </Skeleton>
                )
            }
        />
    )
}
