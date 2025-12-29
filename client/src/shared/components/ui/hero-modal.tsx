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

import { smoothMotion } from '@/lib/motion'

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
