'use server'

import { NextRequest, NextResponse } from 'next/server'

import { NewProject } from '@/validationSchemas/project.schema'

import { Message } from '../abstract/message.class'
import { ProjectService, WorkflowStatus } from './projects.service'

const projectService = new ProjectService()
const message = new Message('project')

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const search = searchParams.get('search')
        const jobNo = searchParams.get('jobNo')
        const workflowStatusName = searchParams.get('tab')

        if (jobNo) {
            const data = await projectService.getByJobNo(jobNo)
            if (!data) {
                return NextResponse.json(
                    {
                        message: message.notFound(),
                    },
                    { status: 404 }
                )
            }

            return NextResponse.json({
                message: message.getBy('jobNo'),
                data,
            })
        } else if (workflowStatusName) {
            const data = await projectService.getByWorkflowStatus(
                workflowStatusName as WorkflowStatus
            )
            if (!data) {
                return NextResponse.json(
                    {
                        message: message.notFound(),
                    },
                    { status: 404 }
                )
            }

            return NextResponse.json(
                {
                    message: message.getBy('Tab'),
                    data,
                },
                { status: 200 }
            )
        } else {
            const data = await projectService.getAll({ search, page, limit })
            if (!data) {
                return NextResponse.json(
                    {
                        message: message.notFound(),
                    },
                    { status: 404 }
                )
            }

            return NextResponse.json(
                {
                    message: message.getAll(),
                    data,
                },
                { status: 200 }
            )
        }
    } catch (error) {
        return NextResponse.json(
            {
                message: message.error(),
                desciption: error,
            },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const body: NewProject = await request.json()
        const result = await projectService.create(body)

        if (!body.jobNo || !body.jobName) {
            return NextResponse.json(
                {
                    message: 'Job no and Job name is required.',
                },
                { status: 400 }
            )
        }

        const existingProject = await projectService.isExist({
            jobNo: body.jobNo,
        })

        if (existingProject) {
            return NextResponse.json(
                {
                    message: 'Job no is already exist.',
                },
                { status: 400 }
            )
        }

        return NextResponse.json(
            {
                message: message.created(),
                result,
            },
            { status: 201 }
        )
    } catch (error) {
        return NextResponse.json(
            {
                message: message.error(),
                desciption: error,
            },
            { status: 500 }
        )
    }
}
