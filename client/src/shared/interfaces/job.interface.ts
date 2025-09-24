import { JobPriority } from "@/shared/enums/jobPriority.enum"
import { JobActivityLog } from "./jobActivityLog.interface"
import { JobStatus } from "./jobStatus.interface"
import { JobType } from "./jobType.interface"
import { PaymentChannel } from "./paymentChannel.interface"
import { User } from "./user.interface"
import { FileSystem } from "./fileSystem.interface"
/**
 * Represents a job, project, or task within the system.
 * It contains all details related to the job, including its status, assignments, costs, and associated files.
 */
export interface Job {
	/**
	 * The unique identifier for the job.
	 * @type {string}
	 */
	id: string

	/**
	 * A unique, human-readable number or code for the job.
	 * @type {string}
	 */
	no: string

	/**
	 * The type of the job (e.g., "Drafting", "Modeling").
	 * @type {JobType}
	 */
	type: JobType

	/**
	 * The ID of the job's type.
	 * @type {string}
	 */
	typeId: string

	/**
	 * The main display name or title of the job.
	 * @type {string}
	 */
	displayName: string

	/**
	 * An optional detailed description of the job.
	 * @type {string | null | undefined}
	 */
	description?: string | null

	/**
	 * A list of URLs for attachments related to the job.
	 * @type {string[]}
	 */
	attachmentUrls: string[]

	/**
	 * The name of the client for whom the job is being done.
	 * @type {string}
	 */
	clientName: string

	/**
	 * The income generated from the job.
	 * @type {number}
	 */
	incomeCost: number

	/**
	 * The cost associated with the staff working on the job.
	 * @type {number}
	 */
	staffCost: number

	/**
	 * A list of users assigned to work on the job.
	 * @type {User[]}
	 */
	assignee: User[]

	/**
	 * The user who created the job.
	 * @type {User}
	 */
	createdBy: User

	/**
	 * The ID of the user who created the job.
	 * @type {string}
	 */
	createdById: string

	/**
	 * The payment channel used for the job's transactions.
	 * @type {PaymentChannel}
	 */
	paymentChannel: PaymentChannel

	/**
	 * The ID of the payment channel.
	 * @type {string}
	 */
	paymentChannelId: string

	/**
	 * The current status of the job (e.g., "In Progress", "Completed").
	 * @type {JobStatus}
	 */
	status: JobStatus

	/**
	 * The ID of the job's current status.
	 * @type {string}
	 */
	statusId: string

	/**
	 * A log of all activities and changes related to the job.
	 * @type {JobActivityLog[]}
	 */
	activityLog: JobActivityLog[]

	/**
	 * The date and time when the job was started.
	 * @type {Date}
	 */
	startedAt: Date

	/**
	 * The priority level of the job (e.g., "LOW", "HIGH").
	 * @type {JobPriority}
	 */
	priority: JobPriority

	/**
	 * A list of files and folders associated with the job.
	 * @type {FileSystem[]}
	 */
	files: FileSystem[]

	/**
	 * A flag indicating whether the job is pinned for easy access.
	 * @type {boolean}
	 */
	isPinned: boolean

	/**
	 * A flag indicating whether the job is published or visible.
	 * @type {boolean}
	 */
	isPublished: boolean

	/**
	 * A flag indicating whether the job has been paid for.
	 * @type {boolean}
	 */
	isPaid: boolean

	/**
	 * The deadline for the job.
	 * @type {Date}
	 */
	dueAt: Date

	/**
	 * The date and time when the job was completed.
	 * Can be null if the job is not yet completed.
	 * @type {Date | null | undefined}
	 */
	completedAt?: Date | null

	/**
	 * The timestamp when the job was created.
	 * @type {Date}
	 */
	createdAt: Date

	/**
	 * The timestamp when the job was last updated.
	 * @type {Date}
	 */
	updatedAt: Date

	/**
	 * The timestamp when the job was soft-deleted.
	 * Can be null if the job is active.
	 * @type {Date | null | undefined}
	 */
	deletedAt?: Date | null
}