import React from 'react'

export const EmptyAttachments = ({ isEditMode }: { isEditMode: boolean }) => {
    if (!isEditMode) {
        return <p>No attachments available.</p>
    }
    return <p>Add attachment</p>
}

type Props = {}
export default function AttachmentCard({}: Props) {
    return <div>AttachmentCard</div>
}
