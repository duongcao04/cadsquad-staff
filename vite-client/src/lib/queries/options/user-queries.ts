import { queryOptions } from "@tanstack/react-query";
import { IUserResponse } from "../../../shared/interfaces";
import { TDepartment, TUser } from "../../../shared/types";
import { IMAGES } from "../../utils";
import { userApi } from "../../api";

export const mapUser: (item?: IUserResponse) => TUser = (item) => ({
	id: item?.id ?? "",

	displayName: item?.displayName ?? 'Unknown User',
	avatar: item?.avatar ?? IMAGES.emptyAvatar,
	email: item?.email ?? "",
	username: item?.username ?? "",
	phoneNumber: item?.phoneNumber ?? "",

	department: item?.department ?? {} as TDepartment,
	jobTitle: item?.jobTitle,

	isActive: Boolean(item?.isActive),

	role: item?.role ?? 'USER',

	files: item?.files ?? [],
	accounts: item?.accounts ?? [],
	notifications: item?.notifications ?? [],
	configs: item?.configs ?? [],
	filesCreated: item?.filesCreated ?? [],
	jobActivityLog: item?.jobActivityLog ?? [],
	jobsAssigned: item?.jobsAssigned ?? [],
	jobsCreated: item?.jobsCreated ?? [],
	sendedNotifications: item?.sendedNotifications ?? [],

	lastLoginAt: item?.lastLoginAt ? new Date(item?.lastLoginAt) : null,
	createdAt: new Date(item?.createdAt ?? ""),
	updatedAt: new Date(item?.updatedAt ?? ""),
})


export const usersListOptions = () => {
	return queryOptions({
		queryKey: ['users'],
		queryFn: () => userApi.findAll(),
		select: (res) => {
			const userData = res?.result?.users
			return {
				users: Array.isArray(userData)
					? userData.map(mapUser)
					: [],
				total: res.result?.total ?? 0
			}
		},
	})
}

export const userOptions = (username: string) => {
	return queryOptions({
		queryKey: ['users', 'username', username],
		queryFn: () => userApi.findOne(username),
		select: (res) => {
			const userData = res?.result
			return mapUser(userData)
		},
	})
}