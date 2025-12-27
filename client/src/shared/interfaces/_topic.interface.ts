import { ETopicType } from "../enums/_topic-type.enum";

export interface ITopicResponse {
	id: string;
	code: string;
	title: string;
	description?: string | null;
	type: ETopicType;
	icon?: string | null;
	communityId: string;
	createdAt: Date;
	updatedAt: Date;
}