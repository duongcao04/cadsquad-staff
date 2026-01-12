import { azureConfig } from '@/config'
import { ConfidentialClientApplication } from '@azure/msal-node'
import { Client } from '@microsoft/microsoft-graph-client'
import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common'
import type { ConfigType } from '@nestjs/config'
import 'isomorphic-fetch'

@Injectable()
export class SharePointService {
	private readonly logger = new Logger(SharePointService.name)
	private msalClient: ConfidentialClientApplication

	// Cấu hình ID của Drive (Mặc định lấy Drive chính của Root Site)
	// Nếu bạn muốn trỏ vào Site khác, bạn cần thay đổi logic lấy Drive ID này.
	private driveEndpoint = '/sites/root/drive'

	constructor(
		@Inject(azureConfig.KEY)
		private readonly config: ConfigType<typeof azureConfig>
	) {
		this.msalClient = new ConfidentialClientApplication({
			auth: {
				clientId: this.config.azure.clientId,
				clientSecret: this.config.azure.clientSecret,
				authority: `https://login.microsoftonline.com/${this.config.azure.tenantId}`,
			},
		})
	}

	private async getAccessToken(): Promise<string> {
		const result = await this.msalClient.acquireTokenByClientCredential({
			scopes: ['https://graph.microsoft.com/.default'],
		})
		return result?.accessToken ?? ''
	}

	private async getGraphClient() {
		const accessToken = await this.getAccessToken()
		return Client.init({
			authProvider: (done) => done(null, accessToken),
		})
	}

	// ==========================================
	// 1. LIST FILES (DUYỆT FILE)
	// ==========================================

	/**
	 * Lấy danh sách file/folder.
	 * @param folderId (Optional) Nếu không truyền thì lấy Root.
	 */
	async getItems(folderId?: string) {
		const client = await this.getGraphClient()

		// Nếu có folderId -> lấy con của folder đó. Nếu không -> lấy root.
		const endpoint = folderId
			? `${this.driveEndpoint}/items/${folderId}/children`
			: `${this.driveEndpoint}/root/children`

		try {
			const response = await client.api(endpoint).get()
			// Map lại dữ liệu cho gọn gàng dễ dùng ở Frontend
			return response.value.map((item: any) => ({
				id: item.id,
				name: item.name,
				isFolder: !!item.folder, // Kiểm tra xem có phải folder không
				size: item.size,
				webUrl: item.webUrl,
				createdDateTime: item.createdDateTime,
				lastModifiedDateTime: item.lastModifiedDateTime,
				createdBy: item.createdBy?.user?.displayName || 'System',
			}))
		} catch (error) {
			this.logger.error(`List items failed: ${error.message}`)
			throw new BadRequestException('Cannot list items from SharePoint')
		}
	}

	// ==========================================
	// 2. UPLOAD FILE
	// ==========================================

	/**
	 * Upload file vào một folder cụ thể
	 */
	async uploadFile(parentId: string, file: Express.Multer.File) {
		const client = await this.getGraphClient()

		// Endpoint: /drive/items/{parent-id}:/{filename}:/content
		// Nếu parentId là 'root' thì dùng /root
		const parentPath = parentId === 'root' ? '/root' : `/items/${parentId}`

		const endpoint = `${this.driveEndpoint}${parentPath}:/${file.originalname}:/content`

		try {
			// Upload trực tiếp buffer
			// Lưu ý: Upload session (cho file > 4MB) cần logic phức tạp hơn.
			// Đây là logic simple upload (cho file < 4MB).
			const response = await client.api(endpoint).put(file.buffer)
			return response
		} catch (error) {
			this.logger.error(`Upload failed: ${error.message}`)
			throw new BadRequestException('Upload to SharePoint failed')
		}
	}

	// ==========================================
	// 3. CREATE FOLDER
	// ==========================================

	async createFolder(parentId: string, folderName: string) {
		const client = await this.getGraphClient()
		const endpoint =
			parentId === 'root'
				? `${this.driveEndpoint}/root/children`
				: `${this.driveEndpoint}/items/${parentId}/children`

		const driveItem = {
			name: folderName,
			folder: {}, // Đánh dấu là folder
			'@microsoft.graph.conflictBehavior': 'rename', // Nếu trùng tên thì tự đổi tên
		}

		return await client.api(endpoint).post(driveItem)
	}

	// ==========================================
	// 4. DOWNLOAD / PREVIEW
	// ==========================================

	/**
	 * Lấy link download trực tiếp (Temporary Download URL)
	 */
	async getDownloadUrl(itemId: string) {
		const client = await this.getGraphClient()
		const item = await client
			.api(`${this.driveEndpoint}/items/${itemId}`)
			.get()

		if (!item['@microsoft.graph.downloadUrl']) {
			throw new BadRequestException(
				'This item is not downloadable (maybe it is a folder)'
			)
		}
		return { url: item['@microsoft.graph.downloadUrl'] }
	}

	// ==========================================
	// 5. DELETE
	// ==========================================

	async deleteItem(itemId: string) {
		const client = await this.getGraphClient()
		await client.api(`${this.driveEndpoint}/items/${itemId}`).delete()
		return { success: true }
	}
}
