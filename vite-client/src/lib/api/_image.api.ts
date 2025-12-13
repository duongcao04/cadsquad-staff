import { ApiResponse, axiosClient } from '@/lib/axios'

export const imageApi = {
    upload: async (image: File) => {
        const formData = new FormData()
        formData.append('image', image)
        return await axiosClient
            .post<ApiResponse<{ secure_url: string }>>(
                '/v1/upload/image',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            )
            .then((res) => res.data.result?.secure_url)
    },
}
