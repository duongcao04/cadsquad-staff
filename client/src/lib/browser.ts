export async function getPushSubscription() {
	// Check if the browser supports Service Workers and Push API
	if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
		console.error('Push messaging is not supported');
		return null;
	}

	try {
		// 1. Register the Service Worker
		const serviceWorkerRegistration = await navigator.serviceWorker.register('/worker.js');
		console.log('Service Worker registered:', serviceWorkerRegistration);

		// 2. Get the subscription object from the Push Manager
		const subscription = await serviceWorkerRegistration.pushManager.subscribe({
			userVisibleOnly: true, // Required, indicates the push will be visible to the user
			applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY, // Your public VAPID key
		});

		console.log('New Push Subscription created:', subscription);

		// This is the object you need to send to your server
		return subscription;

	} catch (error) {
		console.error('Failed to subscribe the user:', error);
		return null;
	}
}