import { fakerVI as faker, faker as fakerGlobal } from "@faker-js/faker"
import { JobType, Prisma, PrismaClient, User } from "@prisma/client"

const prisma = new PrismaClient()

const jobActions = [
	"Design", "Analysis", "Optimization", "Testing", "Upgrade", "Redesign",
	"Development", "Implementation", "Maintenance", "Installation",
	"Calibration", "Inspection", "Simulation", "Validation", "Integration"
];
const jobTitles = [
	"Automated Assembly Line", "HVAC System", "Robotic Arm", "Heat Exchanger",
	"Conveyor Belt System", "Pneumatic System", "Turbine Blade", "Gear Box",
	"Hydraulic Press", "Vibration Damping System", "Engine Cooling System",
	"CNC Machine Tool", "Bearing Analysis", "Compressor Performance",
	"Material Handling System", "Pump Station", "Valve Control System",
	"Shaft Design", "Boiler System", "Clutch Mechanism", "Brake System",
	"Suspension System", "Transmission System", "Flywheel Design",
	"Pressure Vessel", "Piping Network", "Cooling Tower", "Centrifugal Fan",
	"Steam Turbine", "Gas Compressor"
];

function getRandomItem<T>(list: T[]): T {
	return list[Math.floor(Math.random() * list.length)];
}

async function getRandomUser(): Promise<User | null> {
	const users = await prisma.user.findMany();
	if (users.length === 0) return null;
	return users[Math.floor(Math.random() * users.length)];
}

function getDueAt(maxDays = 70) {
	const days = Math.floor(Math.random() * maxDays) + 1;
	return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

const getRandomJobType = async () => {
	const types = await prisma.jobType.findMany();
	if (types.length === 0) return null;
	return types[Math.floor(Math.random() * types.length)];
}

async function getRandomUsers(maxTeamSize = 10) {
	const users = await prisma.user.findMany();
	if (!Array.isArray(users) || users.length === 0) return [];

	// Shuffle array using Fisher-Yates
	const shuffled = [...users];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}

	// Return up to maxLengthReturn users
	return shuffled.slice(0, Math.min(maxTeamSize, users.length));
}

/**
 * Compute next job 'no' for given job type.
 * Format: <type.code>-<4digits> (pad left with zeros)
 */
async function getJobNo(type: JobType) {
	// fetch all `no` strings for this type (if many rows this can be optimized via raw SQL)
	const jobs = await prisma.job.findMany({
		where: { typeId: type.id },
		select: { no: true },
	});
	let maxNum = 0;
	for (const j of jobs) {
		if (!j.no) continue;
		const m = j.no.match(/-(\d+)$/);
		if (m) {
			const n = parseInt(m[1], 10);
			if (!Number.isNaN(n) && n > maxNum) maxNum = n;
		}
	}
	const next = maxNum + 1;
	return `${type.code}-${String(next).padStart(4, "0")}`;
}

export async function seedJob(prisma: PrismaClient, fakerRounds: number = 20) {
	// Get common data once
	const users = await prisma.user.findMany();
	const paymentChannels = await prisma.paymentChannel.findMany({});
	const jobStatuses = await prisma.jobStatus.findMany({});
	const jobTypes = await prisma.jobType.findMany();

	if (users.length === 0 || paymentChannels.length === 0 || jobStatuses.length === 0 || jobTypes.length === 0) {
		throw new Error("Missing required data: users, payment channels, job statuses, or job types");
	}

	for (let i = 0; i < fakerRounds; i++) {
		// Generate unique values for each job
		const type = jobTypes[Math.floor(Math.random() * jobTypes.length)];
		const jobNo = await getJobNo(type); // Generate unique job number for each iteration
		const createdById = users[Math.floor(Math.random() * users.length)].id;
		const incomeCost = Math.floor(Math.random() * 1001); // Dollar
		const staffCost = incomeCost * 26385; // Dollar to VND

		// Get random assignees for this job
		const shuffled = [...users];
		for (let j = shuffled.length - 1; j > 0; j--) {
			const k = Math.floor(Math.random() * (j + 1));
			[shuffled[j], shuffled[k]] = [shuffled[k], shuffled[j]];
		}
		const maxTeamSize = Math.min(10, users.length);
		const teamSize = Math.floor(Math.random() * maxTeamSize) + 1;
		const assigneeIds = shuffled.slice(0, teamSize).map(u => u.id);

		const paymentChannelId = paymentChannels[Math.floor(Math.random() * paymentChannels.length)].id;
		const statusId = jobStatuses[Math.floor(Math.random() * jobStatuses.length)].id;

		const job = {
			no: jobNo, // This will be unique for each job
			typeId: type.id,
			displayName: getRandomItem(jobActions) + ' of ' + getRandomItem(jobTitles),
			clientName: fakerGlobal.person.fullName(),
			dueAt: getDueAt(70),
			incomeCost,
			staffCost,
			statusId,
			createdById,
			assignee: {
				connect: assigneeIds.map((id) => ({ id })),
			},
			paymentChannelId,
			isPaid: Math.random() < 0.5,
			isPinned: Math.random() < 0.5,
			isPublished: Math.random() < 0.5,
		}

		try {
			await prisma.job.create({
				data: job
			});
		} catch (error) { }
		console.log(`Created job ${i + 1}/${fakerRounds}:`, job.no, job.displayName);
	}
}

seedJob(prisma, 50).then(() => {
	console.log("Seed jobs successfully!");
}).catch((error) => {
	console.error("Error seeding jobs:", error);
}).finally(async () => {
	await prisma.$disconnect();
});