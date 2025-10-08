import { JobColumn } from "@/shared/types/job.type"

const allJobColumns: JobColumn[] = ['no', 'type', 'thumbnail', 'displayName', 'description', 'attachmentUrls', 'clientName', 'incomeCost', 'staffCost', 'assignee', 'paymentChannel', 'status', 'isPaid', 'dueAt', 'completedAt', 'createdAt', 'updatedAt', 'action']

export const CONFIG_CONSTANTS = {
	keys: {
		// Job table
		jobShowColumns: "job-show-columns",
		hideFinishItems: 'project-center-activeTab-hide-finish-items'
	},
	values: {
		allJobColumns: {
			user: allJobColumns.filter(item => item !== 'incomeCost'),
			admin: allJobColumns
		}
	}
}