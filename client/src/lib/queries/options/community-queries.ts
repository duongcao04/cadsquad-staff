import { queryOptions } from '@tanstack/react-query'

import { ETopicType } from '../../../shared/enums'
import { ICommunityResponse, ITopicResponse } from '../../../shared/interfaces'
import { TCommunity, TTopic } from '../../../shared/types'
import { communityApi } from '../../api/_community.api'
import { COLORS, IMAGES, toDate } from '../../utils'

export const mapCommunity: (item?: ICommunityResponse) => TCommunity = (
    item
) => ({
    id: item?.id ?? 'N/A',
    code: item?.code ?? 'UNKNOWN',
    displayName: item?.displayName ?? 'Unknown Community',
    banner: item?.banner ?? IMAGES.emptyCommunityBanner,
    color: item?.color ?? COLORS.white,
    description: item?.description ?? null,
    icon: item?.icon ?? IMAGES.loadingPlaceholder,
    topics: item?.topics ?? [],
    createdAt: toDate(item?.createdAt),
    updatedAt: toDate(item?.updatedAt),
})
export const mapTopic: (item?: ITopicResponse) => TTopic = (item) => ({
    id: item?.id ?? 'N/A',
    code: item?.code ?? 'UNKNOWN',
    title: item?.title ?? 'Unknown Topic',
    description: item?.description ?? '',
    icon: item?.icon ?? IMAGES.loadingPlaceholder,
    community: mapCommunity(item?.community),
    type: item?.type ?? ETopicType.GENERAL,
    createdAt: toDate(item?.createdAt),
    updatedAt: toDate(item?.updatedAt),
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
