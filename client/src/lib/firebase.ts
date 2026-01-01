import { initializeApp } from 'firebase/app'
import { getMessaging } from 'firebase/messaging'
import { firebaseConfig } from './config'

const app = initializeApp(firebaseConfig)
export const messaging =
    typeof window !== 'undefined' ? getMessaging(app) : null
