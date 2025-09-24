/**
 * Example of a user-related type.
 * Represents a summary of a user, containing only essential information.
 *
 * @example
 * const userSummary: UserSummary = {
 *   id: "123-abc",
 *   displayName: "John Doe",
 *   avatar: "https://example.com/avatar.png"
 * };
 */
export type UserSummary = {
	/** The unique identifier of the user. */
	id: string;

	/** The name to be displayed for the user. */
	displayName: string;

	/** An optional URL to the user's avatar image. */
	avatar?: string;
};