import { BanIcon, BotIcon, TvIcon } from 'lucide-react'

import { FileType } from '@/types/file.type'

import { FolderIcon } from '../../icons/file-icons/FolderIcon'
import { PDFIcon } from '../../icons/file-icons/PDFIcon'
import { WordIcon } from '../../icons/file-icons/WordIcon'

export const getFileIcon = (type: FileType, folderColor: string) => {
    const iconClass = 'h-5 w-5'
    switch (type) {
        case 'folder':
            return (
                <FolderIcon
                    className={iconClass}
                    style={{ color: folderColor }}
                />
            )
        case 'pdf':
            return <PDFIcon className={iconClass} />
        case 'image':
            return <BotIcon className={`${iconClass} text-green-500`} />
        case 'document':
            return <WordIcon className={iconClass} />
        case 'code':
            return <BanIcon className={`${iconClass} text-purple-500`} />
        default:
            return <TvIcon className={`${iconClass} text-gray-500`} />
    }
}
