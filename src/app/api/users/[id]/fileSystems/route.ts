/**

Get all file systems
GET /api/fileSystems?page=1&limit=10&search=document&type=folder

// Get user's file systems
GET /api/user/123/fileSystems?filter=created&type=file

// Create file system for user
POST /api/user/123/fileSystems

// Share file system
PATCH /api/user/123/fileSystems
{
    "fileSystemId": "fs123",
    "action": "share",
    "targetUserIds": ["user456", "user789"]
}

*/
import { NextRequest, NextResponse } from 'next/server'

import prisma from '@/lib/prisma'

// GET /api/user/[id]/fileSystems - Get file systems for a specific user
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const userId = params.id
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const search = searchParams.get('search')
        const type = searchParams.get('type')
        const filter = searchParams.get('filter') // 'created', 'visible', 'all'

        const skip = (page - 1) * limit

        // Validate user exists
        const user = await prisma.user.findUnique({
            where: { id: userId },
        })

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'User not found' },
                { status: 404 }
            )
        }

        // Build where clause based on filter
        let where: any = {}

        if (filter === 'created') {
            where.createdById = userId
        } else if (filter === 'visible') {
            where.visibleToUsers = {
                some: { id: userId },
            }
        } else {
            // Default: both created and visible files
            where.OR = [
                { createdById: userId },
                { visibleToUsers: { some: { id: userId } } },
            ]
        }

        // Add search filter
        if (search) {
            const searchCondition = {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { slug: { contains: search, mode: 'insensitive' } },
                ],
            }

            where = where.OR
                ? { AND: [where, searchCondition] }
                : { ...where, ...searchCondition }
        }

        // Add type filter
        if (type) {
            where.type = type
        }

        const [fileSystems, total] = await Promise.all([
            prisma.fileSystem.findMany({
                where,
                include: {
                    createdBy: {
                        select: {
                            id: true,
                            username: true,
                            name: true,
                            avatar: true,
                        },
                    },
                    visibleToUsers: {
                        select: {
                            id: true,
                            username: true,
                            name: true,
                            avatar: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.fileSystem.count({ where }),
        ])

        return NextResponse.json({
            success: true,
            data: fileSystems,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        })
    } catch (error) {
        console.error('Error fetching user file systems:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch user file systems' },
            { status: 500 }
        )
    }
}

// POST /api/user/[id]/fileSystems - Create a new file system for a specific user
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const userId = params.id
        const body = await request.json()
        const { name, slug, type, size, items, path, visibleToUserIds } = body

        // Validate required fields
        if (!name || !slug || !type || !size) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Validate user exists
        const user = await prisma.user.findUnique({
            where: { id: userId },
        })

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'User not found' },
                { status: 404 }
            )
        }

        // Check if slug already exists
        const existingFileSystem = await prisma.fileSystem.findFirst({
            where: { slug },
        })

        if (existingFileSystem) {
            return NextResponse.json(
                { success: false, error: 'Slug already exists' },
                { status: 409 }
            )
        }

        // Create file system
        const fileSystem = await prisma.fileSystem.create({
            data: {
                name,
                slug,
                type,
                size,
                items,
                path: path || [],
                createdById: userId,
                visibleToUsers: visibleToUserIds
                    ? {
                          connect: visibleToUserIds.map((id: string) => ({
                              id,
                          })),
                      }
                    : undefined,
            },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                        avatar: true,
                    },
                },
                visibleToUsers: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                        avatar: true,
                    },
                },
            },
        })

        return NextResponse.json(
            {
                success: true,
                data: fileSystem,
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Error creating file system for user:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to create file system' },
            { status: 500 }
        )
    }
}

