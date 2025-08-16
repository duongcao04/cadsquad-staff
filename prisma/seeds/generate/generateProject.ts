import { JobStatus, JobType, User } from '@prisma/client'

// Project name components for random generation
const projectTypes = [
    'Automated Assembly Line',
    'HVAC System',
    'Robotic Arm',
    'Heat Exchanger',
    'Conveyor Belt System',
    'Pneumatic System',
    'Turbine Blade',
    'Gear Box',
    'Hydraulic Press',
    'Vibration Damping System',
    'Engine Cooling System',
    'CNC Machine Tool',
    'Bearing Analysis',
    'Compressor Performance',
    'Material Handling System',
    'Pump Station',
    'Valve Control System',
    'Shaft Design',
    'Boiler System',
    'Clutch Mechanism',
    'Brake System',
    'Suspension System',
    'Transmission System',
    'Flywheel Design',
    'Pressure Vessel',
    'Piping Network',
    'Cooling Tower',
    'Centrifugal Fan',
    'Steam Turbine',
    'Gas Compressor',
]

const projectActions = [
    'Design',
    'Analysis',
    'Optimization',
    'Testing',
    'Upgrade',
    'Redesign',
    'Development',
    'Implementation',
    'Maintenance',
    'Installation',
    'Calibration',
    'Inspection',
    'Simulation',
    'Validation',
    'Integration',
]

const repositories = [
    'assembly-line-cad',
    'hvac-optimization',
    'robotic-arm-control',
    'heat-exchanger-design',
    'conveyor-upgrade',
    'pneumatic-system',
    'turbine-analysis',
    'gearbox-redesign',
    'hydraulic-press',
    'vibration-damping',
    'engine-cooling',
    'cnc-optimization',
    'bearing-analysis',
    'compressor-testing',
    'material-handling',
    'pump-design',
    'valve-control',
    'shaft-analysis',
    'boiler-system',
    'clutch-design',
]

// Utility functions
const getRandomElement = <T>(array: T[]): T => {
    return array[Math.floor(Math.random() * array.length)]
}

const getRandomElements = <T>(array: T[], count: number): T[] => {
    const shuffled = [...array].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
}

const getRandomPrice = (min: number = 25000, max: number = 150000): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

const getRandomDate = (start: Date, end: Date): Date => {
    return new Date(
        start.getTime() + Math.random() * (end.getTime() - start.getTime())
    )
}

const generateJobNo = (): string => {
    const prefixes = ['OTH', 'FV', 'XP', 'PCM']
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)]
    const randomNum = Math.floor(Math.random() * 9999) + 1
    return `${randomPrefix}.${randomNum.toString().padStart(3, '0')}`
}

const generateProjectName = (): string => {
    const type = getRandomElement(projectTypes)
    const action = getRandomElement(projectActions)
    return `${type} ${action}`
}

const generateSourceUrl = (): string => {
    const repo = getRandomElement(repositories)
    return `https://github.com/mech-eng/${repo}`
}

function getRandomClientName() {
    const firstNames = ["Liam","Emma","Noah","Olivia","Ava","Ethan","Sophia","Mason","Isabella","Logan",
    ]
    const lastNames = ["Smith","Johnson","Williams","Jones","Brown","Davis","Miller","Wilson","Moore","Taylor",
    ]

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]

    return `${firstName} ${lastName}`
}

export type RadomProjectOptions = {
    year?: number
    minPrice?: number
    maxPrice?: number
    minTeamSize?: number
    maxTeamSize?: number
    startDateRange?: { start: Date; end: Date }
    durationRange?: { min: number; max: number } // in months
}
// Main random project generator function
export const generateRandomProject = (
    users: User[],
    jobTypes: JobType[],
    jobStatuses: JobStatus[],
    options: RadomProjectOptions = {}
) => {
    const {
        year = 2024,
        minPrice = 25000,
        maxPrice = 150000,
        minTeamSize = 1,
        maxTeamSize = 5,
        startDateRange = {
            start: new Date(year, 0, 1),
            end: new Date(year, 11, 31),
        },
        durationRange = { min: 3, max: 12 },
    } = options

    const jobNo = generateJobNo()
    const jobName = generateProjectName()
    const income = getRandomPrice(minPrice, maxPrice)
    const staffCost = getRandomPrice(minPrice, maxPrice)
    const clientName = getRandomClientName()
    const sourceUrl = generateSourceUrl()
    const jobStatus = getRandomElement(jobStatuses)

    const startedAt = getRandomDate(startDateRange.start, startDateRange.end)
    const durationMonths =
        Math.floor(
            Math.random() * (durationRange.max - durationRange.min + 1)
        ) + durationRange.min
    const dueAt = new Date(
        startedAt.getFullYear(),
        startedAt.getMonth() + durationMonths,
        startedAt.getDate()
    )

    const teamSize =
        Math.floor(Math.random() * (maxTeamSize - minTeamSize + 1)) +
        minTeamSize
    const assignedMembers = getRandomElements(
        users,
        Math.min(teamSize, users.length)
    )
    const jobType = getRandomElements(
        jobTypes,
        Math.min(teamSize, users.length)
    )

    // Generate completion date if status is completed
    const completedAt =
        jobStatus.title === 'Completed'
            ? getRandomDate(startedAt, dueAt)
            : undefined

    return {
        jobNo,
        jobName,
        income,
        staffCost,
        jobType,
        sourceUrl,
        clientName,
        jobStatusId: jobStatus.id,
        startedAt,
        dueAt,
        ...(completedAt && { completedAt }),
        memberAssign: {
            connect: assignedMembers.map((user) => ({ id: user.id })),
        },
    }
}

export const generateRandomProjects = (
    count: number,
    users: User[],
    jobType: JobType[],
    jobStatuses: JobStatus[],
    options?: RadomProjectOptions
) => {
    const projects = []
    const usedJobNos = new Set<string>()

    for (let i = 0; i < count; i++) {
        let project
        let attempts = 0

        // Ensure unique job numbers
        do {
            project = generateRandomProject(
                users,
                jobType,
                jobStatuses,
                options
            )
            attempts++
        } while (usedJobNos.has(project.jobNo) && attempts < 100)

        usedJobNos.add(project.jobNo)
        projects.push(project)
    }

    return projects
}
