'use client'

import { useEffect } from 'react'

export default function PushSubscriber() {
    useEffect(() => {
        async function registerServiceWorker() {
            if ('serviceWorker' in navigator && 'PushManager' in window) {
                try {
                    const registration = await navigator.serviceWorker.register(
                        '/worker.js'
                    )
                    console.log(
                        'Service Worker registered with scope:',
                        registration.scope
                    )

                    let subscription =
                        await registration.pushManager.getSubscription()
                    if (subscription === null) {
                        // Ask for permission and subscribe
                        subscription = await registration.pushManager.subscribe(
                            {
                                userVisibleOnly: true,
                                applicationServerKey:
                                    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
                            }
                        )
                        console.log('User is subscribed:', subscription)

                        // Send subscription to the server
                        await fetch('/api/subscribe', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(subscription),
                        })
                    } else {
                        console.log('User is already subscribed.')
                    }
                } catch (error) {
                    console.error('Service Worker registration failed:', error)
                }
            }
        }

        registerServiceWorker()
    }, [])

    return null // This component does not render anything
}
