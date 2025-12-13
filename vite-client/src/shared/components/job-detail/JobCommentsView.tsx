import { optimizeCloudinary } from '@/lib/cloudinary'
import { dateFormatter } from '@/lib/dayjs'
import { useComments, useCreateComment, useProfile } from '@/lib/queries'
import type { TJob } from '@/shared/types'
import { addToast, Avatar, Button, Divider } from '@heroui/react'
import {
    BlockquotePlugin,
    BoldPlugin,
    H1Plugin,
    H2Plugin,
    H3Plugin,
    ItalicPlugin,
    UnderlinePlugin,
} from '@platejs/basic-nodes/react'
import { MessageSquareMore } from 'lucide-react'
import { Plate, usePlateEditor } from 'platejs/react'
import { serializeHtml } from 'platejs/static'
import { BlockquoteElement } from '../ui/blockquote-node'
import { Editor, EditorContainer } from '../ui/editor'
import { FixedToolbar } from '../ui/fixed-toolbar'
import { H1Element, H2Element, H3Element } from '../ui/heading-node'
import { HeroButton } from '../ui/hero-button'
import {
    HeroCard,
    HeroCardBody,
    HeroCardFooter,
    HeroCardHeader,
} from '../ui/hero-card'
import HtmlReactParser from '../ui/html-react-parser'
import { MarkToolbarButton } from '../ui/mark-toolbar-button'
import { ToolbarButton } from '../ui/toolbar'

type JobCommentsViewProps = {
    job: TJob
}
export default function JobCommentsView({ job }: JobCommentsViewProps) {
    const { data: comments } = useComments(job.id)

    return (
        <div className="space-y-5">
            <AddCommentCard jobId={job.id} />
            <Divider />
            <HeroCard className="shadow-none border-none px-0! py-0!">
                <HeroCardHeader>
                    <h3 className="text-sm uppercase">
                        Comment ({comments.length})
                    </h3>
                </HeroCardHeader>
                <HeroCardBody className="gap-4">
                    {!comments ||
                        (comments.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-10 text-text-subdued">
                                <MessageSquareMore
                                    size={32}
                                    strokeWidth={1}
                                    className="mb-2"
                                />
                                <p className="text-text-subdued text-sm">
                                    No comments found.
                                </p>
                            </div>
                        ))}
                    {comments?.map((comment) => (
                        <div
                            key={comment.id}
                            className="flex gap-3 items-start"
                        >
                            <Avatar
                                src={optimizeCloudinary(comment.user.avatar)}
                                name={comment.user.displayName}
                                size="sm"
                                className="mt-1"
                            />
                            <div className="border border-border shadow-XS p-3 rounded-lg rounded-tl-none flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-semibold text-default-700">
                                        {comment.user.displayName}
                                    </span>
                                    <span className="text-[10px] text-default-400">
                                        {dateFormatter(comment.createdAt, {
                                            format: 'longDate',
                                        })}
                                    </span>
                                </div>
                                <p className="text-sm text-default-600">
                                    <HtmlReactParser
                                        htmlString={comment.content}
                                    />
                                </p>
                            </div>
                        </div>
                    ))}
                </HeroCardBody>
            </HeroCard>
        </div>
    )
}

function AddCommentCard({ jobId }: { jobId: string }) {
    const { data: profile } = useProfile()
    const createCommentMutation = useCreateComment()

    // const initialValue: Value = [
    //     {
    //         children: [{ text: 'Title' }],
    //         type: 'h3',
    //     },
    //     {
    //         children: [{ text: 'This is a quote.' }],
    //         type: 'blockquote',
    //     },
    //     {
    //         children: [
    //             { text: 'With some ' },
    //             { bold: true, text: 'bold' },
    //             { text: ' text for emphasis!' },
    //         ],
    //         type: 'p',
    //     },
    // ]

    const editor = usePlateEditor({
        plugins: [
            BoldPlugin,
            ItalicPlugin,
            UnderlinePlugin,
            H1Plugin.withComponent(H1Element),
            H2Plugin.withComponent(H2Element),
            H3Plugin.withComponent(H3Element),
            BlockquotePlugin.withComponent(BlockquoteElement),
        ],
        value: undefined,
    })

    const onSubmit = async () => {
        const isEmpty = editor.api.isEmpty()
        if (isEmpty) {
            addToast({
                title: 'Vui lòng nhập ít nhất 1 từ khoá',
                color: 'danger',
            })
            return
        }
        const html = await serializeHtml(editor)
        await createCommentMutation.mutateAsync({
            jobId: jobId,
            content: html,
        })
    }

    return (
        <HeroCard>
            <HeroCardHeader className="gap-3">
                <Avatar
                    src={optimizeCloudinary(profile.avatar)}
                    className="size-7"
                />
                <h3 className="text-sm text-text-default">Add a comment</h3>
            </HeroCardHeader>
            <Divider />
            <HeroCardBody>
                <Plate editor={editor}>
                    <FixedToolbar className="flex justify-start gap-1 rounded-t-lg">
                        <ToolbarButton onClick={() => editor.tf.h1.toggle()}>
                            H1
                        </ToolbarButton>
                        <ToolbarButton onClick={() => editor.tf.h2.toggle()}>
                            H2
                        </ToolbarButton>
                        <ToolbarButton onClick={() => editor.tf.h3.toggle()}>
                            H3
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.tf.blockquote.toggle()}
                        >
                            Quote
                        </ToolbarButton>
                        <MarkToolbarButton nodeType="bold" tooltip="Bold (⌘+B)">
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
            </HeroCardBody>
            <HeroCardFooter>
                <Button size="sm" variant="light">
                    Cancel
                </Button>
                <HeroButton size="sm" color="blue" onPress={onSubmit}>
                    Submit
                </HeroButton>
            </HeroCardFooter>
        </HeroCard>
    )
}
