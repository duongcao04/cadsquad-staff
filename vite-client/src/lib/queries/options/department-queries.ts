import { queryOptions } from "@tanstack/react-query";
import { IDepartmentResponse } from "../../../shared/interfaces";
import { TDepartment } from "../../../shared/types";
import { departmentApi } from "../../api";

export const mapDepartment: (item?: IDepartmentResponse) => TDepartment = (
	item
) => ({
	id: item?.id ?? '',
	code: item?.code ?? '',
	users: item?.users ?? [],
	hexColor: item?.hexColor ?? '#ffffff',
	notes: item?.notes ?? '',
	displayName: item?.displayName ?? '',
	createdAt: new Date(item?.createdAt ?? ''),
	updatedAt: new Date(item?.updatedAt ?? ''),
})


export const departmentsListOptions = () => {
	return queryOptions({
		queryKey: ['departments'],
		queryFn: () => departmentApi.findAll(),
		select: (res) => {
			const departmentsData = res?.result
			return Array.isArray(departmentsData)
				? departmentsData.map(mapDepartment)
				: []
		},
	})
}

export const departmentOptions = (identify: string) => {
	return queryOptions({
		queryKey: ['departments', 'identify', identify],
		queryFn: () => departmentApi.findOne(identify),
		select: (res) => {
			const departmentData = res?.result
			return mapDepartment(departmentData)
		},
	})
}