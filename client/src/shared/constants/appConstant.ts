export const FILE = {
    SPLASH: encodeURIComponent('/'),
}

export const MS = {
    second: 1000,
    minute: 60 * 1000,
    hour: 60 * 60 * 1000,
    day: 24 * 60 * 60 * 1000,
}

export const projectStatuses: {
    status: ProjectStatus
    color: string
    icon: string
}[] = [
    {
        status: 'onProgress',
        color: '#ffff00',
        icon: '',
    },
    {
        status: 'revision',
        color: '#f2aa84',
        icon: '',
    },
    {
        status: 'delivered',
        color: '#a02b93',
        icon: '',
    },
]
export type ProjectStatus = 'onProgress' | 'revision' | 'delivered'
