import React, { useEffect, useRef, useState } from 'react'

import { Input, Kbd } from '@heroui/react'
import { Modal } from 'antd'
import {
    BriefcaseBusiness,
    CodeXml,
    Component,
    FileText,
    SearchIcon,
} from 'lucide-react'
import { useKeyboardShortcuts } from 'use-keyboard-shortcuts'

const catalogs = [
    { icon: CodeXml, title: 'Tính năng' },
    { icon: BriefcaseBusiness, title: 'Dự án' },
    { icon: FileText, title: 'Tài liệu' },
    { icon: Component, title: 'Thành phần' },
]

type Props = {
    isOpen: boolean
    onClose: () => void
}
export default function SearchModal({ isOpen, onClose }: Props) {
    //! TODO: https://mobbin.com/ search styles
    const [currentCatalog, setCurrentCatalog] = useState(catalogs[0])

    //! TODO: fix inputRef for auto focus
    const inputRef = useRef<HTMLInputElement | null>(null)

    // Auto focus on mount
    useEffect(() => {
        inputRef.current?.focus()
    }, [])

    useKeyboardShortcuts([
        {
            keys: ['escape'],
            onEvent: () => onClose(),
        },
    ])

    return (
        <Modal
            closable={false}
            open={isOpen}
            onOk={onClose}
            onCancel={onClose}
            style={{ top: 120 }}
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
        >
            <>
                <div className="px-6 py-5">
                    <Input
                        ref={inputRef}
                        placeholder="Search"
                        size="lg"
                        startContent={<SearchIcon />}
                        endContent={<Kbd>ESC</Kbd>}
                    />
                </div>
                <div className="px-5 pb-20 grid grid-cols-3 gap-4">
                    <div className="col-span-1 space-y-0.5">
                        {catalogs.map((catalog, idx) => {
                            const isSelected =
                                currentCatalog.title === catalog.title
                            return (
                                <button
                                    key={idx}
                                    className={`${
                                        isSelected
                                            ? 'bg-text3'
                                            : 'bg-transparent hover:bg-text3'
                                    } transition duration-150 px-3 py-2.5 font-semibold w-full rounded-xl flex items-center justify-start gap-x-3 cursor-pointer`}
                                    onClick={() => setCurrentCatalog(catalog)}
                                >
                                    <catalog.icon
                                        size={20}
                                        className="text-text2"
                                    />
                                    <p className="text-left">{catalog.title}</p>
                                </button>
                            )
                        })}
                    </div>
                    <div className="col-span-2 size-full">
                        <p className="pt-3 w-full text-base text-text2 text-center">
                            Không tìm thấy dữ liệu
                        </p>
                    </div>
                </div>
            </>
        </Modal>
    )
}
