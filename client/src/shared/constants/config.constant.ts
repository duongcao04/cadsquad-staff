const allJobColumns = ['no', 'type', 'thumbnail', 'displayName', 'description', 'attachmentUrls', 'clientName', 'incomeCost', 'staffCost', 'assignee', 'paymentChannel', 'status', 'isPaid', 'dueAt', 'completedAt', 'createdAt', 'updatedAt', 'action']

export const CONFIG_CONSTANTS = {
	keys: {
		jobShowColumns: "job-show-columns"
	},
	values: {
		allJobColumns: {
			user: allJobColumns.filter(item => item !== 'incomeCost'),
			admin: allJobColumns
		}
	}
}