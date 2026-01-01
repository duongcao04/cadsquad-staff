/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Vite sẽ thay thế các chuỗi này (String Replacement) dựa trên config 'define'
firebase.initializeApp({
	apiKey: "VITE_FIREBASE_API_KEY",
	authDomain: "VITE_FIREBASE_AUTH_DOMAIN",
	projectId: "VITE_FIREBASE_PROJECT_ID",
	messagingSenderId: "VITE_FIREBASE_MESSAGING_SENDER_ID",
	appId: "VITE_FIREBASE_APP_ID",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
	console.log('[SW] Background message received', payload);
	const notificationTitle = payload.notification.title || "CAD SQUAD";
	const notificationOptions = {
		body: payload.notification.body,
		icon: '/favicon.ico',
	};
	self.registration.showNotification(notificationTitle, notificationOptions);
});