import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
	try {
		const result = await prisma.paymentChannel.findMany({
			orderBy: {
				name: 'asc',
			},
			include: {
				jobs: {},
				_count: {
					select: {
						jobs: true,
					},
				},
			},
		})

		return NextResponse.json(
			{
				success: true,
				message: "Lấy danh sách thông tin phương thức thanh toán thành công",
				result,
			},
			{ status: 200 }
		)
	} catch (error) {
		console.error('Error fetching job statuses:', error)
		return NextResponse.json(
			{
				success: false,
				message: "Lấy danh sách thông tin phương thức thanh toán thất bại",
				error,
			},
			{ status: 500 }
		)
	}
}