// PUT /api/user/[id]/fileSystems - Update file systems for a specific user
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const userId = params.id
        const body = await request.json()
        const { fileSystemIds, updates } = body

        if (
            !fileSystemIds ||
            !Array.isArray(fileSystemIds) ||
            fileSystemIds.length === 0
        ) {
            return NextResponse.json(
                { success: false, error: 'Invalid or missing file system IDs' },
                { status: 400 }
            )
        }

        // Validate user exists
        const user = await prisma.user.findUnique({
            where: { id: userId },
        })

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'User not found' },
                { status: 404 }
            )
        }

        // Only update file systems created by this user
        const updatedFileSystems = await prisma.fileSystem.updateMany({
            where: {
                id: { in: fileSystemIds },
                createdById: userId,
            },
            data: updates,
        })

        return NextResponse.json({
            success: true,
            data: { count: updatedFileSystems.count },
        })
    } catch (error) {
        console.error('Error updating user file systems:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to update file systems' },
            { status: 500 }
        )
    }
}

// DELETE /api/user/[id]/fileSystems - Delete file systems for a specific user
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const userId = params.id
        const { searchParams } = new URL(request.url)
        const fileSystemIds = searchParams.get('fileSystemIds')?.split(',')

        if (!fileSystemIds || fileSystemIds.length === 0) {
            return NextResponse.json(
                { success: false, error: 'No file system IDs provided' },
                { status: 400 }
            )
        }

        // Validate user exists
        const user = await prisma.user.findUnique({
            where: { id: userId },
        })

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'User not found' },
                { status: 404 }
            )
        }

        // Only delete file systems created by this user
        const deletedFileSystems = await prisma.fileSystem.deleteMany({
            where: {
                id: { in: fileSystemIds },
                createdById: userId,
            },
        })

        return NextResponse.json({
            success: true,
            data: { count: deletedFileSystems.count },
        })
    } catch (error) {
        console.error('Error deleting user file systems:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to delete file systems' },
            { status: 500 }
        )
    }
}

// PATCH /api/user/[id]/fileSystems - Share/unshare file systems with users
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const userId = params.id
        const body = await request.json()
        const { fileSystemId, action, targetUserIds } = body

        // Validate required fields
        if (!fileSystemId || !action || !targetUserIds) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Validate user exists
        const user = await prisma.user.findUnique({
            where: { id: userId },
        })

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'User not found' },
                { status: 404 }
            )
        }

        // Check if user owns the file system
        const fileSystem = await prisma.fileSystem.findFirst({
            where: {
                id: fileSystemId,
                createdById: userId,
            },
        })

        if (!fileSystem) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'File system not found or access denied',
                },
                { status: 404 }
            )
        }

        let updatedFileSystem

        if (action === 'share') {
            // Share with users
            updatedFileSystem = await prisma.fileSystem.update({
                where: { id: fileSystemId },
                data: {
                    visibleToUsers: {
                        connect: targetUserIds.map((id: string) => ({ id })),
                    },
                },
                include: {
                    createdBy: {
                        select: {
                            id: true,
                            username: true,
                            name: true,
                            avatar: true,
                        },
                    },
                    visibleToUsers: {
                        select: {
                            id: true,
                            username: true,
                            name: true,
                            avatar: true,
                        },
                    },
                },
            })
        } else if (action === 'unshare') {
            // Unshare from users
            updatedFileSystem = await prisma.fileSystem.update({
                where: { id: fileSystemId },
                data: {
                    visibleToUsers: {
                        disconnect: targetUserIds.map((id: string) => ({ id })),
                    },
                },
                include: {
                    createdBy: {
                        select: {
                            id: true,
                            username: true,
                            name: true,
                            avatar: true,
                        },
                    },
                    visibleToUsers: {
                        select: {
                            id: true,
                            username: true,
                            name: true,
                            avatar: true,
                        },
                    },
                },
            })
        } else {
            return NextResponse.json(
                { success: false, error: 'Invalid action' },
                { status: 400 }
            )
        }

        return NextResponse.json({
            success: true,
            data: updatedFileSystem,
        })
    } catch (error) {
        console.error('Error sharing/unsharing file system:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to update file system sharing' },
            { status: 500 }
        )
    }
}
