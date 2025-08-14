import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
	try {
		const result = await prisma.jobType.findMany({
			orderBy: {
				name: 'asc',
			},
			include: {
				jobs: {},
				_count: {
					select: {
						jobs: true
					},
				},
			},
		})

		return NextResponse.json(
			{
				success: true,
				message: 'Lấy thông tin phân loại dự án thành công',
				result,
			},
			{ status: 200 }
		)
	} catch (error) {
		return NextResponse.json(
			{
				success: false,
				message: 'Lấy thông tin phân loại dự án thất bại',
				error,
			},
			{ status: 500 }
		)
	}
}