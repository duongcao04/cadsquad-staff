import { ITopicResponse } from "../interfaces/_topic.interface";

export type TTopic = Omit<ITopicResponse, 'communityId' | 'icon'> & {
	icon: string
}