import { envConfig } from "@/lib/config";
import { JobColumn, JobColumnKey } from "@/shared/types";


export const LS_OIDC_REDIRECT_URI_KEY = "oidc:redirect_uri" as const;

export const URLS = {
	home: String(envConfig.NEXT_PUBLIC_URL),
	projectCenterDetail: (jobNo: string) => [String(envConfig.NEXT_PUBLIC_URL), 'project-center', jobNo].join('/'),
}

export const apiBaseUrl = envConfig.NEXT_PUBLIC_API_ENDPOINT
	? `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/api`
	: "https://testapi.appnavotar.com/api";

export const STORAGE_KEYS = {
	theme: "theme",
	dateFormat: "app-runtime:date-format",
	timeFormat: "app-runtime:time-format",
	dismissedMessages: "app-runtime:dismissed-messages",
	tableRowCount: "app-runtime:table-row-count",
	currency: "app-runtime:currency",
	currencyDigits: "app-runtime:currency-digits",
} as const;

export const IMAGES = {
	loadingPlaceholder: 'https://placehold.co/400x400?text=Loading'
} as const

const allJobColumns: JobColumn[] = ['no', 'type', 'thumbnail', 'displayName', 'description', 'attachmentUrls', 'clientName', 'incomeCost', 'staffCost', 'assignee', 'paymentChannel', 'status', 'isPaid', 'dueAt', 'completedAt', 'createdAt', 'updatedAt', 'action']

export const USER_CONFIG_KEYS = {
	jobShowColumns: "job-show-columns",
	hideFinishItems: 'project-center-activeTab-hide-finish-items'
}

export const USER_CONFIG_VALUES = {
	allJobColumns: {
		user: allJobColumns.filter(item => item !== 'incomeCost'),
		admin: allJobColumns
	}
}

export const STORAGE_DEFAULTS = {
	tableRowCount: "10",
	currencyDigits: "2",
	theme: "system" as const,
};

export const UI_APPLICATION_NAME =
	envConfig.NEXT_PUBLIC_APP_TITLE ?? "Cadsquad Staff";
export const DEPLOYMENT_ENV =
	process.env.NODE_ENV || "development";

export const IS_DEV = DEPLOYMENT_ENV !== "production";
export const APP_VERSION = envConfig.NEXT_PUBLIC_APP_VERSION ?? "0.0.0-release";

export const SETTINGS_LOCATION_KEYS = {
	application: "application",
	profile: "profile",
	runtimeConfiguration: "runtime-configuration",
	vehiclesAndCategories: "vehicles-and-categories",
	ratesAndCharges: "rates-and-charges",
} as const;

export const DATE_FORMATS = {
	hyphen: "DD-MM-YYYY",
	dashed: "DD/MM/YYYY"
}

export const TIMEZONE = 'Asia/Ho_Chi_Minh'

export const PROJECT_CENTER_TABS = {
	active: "active",
	priority: "priority",
	late: "late",
	delivered: 'delivered',
	completed: 'completed',
	cancelled: 'cancelled'
}

export const JOB_STATUS_CODES = {
	inProgress: 'in-progress',
	delivered: 'delivered',
	revision: 'revision',
	finish: 'finish',
	completed: 'completed',
}

export const ACTIVITY_LOG_TYPE = {
	createJob: "CreateJob",
	changeStatus: "ChangeStatus",
	assignMember: "AssignMember",
	unassignMember: "UnassignMember",
	changePaymentChannel: "ChangePaymentChannel",
	updateInformation: "UpdateInformation",
	deleteJob: "DeleteJob",
}

export const PAID_STATUS_COLOR: Record<string, { title: string, hexColor: string }> = {
	paid: {
		title: 'Paid',
		hexColor: '#2a9174',
	},
	unpaid: {
		title: 'Unpaid',
		hexColor: '#f83640',
	},
}


export const JOB_COLUMNS: { displayName: string, uid: JobColumnKey, sortable: boolean, description?: string }[] = [
	{
		"displayName": "Thumbnail",
		"uid": "thumbnailUrl",
		"sortable": false,
		"description": "Preview image representing the project."
	},
	{
		"displayName": "Client",
		"uid": "clientName",
		"sortable": true,
		"description": "Name of the client associated with the project."
	},
	{
		"displayName": "Job type",
		"uid": "type",
		"sortable": true,
		"description": "Category or type of the job."
	},
	{
		"displayName": "Job no",
		"uid": "no",
		"sortable": true,
		"description": "Unique job or project number identifier."
	},
	{
		"displayName": "Job name",
		"uid": "displayName",
		"sortable": true,
		"description": "Official name or title of the job or project."
	},
	{
		"displayName": "Income",
		"uid": "incomeCost",
		"sortable": true,
		"description": "Total income or revenue generated from the project."
	},
	{
		"displayName": "Staff Cost",
		"uid": "staffCost",
		"sortable": true,
		"description": "Total cost associated with staff working on the project."
	},
	{
		"displayName": "Status",
		"uid": "status",
		"sortable": true,
		"description": "Current status of the project (e.g., Active, Completed)."
	},
	{
		"displayName": "Due on",
		"uid": "dueAt",
		"sortable": true,
		"description": "Deadline or due date for the project."
	},
	{
		"displayName": "Attachments",
		"uid": "attachmentUrls",
		"sortable": false,
		"description": "List of attached files or documents related to the project."
	},
	{
		"displayName": "Assignee",
		"uid": "assignee",
		"sortable": false,
		"description": "Person or team assigned to handle the project."
	},
	{
		"displayName": "Payment status",
		"uid": "isPaid",
		"sortable": true,
		"description": "Indicates whether the project has been paid for."
	},
	{
		"displayName": "Payment channel",
		"uid": "paymentChannel",
		"sortable": false,
		"description": "Payment method or channel used (e.g., Bank, Cash)."
	},
	{
		"displayName": "Completed at",
		"uid": "completedAt",
		"sortable": true,
		"description": "Date and time when the project was completed."
	},
	{
		"displayName": "Created at",
		"uid": "createdAt",
		"sortable": true,
		"description": "Date and time when the project record was created."
	},
	{
		"displayName": "Modified at",
		"uid": "updatedAt",
		"sortable": true,
		"description": "Date and time of the most recent modification."
	},
	{
		"displayName": "Actions",
		"uid": "action",
		"sortable": false,
		"description": "Available actions such as view, edit, or delete."
	}
]