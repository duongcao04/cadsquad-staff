import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { BearerStrategy } from 'passport-azure-ad';

@Injectable()
export class AzureStrategy extends PassportStrategy(BearerStrategy, 'azure-ad') {
	constructor() {
		super({
			identityMetadata: `https://login.microsoftonline.com/${String(process.env.AZURE_TENANT_ID)}/v2.0/.well-known/openid-configuration`,
			clientID: String(process.env.AZURE_CLIENT_ID),
			audience: String(process.env.AZURE_CLIENT_ID),
			issuer: `https://login.microsoftonline.com/${String(process.env.AZURE_TENANT_ID)}/v2.0`,
			validateIssuer: true,
			passReqToCallback: false,
			loggingLevel: 'info',
		});
	}

	async validate(payload: any) {
		return {
			id: payload.sub,
			email: payload.email || payload.upn,
			name: payload.name,
		};
	}
}