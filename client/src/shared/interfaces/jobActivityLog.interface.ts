import { ActivityType } from "@/shared/enums/activityType.enum"
import { Job } from "./job.interface"
import { User } from "./user.interface"

/**
 * Represents a log entry for an activity performed on a job.
 * This is used to track the history of a job, such as status changes, assignments, and updates.
 */
export interface JobActivityLog {
	/**
	 * The unique identifier for the activity log entry.
	 * @type {string}
	 */
	id: string

	/**
	 * A reference to the Job object that this activity log belongs to.
	 * @type {Job}
	 */
	job: Job

	/**
	 * The ID of the job associated with this activity.
	 * @type {string}
	 */
	jobId: string

	/**
	 * The value of the field before the change.
	 * Can be null if it's a creation event.
	 * @type {string | null | undefined}
	 */
	previousValue?: string | null

	/**
	 * The value of the field after the change.
	 * @type {string | null | undefined}
	 */
	currentValue?: string | null

	/**
	 * The timestamp when the modification occurred.
	 * @type {Date}
	 */
	modifiedAt: Date

	/**
	 * The user who performed the modification.
	 * @type {User}
	 */
	modifiedBy: User

	/**
	 * The ID of the user who performed the modification.
	 * @type {string}
	 */
	modifiedById: string

	/**
	 * The name of the field that was changed (e.g., "statusId", "assignee").
	 * @type {string}
	 */
	fieldName: string

	/**
	 * The type of activity that was performed (e.g., "ChangeStatus", "AssignMember").
	 * @type {ActivityType}
	 */
	activityType: ActivityType

	/**
	 * Optional notes or comments about the activity.
	 * @type {string | null | undefined}
	 */
	notes?: string | null
}