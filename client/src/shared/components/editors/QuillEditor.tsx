import React from 'react'

import dynamic from 'next/dynamic'
const ReactQuill = dynamic(() => import('react-quill-new'), {
    ssr: false,
})
import 'react-quill-new/dist/quill.snow.css'

type QuillEditorProps = {
    defaultValue?: string
    toolbar?: unknown
    formats?: string[]
    onChange?: (value: string) => void
}
export default function QuillEditor({
    defaultValue,
    toolbar = [
        [{ header: [1, 2, 3, false] }],
        [{ color: [] }, { background: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [
            { list: 'ordered' },
            { list: 'bullet' },
            { indent: '-1' },
            { indent: '+1' },
        ],
        ['link', 'image'],
        ['clean'],
    ] as unknown,
    formats = [
        'header',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'bullet',
        'indent',
        'link',
        'image',
        'color',
        'background',
    ],
    onChange,
}: QuillEditorProps) {
    return (
        <ReactQuill
            defaultValue={defaultValue}
            theme="snow"
            modules={{
                toolbar,
                formats,
                placeholder: 'Write a comment here ...',
            }}
            style={{
                minHeight: '100px',
            }}
            onChange={(value) => {
                onChange?.(value)
            }}
        />
    )
}
