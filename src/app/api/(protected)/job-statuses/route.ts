import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
	try {
		const result = await prisma.jobStatus.findMany({
			orderBy: {
				order: 'asc',
			},
			include: {
				jobs: true,
				_count: {
					select: {
						jobs: true,
					},
				},
			},
		})

		return NextResponse.json({
			success: true,
			message: "Lấy thông tin phân loại trạng thái dự án thành công",
			result,
		})
	} catch (error) {
		return NextResponse.json(
			{
				success: false,
				messgae: "Lấy thông tin phân loại trạng thái dự án thất bại",
				error,
			},
			{ status: 500 }
		)
	}
}