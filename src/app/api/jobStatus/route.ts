import { NextResponse } from 'next/server'

import { Message } from '../abstract/message.class'
import { JobStatusService } from './jobStatus.service'

const jobStatusService = new JobStatusService()
const message = new Message('job status')

export async function GET() {
    try {
        const data = await jobStatusService.getAll()

        return NextResponse.json({
            message: message.getAll(),
            data,
        })
    } catch (error) {
        return NextResponse.json(
            {
                error,
                messgae: message.error(),
            },
            { status: 500 }
        )
    }
}
