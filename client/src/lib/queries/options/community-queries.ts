import { queryOptions } from "@tanstack/react-query"
import { ICommunityResponse, ITopicResponse } from "../../../shared/interfaces"
import { TCommunity, TTopic } from "../../../shared/types"
import { communityApi } from "../../api/_community.api"
import { ETopicType } from "../../../shared/enums"

export const mapCommunity: (item?: ICommunityResponse) => TCommunity = (
	item
) => ({
	id: item?.id ?? '',
	code: item?.code ?? '',
	displayName: item?.displayName ?? "Unknown Community",
	banner: item?.banner ?? "",
	color: item?.color ?? "#ffffff",
	description: item?.description ?? "",
	icon: item?.icon ?? "",
	topics: item?.topics ?? [],
	createdAt: new Date(item?.createdAt ?? ''),
	updatedAt: new Date(item?.updatedAt ?? ''),
})
export const mapTopic: (item?: ITopicResponse) => TTopic = (
	item
) => ({
	id: item?.id ?? '',
	code: item?.code ?? '',
	title: item?.title ?? "Unknown Topic",
	description: item?.description ?? "",
	icon: item?.icon ?? "",
	community: item?.community ?? undefined,
	type: item?.type ?? ETopicType.GENERAL,
	createdAt: new Date(item?.createdAt ?? ''),
	updatedAt: new Date(item?.updatedAt ?? ''),
})


export const communitiesListOptions = () => {
	return queryOptions({
		queryKey: ['communities'],
		queryFn: () => communityApi.getCommunities(),
		select: (res) => {
			const communitiesData = res?.result
			return Array.isArray(communitiesData)
				? communitiesData.map(mapCommunity)
				: []
		},
	})
}
export const communitiesPostsListOptions = (code: string) => {
	return queryOptions({
		queryKey: ['communities', code, 'posts'],
		queryFn: () => communityApi.getCommunityPosts(code),
		select: (res) => {
			const postsData = res?.result
			return postsData
		},
	})
}


export const communityOptions = (identify: string) => {
	return queryOptions({
		queryKey: ['communities', 'identify', identify],
		queryFn: () => communityApi.getCommunityByCode(identify),
		select: (res) => {
			const communityData = res?.result
			return mapCommunity(communityData)
		},
	})
}
export const topicQueries = (communityCode: string, topicCode: string) => {
	return queryOptions({
		queryKey: ['topic', `community=${communityCode}`, `topic=${topicCode}`],
		queryFn: () => communityApi.getTopicDetails(communityCode, topicCode),
		select: (res) => {
			const topicData = res?.result
			return mapTopic(topicData)
		},
	})
}