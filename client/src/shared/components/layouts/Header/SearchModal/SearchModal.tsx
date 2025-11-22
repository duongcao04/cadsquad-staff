'use client'

import { useRef } from 'react'

import { useSearchJobs } from '@/lib/queries/useJob'
import { Input, Kbd, Tab, Tabs } from '@heroui/react'
import { Modal } from 'antd'
import {
    BriefcaseBusiness,
    CodeXml,
    FileText,
    History,
    SearchIcon,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useDebounceValue } from 'usehooks-ts'
import { JobList } from './JobList'

type Props = {
    isOpen: boolean
    onClose: () => void
}
export function SearchModal({ isOpen, onClose }: Props) {
    const t = useTranslations()
    const inputRef = useRef<HTMLInputElement | null>(null)

    const [inputValue, setInputValue] = useDebounceValue<string | undefined>(
        undefined,
        30
    )
    const { jobs } = useSearchJobs(inputValue)

    const handleClose = () => {
        onClose()
        setInputValue(undefined)
    }

    const catalogs = [
        {
            icon: History,
            titleKey: 'all',
            children: (
                <div>
                    {inputValue ? (
                        <>
                            <div className="sticky top-0 z-10 bg-background pr-2 pt-2 pb-3">
                                <div className="flex items-center justify-start gap-4">
                                    <p className="font-medium text-defaultp5 text-nowrap">
                                        {t('job')}
                                        <span className="pl-2 font-semibold text-text-muted">
                                            ({jobs?.length})
                                        </span>
                                    </p>
                                    <div className="bg-text-muted h-[1px] w-full" />
                                </div>
                            </div>
                            <JobList data={jobs} onClose={handleClose} />
                        </>
                    ) : (
                        <p className="py-5 text-base font-medium text-text-muted text-center">
                            {t('plsEnterKeywords')}
                        </p>
                    )}
                </div>
            ),
        },
        {
            icon: BriefcaseBusiness,
            titleKey: 'job',
            children: (
                <div>
                    {inputValue ? (
                        <>
                            <div className="sticky top-0 z-10 bg-background pr-2 pt-2 pb-3">
                                <div className="flex items-center justify-start gap-4">
                                    <p className="font-medium text-defaultp5 text-nowrap">
                                        {t('job')}
                                        <span className="pl-2 font-semibold text-text-muted">
                                            ({jobs?.length})
                                        </span>
                                    </p>
                                    <div className="bg-text-muted h-[1px] w-full" />
                                </div>
                            </div>
                            <JobList data={jobs} onClose={handleClose} />{' '}
                        </>
                    ) : (
                        <p className="py-5 text-base font-medium text-text-muted text-center">
                            {t('plsEnterKeywords')}
                        </p>
                    )}
                </div>
            ),
        },
        { icon: CodeXml, titleKey: 'feature', children: <p>Khong tim thay</p> },
        {
            icon: FileText,
            titleKey: 'document',
            children: <p>Khong tim thay</p>,
        },
    ]

    return (
        <Modal
            closable={false}
            open={isOpen}
            onOk={onClose}
            onCancel={handleClose}
            style={{ top: 25 }}
            styles={{
                mask: {
                    background: '#000000b7',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)', // for Safari support
                },
                content: {
                    borderRadius: '24px',
                },
            }}
            footer={false}
            classNames={{
                content: 'p-0!',
            }}
            width={{
                xs: '90%',
                sm: '80%',
                md: '70%',
                lg: '60%',
                xl: '40%',
                xxl: '40%',
            }}
            afterOpenChange={(open) => {
                if (open) inputRef.current?.focus() // ✅ Optionally use AntD event
            }}
        >
            <>
                <div className="px-6 pt-3.5 pb-5">
                    <Input
                        ref={inputRef}
                        placeholder={t('search')}
                        size="lg"
                        value={inputValue ?? ''}
                        onChange={(e) => {
                            const value = e.target.value
                            setInputValue(value)
                        }}
                        startContent={<SearchIcon />}
                        endContent={<Kbd>ESC</Kbd>}
                    />
                </div>
                <div className="pb-5">
                    <Tabs
                        aria-label="Search modal tabs"
                        fullWidth
                        classNames={{
                            base: 'px-5',
                        }}
                        disabledKeys={['document', 'feature']}
                    >
                        {catalogs.map((catalog) => {
                            return (
                                <Tab
                                    key={catalog.titleKey}
                                    title={
                                        <div className="flex items-center justify-start gap-2">
                                            <catalog.icon size={16} />
                                            <p>{t(catalog.titleKey)}</p>
                                        </div>
                                    }
                                >
                                    <div className="min-h-[400px] max-h-[calc(100vh-230px)] overflow-y-auto pl-5 pr-2">
                                        {catalog.children}
                                    </div>
                                </Tab>
                            )
                        })}
                    </Tabs>
                </div>
            </>
        </Modal>
    )
}
