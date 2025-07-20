import { User } from '@/generated/prisma'
import { PrismaClientType, ensureConnection } from '@/lib/prisma'

export class UserService {
    private prisma!: PrismaClientType
    constructor() {
        this.init()
    }

    private async init() {
        this.prisma = await ensureConnection()
    }

    async getAll() {
        try {
            const records = await this.prisma.user.findMany({
                orderBy: {
                    name: 'asc',
                },
                include: {
                    assignedProjects: {},
                    createdProjects: {},
                    statusChanges: {},
                    notifications: {},
                    _count: {
                        select: {
                            assignedProjects: true,
                            createdProjects: true,
                            notifications: true,
                        },
                    },
                },
            })
            return { records }
        } catch (error) {
            console.error('Error fetching projects:', error)
            return { error: 'Internal server error', status: 500 }
        }
    }

    async create(userData: User) {
        try {
            return await this.prisma.user.create({
                data: {
                    id: userData.id,
                    email: userData.email,
                    username: userData.username,
                    name: userData.name,
                    avatar: userData.avatar,
                    jobTitle: userData.jobTitle,
                    department: userData.department,
                    role: userData.role || 'USER',
                },
                include: {
                    assignedProjects: {
                        select: {
                            id: true,
                            jobNo: true,
                            jobName: true,
                            staffCost: true,
                        },
                    },
                },
            })
        } catch (error) {
            console.error('Error creating project:', error)
            return { error: 'Internal server error', status: 500 }
        }
    }

    async isExist({
        email,
        username,
        userId,
    }: {
        userId?: string
        username?: string
        email?: string
    }) {
        try {
            if (email) {
                return await this.prisma.user.findUnique({
                    where: { email: email },
                })
            } else if (username) {
                return await this.prisma.user.findUnique({
                    where: { username: username },
                })
            } else {
                return await this.prisma.user.findUnique({
                    where: { id: userId },
                })
            }
        } catch (error) {
            console.error('Error creating project:', error)
            return { error: 'Internal server error', status: 500 }
        }
    }
}
