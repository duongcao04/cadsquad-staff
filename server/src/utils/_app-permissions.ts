export const APP_PERMISSIONS = {
    JOB: {
        READ: 'job.read',
        READ_ALL: 'job.readAll',
        READ_SENSITIVE: 'job.readSensitive',
        CREATE: 'job.create',
        DELIVER: 'job.deliver',
        UPDATE: 'job.update',
        PAID: 'job.paid',
        ASSIGN_MEMBER: 'job.assignMember',
        REVIEW: 'job.review',
        DELETE: 'job.delete',
        PUBLISH: 'job.publish',
    },
    USER: {
        READ: 'user.read',
        CREATE: 'user.create',
        UPDATE: 'user.update',
        DELETE: 'user.delete',
    },
    CLIENT: {
        READ: 'client.read',
        WRITE: 'client.write',
    },
    PAYMENT: {
        READ: 'payment.read',
        WRITE: 'payment.write',
    },
    COMMUNITY: {
        READ: 'community.read',
        CREATE: 'community.create',
    },
    POST: {
        CREATE: 'post.create',
    },
    FILE: {
        READ: 'file.read',
        WRITE: 'file.write',
    },
    SYSTEM: {
        MANAGE: 'system.manage',
    },
} as const

// Type helper để lấy union string của tất cả permissions nếu cần
export type AppPermission = {
    [K in keyof typeof APP_PERMISSIONS]: (typeof APP_PERMISSIONS)[K][keyof (typeof APP_PERMISSIONS)[K]]
}[keyof typeof APP_PERMISSIONS]
