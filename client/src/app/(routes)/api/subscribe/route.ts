import { axiosClient } from '@/lib/axios';
import { CreateBrowserSubscribeInput } from '@/lib/validationSchemas';
import { NextRequest, NextResponse } from 'next/server';
import { PushSubscription } from 'web-push';

// In a real app, you would save this to a database (e.g., PostgreSQL, MongoDB).
// For this example, we'll store it in-memory.
// NOTE: This will reset every time your server restarts.
export const subscriptions: PushSubscription[] = [];

export async function POST(request: NextRequest) {
	try {
		const newSubscription = await request.json();

		if (!newSubscription?.endpoint) {
			return NextResponse.json({ error: 'Invalid subscription object' }, { status: 400 });
		}

		console.log('Received new subscription to save:', newSubscription);

		const newSubscriptionInput: CreateBrowserSubscribeInput = {
			endpoint: newSubscription.endpoint,
			expirationTime: newSubscription.expirationTime,
			p256dh: newSubscription.keys.p256dh,
			auth: newSubscription.keys.auth
		}

		await axiosClient.post('/browser-subscribes', newSubscriptionInput)
		return NextResponse.json({ message: 'Subscription saved.' });
	} catch (error) {
		console.error('Error saving subscription:', error);
		return NextResponse.json({ error: 'Failed to save subscription' }, { status: 500 });
	}
}
