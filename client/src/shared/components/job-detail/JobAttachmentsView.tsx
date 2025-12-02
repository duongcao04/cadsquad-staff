'use client'

import { FileText, PackageOpen } from 'lucide-react'
import { TJob } from '../../types'
import { HeroCard, HeroCardBody, HeroCardHeader } from '../ui/hero-card'
import { useProfile } from '../../../lib/queries'

type JobAttachmentsViewProps = {
    data: TJob['attachmentUrls']
}
export default function JobAttachmentsView({ data }: JobAttachmentsViewProps) {
    const { isAdmin } = useProfile()

    return (
        <HeroCard>
            <HeroCardHeader>
                <h3 className="text-sm uppercase">
                    Attachments ({data.length})
                </h3>
            </HeroCardHeader>
            <HeroCardBody className="p-0">
                {!data ||
                    (data.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-10 text-text-subdued">
                            <PackageOpen
                                size={32}
                                strokeWidth={1}
                                className="mb-2"
                            />
                            <p className="text-text-subdued text-sm">
                                No attachments found.
                            </p>
                            {isAdmin && (
                                <p className="text-text-subdued text-sm underline underline-offset-2 hover:text-text-default cursor-pointer w-fit">
                                    Add one
                                </p>
                            )}
                        </div>
                    ))}
                {data?.map((attachment, idx) => (
                    <div
                        key={idx}
                        className="flex items-center justify-between p-4 border-b border-default-100 last:border-0 hover:bg-default-50"
                    >
                        <div className="flex items-center gap-3">
                            <div className="bg-primary-50 p-2 rounded-lg text-primary">
                                <FileText size={20} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">
                                    {attachment}
                                </span>
                            </div>
                        </div>
                        {/* <Button
                            size="sm"
                            variant="light"
                            as={Link}
                            href={file.url}
                            isExternal
                        >
                            Download
                        </Button> */}
                    </div>
                ))}

                {/* URL Links */}
                {/* {job.attachmentUrls?.map((url, idx) => (
                    <div
                        key={idx}
                        className="flex items-center justify-between p-4 border-b border-default-100 last:border-0 hover:bg-default-50"
                    >
                        <div className="flex items-center gap-3">
                            <div className="bg-secondary-50 p-2 rounded-lg text-secondary">
                                <IconLink size={20} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium truncate max-w-[200px]">
                                    {url}
                                </span>
                                <span className="text-xs text-default-400">
                                    External Link
                                </span>
                            </div>
                        </div>
                        <Button
                            size="sm"
                            variant="light"
                            as={Link}
                            href={url}
                            isExternal
                        >
                            Visit
                        </Button>
                    </div>
                ))}

                {job.files?.length === 0 &&
                    job.attachmentUrls?.length === 0 && (
                        <div className="p-8 text-center text-default-400">
                            No attachments found.
                        </div>
                    )} */}
            </HeroCardBody>
        </HeroCard>
    )
}
