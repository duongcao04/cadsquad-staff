import { useState, useEffect } from 'react'
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Textarea,
    Select,
    SelectItem,
    Avatar,
    Chip,
} from '@heroui/react'
import { Mail, Send, Paperclip, FileText, Copy } from 'lucide-react'

// --- Mock Templates ---
const EMAIL_TEMPLATES = [
    {
        key: 'welcome',
        label: 'Welcome to the Team',
        subject: 'Welcome aboard! Here is your login info.',
        body: 'Hi {{name}},\n\nWe are thrilled to have you join us! Please find attached the employee handbook...',
    },
    {
        key: 'task_update',
        label: 'Task Assignment',
        subject: 'New Task Assigned: [Task Name]',
        body: 'Hi {{name}},\n\nYou have been assigned to a new task. Please check the dashboard for details.',
    },
    {
        key: 'warning',
        label: 'Policy Reminder',
        subject: 'Important: Policy Reminder',
        body: 'Dear {{name}},\n\nThis is a reminder regarding our company policy on...',
    },
]

interface EmailUserModalProps {
    isOpen: boolean
    onClose: () => void
    user: {
        id: string
        displayName: string
        email: string
        avatar: string
        role?: string
    } | null
}

export const EmailUserModal = ({
    isOpen,
    onClose,
    user,
}: EmailUserModalProps) => {
    const [subject, setSubject] = useState('')
    const [message, setMessage] = useState('')
    const [showCc, setShowCc] = useState(false)
    const [isSending, setIsSending] = useState(false)
    const [attachments, setAttachments] = useState<string[]>([])

    // Reset form when user changes
    useEffect(() => {
        if (isOpen) {
            setSubject('')
            setMessage('')
            setAttachments([])
            setShowCc(false)
        }
    }, [isOpen, user])

    const handleTemplateSelect = (key: string) => {
        const template = EMAIL_TEMPLATES.find((t) => t.key === key)
        if (template && user) {
            setSubject(template.subject)
            setMessage(template.body.replace('{{name}}', user.displayName))
        }
    }

    const handleSend = () => {
        setIsSending(true)
        console.log(`Sending email to ${user?.email}`, { subject, message })

        setTimeout(() => {
            setIsSending(false)
            onClose()
        }, 1000)
    }

    const addMockAttachment = () => {
        setAttachments([...attachments, 'Policy_Document_v2.pdf'])
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="2xl"
            scrollBehavior="inside"
            backdrop="blur"
            classNames={{
                header: 'border-b border-border-default',
                footer: 'border-t border-border-default',
            }}
        >
            <ModalContent>
                {(close) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1 bg-slate-50/50">
                            <span className="text-xl flex items-center gap-2">
                                <Mail className="text-slate-400" size={20} />
                                Compose Email
                            </span>
                        </ModalHeader>

                        <ModalBody className="p-0">
                            {/* 1. Recipient Info */}
                            <div className="px-6 py-4 bg-white">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3 p-2 bg-slate-50 border border-slate-200 rounded-xl pr-6 w-fit">
                                        <Avatar src={user?.avatar} size="sm" />
                                        <div>
                                            <p className="text-xs text-slate-500 font-bold uppercase">
                                                To:
                                            </p>
                                            <p className="text-sm font-semibold text-slate-800">
                                                {user?.displayName} &lt;
                                                {user?.email}&gt;
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="light"
                                        className="text-slate-500"
                                        onPress={() => setShowCc(!showCc)}
                                    >
                                        Cc/Bcc
                                    </Button>
                                </div>

                                {showCc && (
                                    <div className="grid grid-cols-2 gap-4 mb-4 animate-in fade-in slide-in-from-top-2">
                                        <Input
                                            label="Cc"
                                            size="sm"
                                            variant="flat"
                                            placeholder="cc@example.com"
                                        />
                                        <Input
                                            label="Bcc"
                                            size="sm"
                                            variant="flat"
                                            placeholder="bcc@example.com"
                                        />
                                    </div>
                                )}

                                {/* 2. Template Selector */}
                                <div className="flex items-center gap-3 mb-4">
                                    <Select
                                        placeholder="Insert Template"
                                        size="sm"
                                        className="max-w-xs"
                                        startContent={
                                            <Copy
                                                size={14}
                                                className="text-slate-400"
                                            />
                                        }
                                        onChange={(e) =>
                                            handleTemplateSelect(e.target.value)
                                        }
                                    >
                                        {EMAIL_TEMPLATES.map((t) => (
                                            <SelectItem
                                                key={t.key}
                                                textValue={t.key}
                                            >
                                                {t.label}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                    <div className="h-px bg-slate-200 flex-1"></div>
                                </div>

                                {/* 3. Inputs */}
                                <div className="space-y-4">
                                    <Input
                                        label="Subject"
                                        placeholder="Enter email subject"
                                        variant="bordered"
                                        labelPlacement="outside"
                                        value={subject}
                                        onValueChange={setSubject}
                                        classNames={{
                                            inputWrapper: 'bg-white',
                                        }}
                                    />

                                    <div className="relative">
                                        <Textarea
                                            label="Message"
                                            placeholder="Type your message here..."
                                            variant="bordered"
                                            labelPlacement="outside"
                                            minRows={8}
                                            value={message}
                                            onValueChange={setMessage}
                                            classNames={{
                                                inputWrapper: 'bg-white',
                                            }}
                                        />
                                        {/* Formatting Toolbar Mock */}
                                        <div className="absolute bottom-3 left-3 flex gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 opacity-50 hover:opacity-100 transition-opacity">
                                            <button className="p-1 hover:bg-white rounded">
                                                <span className="font-bold font-serif text-xs">
                                                    B
                                                </span>
                                            </button>
                                            <button className="p-1 hover:bg-white rounded">
                                                <span className="italic font-serif text-xs">
                                                    I
                                                </span>
                                            </button>
                                            <button className="p-1 hover:bg-white rounded">
                                                <span className="underline font-serif text-xs">
                                                    U
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* 4. Attachments Area */}
                                <div className="mt-4">
                                    <div className="flex gap-2 flex-wrap">
                                        {attachments.map((file, i) => (
                                            <Chip
                                                key={i}
                                                variant="flat"
                                                color="primary"
                                                onClose={() =>
                                                    setAttachments(
                                                        attachments.filter(
                                                            (_, idx) =>
                                                                idx !== i
                                                        )
                                                    )
                                                }
                                                classNames={{ base: 'pl-2' }}
                                            >
                                                <span className="flex items-center gap-1 text-xs">
                                                    <FileText size={12} />{' '}
                                                    {file}
                                                </span>
                                            </Chip>
                                        ))}
                                        <Button
                                            size="sm"
                                            variant="solid"
                                            className="border-slate-300 text-slate-500"
                                            startContent={
                                                <Paperclip size={14} />
                                            }
                                            onPress={addMockAttachment}
                                        >
                                            Attach File
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </ModalBody>

                        <ModalFooter>
                            <Button variant="light" onPress={close}>
                                Discard
                            </Button>
                            <Button
                                color="primary"
                                endContent={!isSending && <Send size={16} />}
                                isLoading={isSending}
                                onPress={handleSend}
                                className="font-semibold"
                            >
                                {isSending ? 'Sending...' : 'Send Email'}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}
