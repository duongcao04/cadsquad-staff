import { getApps, initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

import firebaseConfig from '@/lib/config/_firebase.config'

export const app = !getApps().length
    ? initializeApp(firebaseConfig)
    : getApps()[0]
export const database = getDatabase(app)
