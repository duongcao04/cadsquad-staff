import { IPostResponse } from "../interfaces";

export type TPost = Omit<IPostResponse, 'authorId' | 'topicId'>