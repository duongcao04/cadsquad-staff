'use client'

import { baseUrl, cn, handleCopy } from '@/lib/utils'
import { Button, ButtonProps } from '@heroui/react'
import { CheckCheck, Copy } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useLocale, useTranslations } from 'next-intl'

type Props = ButtonProps & {
    textValue: string
    replaceLocale?: boolean
    iconSize?: number
    iconClassName?: string
    onCopySuccess?: () => void
}

export default function HeroCopyButton({
    textValue,
    replaceLocale = false,
    iconSize = 12,
    iconClassName,
    onCopySuccess,
    ...props
}: Props) {
    const locale = useLocale()
    const t = useTranslations()
    const [copied, setCopied] = useState(false)
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const onCopy = async () => {
        try {
            let copyValue = textValue
            if (replaceLocale) {
                if (textValue.includes(baseUrl)) {
                    // Thêm $locale ngay sau baseUrl
                    copyValue = copyValue.replace(
                        baseUrl,
                        `${baseUrl}/${locale}`
                    )
                }
            }
            handleCopy(copyValue, onCopySuccess)
            setCopied(true)

            // clear trước khi set lại, tránh chồng timer khi spam click
            if (timerRef.current) clearTimeout(timerRef.current)
            timerRef.current = setTimeout(() => setCopied(false), 1000)
        } catch (err) {
            console.error('Copy failed:', err)
        }
    }

    // cleanup khi unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    }, [])

    return (
        <Button
            variant="light"
            onPress={onCopy}
            aria-label={copied ? 'Copied' : 'Copy'}
            size="sm"
            title={t('copiedToClipboard')}
            className="w-7! h-7! flex items-center justify-center"
            isIconOnly
            {...props}
        >
            <motion.span whileTap={{ scale: 0.92 }} className="size-3">
                <AnimatePresence mode="wait" initial={false}>
                    {copied ? (
                        <motion.span
                            key="check"
                            initial={{ opacity: 0, scale: 0.6, rotate: -10 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            exit={{ opacity: 0, scale: 0.6, rotate: 10 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="inline-flex items-center leading-none"
                        >
                            <CheckCheck
                                size={iconSize}
                                className={cn(iconClassName)}
                            />
                        </motion.span>
                    ) : (
                        <motion.span
                            key="copy"
                            initial={{ opacity: 0, scale: 0.6, rotate: 10 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            exit={{ opacity: 0, scale: 0.6, rotate: -10 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="inline-flex items-center leading-none"
                        >
                            <Copy
                                size={iconSize}
                                className={cn(iconClassName)}
                            />
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.span>
        </Button>
    )
}
