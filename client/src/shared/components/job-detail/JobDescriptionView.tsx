'use client'

import { addToast } from '@heroui/react'
import {
    BlockquotePlugin,
    BoldPlugin,
    H1Plugin,
    H2Plugin,
    H3Plugin,
    HeadingPlugin,
    ItalicPlugin,
    UnderlinePlugin,
} from '@platejs/basic-nodes/react'
import { Pencil } from 'lucide-react'
import { Value } from 'platejs'
import { Plate, usePlateEditor } from 'platejs/react'
import { serializeHtml } from 'platejs/static'
import { useMemo, useState } from 'react'
import { useProfile, useUpdateJobMutation } from '../../../lib/queries'
import { TJob } from '../../types'
import { BlockquoteElement } from '../ui/blockquote-node'
import { Editor, EditorContainer } from '../ui/editor'
import { FixedToolbar } from '../ui/fixed-toolbar'
import { H1Element, H2Element, H3Element } from '../ui/heading-node'
import { HeroButton } from '../ui/hero-button'
import { HeroCard, HeroCardBody, HeroCardHeader } from '../ui/hero-card'
import HtmlReactParser from '../ui/htnl-react-parser'
import { MarkToolbarButton } from '../ui/mark-toolbar-button'
import { ToolbarButton } from '../ui/toolbar'
import { HeroTooltip } from '../ui/hero-tooltip'

type Props = {
    job: TJob
}

export default function JobDescriptionView({ job }: Props) {
    const updateJobMutation = useUpdateJobMutation()

    const [isEditable, setIsEditable] = useState(false)

    const [inputValue, setInputValue] = useState<Value | undefined>(undefined)

    const { isAdmin } = useProfile()
    const canEdit = useMemo(() => isAdmin && isEditable, [isEditable, isAdmin])

    const editor = usePlateEditor({
        plugins: [
            HeadingPlugin,
            BoldPlugin,
            ItalicPlugin,
            UnderlinePlugin,
            H1Plugin.withComponent(H1Element),
            H2Plugin.withComponent(H2Element),
            H3Plugin.withComponent(H3Element),
            BlockquotePlugin.withComponent(BlockquoteElement),
        ],
        value: inputValue,
        handlers: {
            onChange: (ctx) => {
                setInputValue(ctx.value)
            },
        },
    })

    const onSave = async () => {
        const isEmpty = editor.api.isEmpty()
        if (isEmpty) {
            addToast({
                title: 'Vui lòng nhập ít nhất 1 từ khoá',
                color: 'danger',
            })
            return
        }
        const html = await serializeHtml(editor)
        await updateJobMutation.mutateAsync(
            {
                jobId: job.id,
                data: { description: html },
            },
            {
                onSuccess: () => {
                    setInputValue(undefined)
                    setIsEditable(false)
                },
            }
        )
    }

    return (
        <HeroCard>
            {/* Description */}
            <HeroCardHeader className="justify-between py-1">
                <h3 className="text-sm uppercase">Description</h3>
                {isAdmin ? (
                    <>
                        {isEditable ? (
                            <div className="flex items-center justify-end gap-2">
                                <HeroButton
                                    size="sm"
                                    onPress={() => {
                                        setIsEditable(false)
                                    }}
                                    variant="light"
                                    color="default"
                                >
                                    Cancel
                                </HeroButton>
                                <HeroButton
                                    color="blue"
                                    size="sm"
                                    onPress={onSave}
                                >
                                    Save
                                </HeroButton>
                            </div>
                        ) : (
                            <HeroTooltip content="Edit">
                                <HeroButton
                                    isIconOnly
                                    className="size-8.5! aspect-square!"
                                    variant="light"
                                    onPress={() => {
                                        setIsEditable(true)
                                        if (Boolean(inputValue)) {
                                            if (job.description) {
                                                const slateValue =
                                                    editor.api.html.deserialize(
                                                        {
                                                            element:
                                                                job.description,
                                                        }
                                                    )
                                                setInputValue(
                                                    slateValue as Value
                                                )
                                                editor.tf.setValue(
                                                    slateValue as Value
                                                )
                                            }
                                        }
                                    }}
                                >
                                    <Pencil
                                        size={14}
                                        className="text-text-subdued"
                                    />
                                </HeroButton>
                            </HeroTooltip>
                        )}
                    </>
                ) : (
                    <></>
                )}
            </HeroCardHeader>
            <HeroCardBody className="gap-6">
                {canEdit ? (
                    <Plate editor={editor}>
                        <FixedToolbar className="flex justify-start gap-1 rounded-t-lg">
                            <ToolbarButton
                                onClick={() => editor.tf.h1.toggle()}
                            >
                                H1
                            </ToolbarButton>
                            <ToolbarButton
                                onClick={() => editor.tf.h2.toggle()}
                            >
                                H2
                            </ToolbarButton>
                            <ToolbarButton
                                onClick={() => editor.tf.h3.toggle()}
                            >
                                H3
                            </ToolbarButton>
                            <ToolbarButton
                                onClick={() => editor.tf.blockquote.toggle()}
                            >
                                Quote
                            </ToolbarButton>
                            <MarkToolbarButton
                                nodeType="bold"
                                tooltip="Bold (⌘+B)"
                            >
                                B
                            </MarkToolbarButton>
                            <MarkToolbarButton
                                nodeType="italic"
                                tooltip="Italic (⌘+I)"
                            >
                                I
                            </MarkToolbarButton>
                            <MarkToolbarButton
                                nodeType="underline"
                                tooltip="Underline (⌘+U)"
                            >
                                U
                            </MarkToolbarButton>
                        </FixedToolbar>
                        {/* Provides editor context */}
                        <EditorContainer>
                            {/* Styles the editor area */}
                            <Editor
                                style={{
                                    padding: '8px 20px',
                                    minHeight: '100px',
                                }}
                                placeholder="Type your amazing comment here..."
                            />
                        </EditorContainer>
                    </Plate>
                ) : (
                    <>
                        {job.description ? (
                            <HtmlReactParser htmlString={job.description} />
                        ) : (
                            <div className="flex flex-col items-center gap-0 pb-8">
                                <p className="text-text-subdued text-sm whitespace-pre-line leading-relaxed text-center">
                                    No description provided.
                                </p>
                                {isAdmin && (
                                    <p
                                        className="text-text-subdued text-sm underline underline-offset-2 hover:text-text-default cursor-pointer w-fit"
                                        onClick={() => {
                                            setIsEditable(true)
                                        }}
                                    >
                                        Write anything
                                    </p>
                                )}
                            </div>
                        )}
                    </>
                )}
            </HeroCardBody>
        </HeroCard>
    )
}
