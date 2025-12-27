import { queryOptions } from "@tanstack/react-query"
import { ICommunityResponse } from "../../../shared/interfaces"
import { TCommunity } from "../../../shared/types"
import { communityApi } from "../../api/_community.api"

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