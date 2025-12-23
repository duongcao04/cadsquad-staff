import type { IAccountResponse } from '../interfaces'

export type TAccount = Omit<IAccountResponse, 'providerId' | 'userId'>
