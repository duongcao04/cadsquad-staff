import { useQuery } from "@tanstack/react-query"
import { axiosClient } from "../lib/axios"

export const useJobStatuses = () => {
	return useQuery({ queryKey: ['jobStatuses'], queryFn: () => axiosClient.get('api/job-statuses'), select: (res) => res.data })
}