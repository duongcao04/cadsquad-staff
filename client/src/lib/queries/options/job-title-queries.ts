import { queryOptions } from "@tanstack/react-query";
import { IJobTitleResponse } from "@/shared/interfaces";
import { TJobTitle } from "@/shared/types";
import { jobTitleApi } from "../../api";

export const mapJobTitle: (item?: IJobTitleResponse) => TJobTitle = (item) => ({
	id: item?.id ?? '',
	code: item?.code ?? '',
	users: item?.users ?? [],
	notes: item?.notes ?? '',
	displayName: item?.displayName ?? '',
	createdAt: new Date(item?.createdAt ?? ""),
	updatedAt: new Date(item?.updatedAt ?? ""),
})


export const jobTitlesListOptions = () => {
	return queryOptions({
		queryKey: ['job-titles'],
		queryFn: () => jobTitleApi.findAll(),
		select: (res) => {
			const jobTitlesData = res?.result
			return Array.isArray(jobTitlesData)
				? jobTitlesData.map(mapJobTitle)
				: []
		},
	})
}

export const jobTitleOptions = (id: string) => {
	return queryOptions({
		queryKey: ['job-titles', 'id', id],
		queryFn: () => jobTitleApi.findOne(id),
		select: (res) => {
			const jobTitleData = res?.result
			return mapJobTitle(jobTitleData)
		},
	})
}