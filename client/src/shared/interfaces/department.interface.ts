import { User } from "./user.interface"

/**
 * Represents an organizational department within the company.
 * Each department can have multiple users assigned to it.
 */
export interface Department {
	/**
	 * The unique identifier for the department.
	 * @type {string}
	 */
	id: string

	/**
	 * The human-readable name of the department (e.g., "Human Resources", "Engineering").
	 * @type {string}
	 */
	displayName: string

	/**
	 * Optional notes or a description for the department.
	 * @type {string | null | undefined}
	 */
	notes?: string | null

	/**
	 * A unique code or abbreviation for the department (e.g., "HR", "ENG").
	 * @type {string}
	 */
	code: string

	/**
	 * A list of users who are members of this department.
	 * @type {User[]}
	 */
	users: User[]

	/**
	 * The timestamp when the department was created.
	 * @type {Date}
	 */
	createdAt: Date

	/**
	 * The timestamp when the department was last updated.
	 * @type {Date}
	 */
	updatedAt: Date
}