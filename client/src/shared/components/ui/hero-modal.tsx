'use client'

import {
    extendVariants,
    Modal,
    ModalBody,
    ModalBodyProps,
    ModalContent,
    ModalContentProps,
    ModalFooter,
    ModalHeader,
    ModalHeaderProps,
    ModalProps,
} from '@heroui/react'

export const smoothMotion = {
    variants: {
        enter: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.2,
                type: 'spring',
                bounce: 0,
                damping: 25,
                stiffness: 300,
            },
        },
        exit: {
            y: 20,
            opacity: 0,
            scale: 0.95,
            transition: {
                duration: 0.1,
                ease: 'easeIn',
            },
        },
    },
}
const StyledModal = extendVariants(Modal, {})

// Wrapper Component để inject Motion Props
export const HeroModal = (props: ModalProps) => {
    return (
        <StyledModal
            {...props}
            motionProps={props.motionProps || smoothMotion}
        />
    )
}

export const HeroModalContent = (props: ModalContentProps) => {
    return <ModalContent {...props} />
}

export const HeroModalHeader = (props: ModalHeaderProps) => {
    return <ModalHeader {...props} />
}

export const HeroModalBody = (props: ModalBodyProps) => {
    return <ModalBody {...props} />
}
export const HeroModalFooter = (props: ModalBodyProps) => {
    return <ModalFooter {...props} />
}
