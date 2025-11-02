import { Job } from "./_job.interface"

/**
 * Represents a payment channel, such as a bank account or online payment service.
 * It is used to track financial transactions related to jobs.
 */
export interface PaymentChannel {
	/**
	 * The unique identifier for the payment channel.
	 * @type {string}
	 */
	id: string

	/**
	 * The human-readable name of the payment channel (e.g., "Bank of America", "PayPal").
	 * @type {string}
	 */
	displayName: string

	/**
	 * An optional hexadecimal color code for UI display.
	 * @type {string | null | undefined}
	 */
	hexColor?: string | null

	/**
	 * An optional URL for the logo of the payment channel.
	 * @type {string | null | undefined}
	 */
	logoUrl?: string | null

	/**
	 * The name of the account owner.
	 * @type {string | null | undefined}
	 */
	ownerName?: string | null

	/**
	 * The account or card number, which may be partially masked for security.
	 * @type {string | null | undefined}
	 */
	cardNumber?: string | null

	/**
	 * A list of jobs that have used this payment channel.
	 * @type {Job[]}
	 */
	jobs: Job[]
}