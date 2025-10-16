import { ApiResponse, axiosClient } from '@/lib/axios';
import { BrowserSubscribes } from '@/shared/interfaces';
import { NextRequest, NextResponse } from 'next/server';
import webPush, { PushSubscription, WebPushError } from 'web-push';

export async function POST(request: NextRequest) {
	webPush.setVapidDetails(
		`mailto:${process.env.VAPID_MAILTO_EMAIL}`,
		String(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY),
		String(process.env.VAPID_PRIVATE_KEY)
	);

	const { title, body } = await request.json();
	const notificationPayload = JSON.stringify({ title, body });

	// Fetch all subscriptions from your backend
	const browserSubscribes = await axiosClient.get<ApiResponse<BrowserSubscribes[]>>('/browser-subscribes').then(res => {
		const data = res.data.result;
		if (!data) return [];
		return data.map((item) => {
			return {
				endpoint: item.endpoint,
				expirationTime: item.expirationTime,
				keys: {
					p256dh: item.p256dh,
					auth: item.auth
				}
			} as unknown as PushSubscription;
		});
	});

	// Use Promise.allSettled to get the result of every promise
	const results = await Promise.allSettled(
		browserSubscribes.map(sub => webPush.sendNotification(sub, notificationPayload))
	);

	const subscriptionsToDelete: string[] = [];

	results.forEach(result => {
		// Check if the promise was rejected
		if (result.status === 'rejected') {
			const error = result.reason as WebPushError;
			console.error(`Notification failed for endpoint: ${error.endpoint}`);

			// ✨ If the subscription is gone (410), mark it for deletion
			if (error.statusCode === 410) {
				console.log(`Endpoint marked for deletion: ${error.endpoint}`);
				subscriptionsToDelete.push(error.endpoint);
			}
		}
	});

	// 🗑️ If there are any expired subscriptions, send requests to delete them
	if (subscriptionsToDelete.length > 0) {
		console.log(`Deleting ${subscriptionsToDelete.length} expired subscriptions.`);
		// Fire off delete requests in parallel
		await Promise.all(
			subscriptionsToDelete.map(endpoint =>
				axiosClient.delete('/browser-subscribes/by-endpoint', { data: { endpoint } })
			)
		);
	}

	return NextResponse.json({ message: 'Notification process completed.' });
}