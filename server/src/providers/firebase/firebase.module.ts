import { Global, Module } from '@nestjs/common'
import * as admin from 'firebase-admin'
import * as path from 'path'
import { FirebaseService } from './firebase.service'

@Global()
@Module({
    providers: [
        {
            provide: 'FIREBASE_ADMIN',
            useFactory: () => {
                // Đường dẫn đến file JSON của bạn
                const serviceAccountPath = path.join(
                    process.cwd(),
                    'dist/src/config/serviceAccountKey.json'
                )

                // Kiểm tra tránh khởi tạo trùng lặp khi NestJS hot-reload
                if (admin.apps.length === 0) {
                    return admin.initializeApp({
                        credential: admin.credential.cert(serviceAccountPath),
                        databaseURL: process.env.FIREBASE_DATABASE_URL,
                    })
                }
                return admin.app()
            },
        },
        FirebaseService,
    ],
    exports: ['FIREBASE_ADMIN', FirebaseService],
})
export class FirebaseModule {}
