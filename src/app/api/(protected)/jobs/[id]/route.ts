import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PATCH(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	const body = await request.json()
	const { jobStatusId } = body
	const projectId = parseInt(params.id)

	if (isNaN(projectId)) {
		return NextResponse.json(
			{ error: 'Invalid project ID' },
			{ status: 400 }
		)
	}
	try {

		if (!jobStatusId || typeof jobStatusId !== 'number') {
			return NextResponse.json(
				{ error: 'jobStatusId is required and must be a number' },
				{ status: 400 }
			)
		}

		const existingProject = await projectService.isExist({
			projectId,
		})

		if (!existingProject) {
			return NextResponse.json(
				{ error: 'Project not found' },
				{ status: 404 }
			)
		}

		const newJobStatus = await prisma.jobStatus.findUnique({
			where: { id: jobStatusId },
		})

		if (!newJobStatus) {
			return NextResponse.json(
				{ error: 'Job status not found' },
				{ status: 404 }
			)
		}

		// Update the project's job status
		const updatedProject = await projectService.updateStatus({
			projectId,
			jobStatusId,
			newJobStatus,
		})

		return NextResponse.json({
			message: message.updated(),
			project: updatedProject,
		})
	} catch (error) {
		return NextResponse.json(
			{ error: 'Internal server error', message: error },
			{ status: 500 }
		)
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	const jobId = Number(params.id)

	if (isNaN(jobId)) {
		return NextResponse.json(
			{ message: 'JobID không hợp lệ' },
			{ status: 400 }
		)
	}

	try {
		await prisma.job.update({
			where: { id: jobId },
			data: {
				deletedAt: new Date()
			}
		})

		return NextResponse.json(
			{
				success: true,
				message: "Xóa dự án thành công",
				result: {
					jobId
				},
			},
			{ status: 200 }
		)
	} catch (error) {
		return NextResponse.json(
			{
				success: true,
				message: "Xóa dự án thất bại",
				error,
			},
			{ status: 500 }
		)
	}
}
