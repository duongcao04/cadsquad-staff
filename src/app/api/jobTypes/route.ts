import { NextResponse } from 'next/server'

import { Message } from '../abstract/message.class'
import { JobTypeService } from './jobType.service'

const jobTypeService = new JobTypeService()
const message = new Message('job type')

// GET - Fetch all job statuses
export async function GET() {
    try {
        const data = await jobTypeService.getAll()

        return NextResponse.json(
            {
                message: message.getAll(),
                data: data,
            },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            {
                message: message.notFound(),
                error,
            },
            { status: 500 }
        )
    }
}
