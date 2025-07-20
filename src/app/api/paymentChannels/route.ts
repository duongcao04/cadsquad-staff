import { NextResponse } from 'next/server'

import { Message } from '../abstract/message.class'
import { PaymentChannelService } from './paymentChannel.service'

const paymentChannelService = new PaymentChannelService()
const message = new Message('payment channel')

export async function GET() {
    try {
        const data = await paymentChannelService.getAll()

        return NextResponse.json(
            {
                message: message.getAll(),
                data,
            },
            { status: 200 }
        )
    } catch (error) {
        console.error('Error fetching job statuses:', error)
        return NextResponse.json(
            {
                error: message.error(),
            },
            { status: 500 }
        )
    }
}
