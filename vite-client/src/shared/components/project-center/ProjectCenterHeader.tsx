/* eslint-disable react-hooks/set-state-in-effect */
import { BreadcrumbItem, Breadcrumbs, Skeleton } from '@heroui/react'
import { Link } from '@tanstack/react-router'
import { useStore } from '@tanstack/react-store'
import { HouseIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

import { PageHeading } from '@/shared/components'

import { metadataStore } from '../../stores'

export function ProjectCenterHeader() {
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
            title="Project center"
            description="Your project management hub — track progress and status effortlessly"
            classNames={{
                wrapper: '!py-3 pl-6 pr-3.5',
            }}
            breadcrumbs={
                <Skeleton
                    className="w-fit h-fit rounded-md"
                    isLoaded={!isLoading}
                >
                    <Breadcrumbs>
                        <BreadcrumbItem>
                            <Link
                                to={'/'}
                                title="Home"
                                className="block text-text-subdued hover:text-primary transition duration-100"
                            >
                                <HouseIcon size={14} />
                            </Link>
                        </BreadcrumbItem>
                        <BreadcrumbItem>
                            <Link
                                to="/project-center"
                                title="Project Center"
                                className="block text-text-subdued hover:text-primary transition duration-100"
                            >
                                Project center
                            </Link>
                        </BreadcrumbItem>
                        <BreadcrumbItem>
                            <p className="text-primary font-medium">
                                {metadata.title}
                            </p>
                        </BreadcrumbItem>
                    </Breadcrumbs>
                </Skeleton>
            }
        />
    )
}
