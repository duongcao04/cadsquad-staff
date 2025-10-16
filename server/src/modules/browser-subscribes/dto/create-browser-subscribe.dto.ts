import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateBrowserSubscribeDto {
	@IsString()
	@IsNotEmpty()
	readonly endpoint: string;

	@IsString()
	@IsOptional()
	readonly expirationTime?: string;

	@IsString()
	@IsNotEmpty()
	readonly p256dh: string;

	@IsString()
	@IsNotEmpty()
	readonly auth: string;
}