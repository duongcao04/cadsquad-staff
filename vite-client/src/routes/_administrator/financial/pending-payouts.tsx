import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Button,
    Chip,
    Card,
    Avatar,
    Badge,
    useDisclosure,
    addToast,
} from '@heroui/react'
import { CheckCircle2, CreditCard, DollarSign, Eye } from 'lucide-react'
import { jobsPendingPayoutsOptions } from '../../../lib/queries'
import { useSuspenseQuery } from '@tanstack/react-query'
import AdminContentContainer from '../../../shared/components/admin/AdminContentContainer'
import {
    currencyFormatter,
    getPageTitle,
    INTERNAL_URLS,
    useMarkPaidMutation,
} from '../../../lib'
import {
    AdminPageHeading,
    HeroBreadcrumbs,
    HeroBreadcrumbItem,
    HeroTooltip,
} from '../../../shared/components'
import { useState } from 'react'
import { TJob } from '../../../shared/types'
import { ConfirmPaymentModal } from '../../../shared/components/financial/ConfirmPaymentModal'

export const Route = createFileRoute(
    '/_administrator/financial/pending-payouts'
)({
    head: () => ({
        meta: [
            {
                title: getPageTitle('Pending Payouts'),
            },
        ],
    }),
    loader: ({ context }) => {
        return context.queryClient.ensureQueryData({
            ...jobsPendingPayoutsOptions(),
        })
    },
    component: PendingPayoutsPage,
})
function PendingPayoutsPage() {
    const router = useRouter()
    const { data: pendingPayoutJobs } = useSuspenseQuery({
        ...jobsPendingPayoutsOptions(),
    })

    const markPaidMutation = useMarkPaidMutation(() => {
        addToast({
            title: 'Pay for job successfully',
            color: 'success',
        })
    })

    const [targetJob, setTargetJob] = useState<TJob | null>(null)

    const {
        isOpen: isOpenConfirmPaymentModal,
        onOpen: onOpenConfirmPaymentModal,
        onOpenChange: onConfirmPaymentModalChange,
    } = useDisclosure()

    const handleOpenModal = (job: TJob) => {
        setTargetJob(job)
        onOpenConfirmPaymentModal()
    }

    return (
        <>
            <AdminPageHeading
                title={
                    <Badge
                        content={pendingPayoutJobs.length}
                        size="sm"
                        color="danger"
                        variant="solid"
                        classNames={{
                            badge: '-right-1 top-1 text-[10px]! font-bold!',
                        }}
                    >
                        Pending Payouts
                    </Badge>
                }
            />

            <HeroBreadcrumbs className="pt-3 px-7 text-xs">
                <HeroBreadcrumbItem>
                    <Link
                        to={INTERNAL_URLS.admin}
                        className="text-text-subdued!"
                    >
                        Financial
                    </Link>
                </HeroBreadcrumbItem>
                <HeroBreadcrumbItem>Pending payouts</HeroBreadcrumbItem>
            </HeroBreadcrumbs>

            <AdminContentContainer className="mt-1">
                {isOpenConfirmPaymentModal && (
                    <ConfirmPaymentModal
                        isOpen={isOpenConfirmPaymentModal}
                        onOpenChange={onConfirmPaymentModalChange}
                        job={targetJob}
                        onConfirm={async (jobId) => {
                            markPaidMutation.mutateAsync(jobId)
                        }}
                    />
                )}
                <Card className="p-4 border-none shadow-sm bg-background/60 backdrop-blur-md">
                    <div className="flex justify-between items-center mb-6 px-2">
                        <div>
                            <h2 className="text-xl font-bold">
                                Accounting Desk
                            </h2>
                            <p className="text-small text-default-500">
                                Verify and confirm payments for completed jobs.
                            </p>
                        </div>
                        <Chip
                            color="warning"
                            variant="flat"
                            startContent={<DollarSign size={14} />}
                        >
                            Pending Payouts: {pendingPayoutJobs?.length}
                        </Chip>
                    </div>

                    <Table aria-label="Accounting payment table" removeWrapper>
                        <TableHeader>
                            <TableColumn>JOB NO</TableColumn>
                            <TableColumn>ASSIGNEES</TableColumn>
                            <TableColumn>PAYMENT METHOD</TableColumn>
                            <TableColumn>AMOUNT</TableColumn>
                            <TableColumn align="center">ACTIONS</TableColumn>
                        </TableHeader>
                        <TableBody emptyContent="No payments pending.">
                            {pendingPayoutJobs.map((job) => (
                                <TableRow key={job.id}>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-bold">
                                                {job.no}
                                            </span>
                                            <span className="text-[10px] text-default-400">
                                                {job.displayName}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex -space-x-2">
                                            {job.assignee.map((user) => (
                                                <Avatar
                                                    key={user.id}
                                                    src={user.avatar}
                                                    size="sm"
                                                    className="border-2 border-background"
                                                />
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-default-100 rounded-lg">
                                                <CreditCard
                                                    size={16}
                                                    className="text-default-500"
                                                />
                                            </div>
                                            <span className="text-small font-medium">
                                                {job.paymentChannel
                                                    ?.displayName || 'N/A'}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-mono font-bold text-success-600">
                                            {currencyFormatter(
                                                job.staffCost,
                                                'Vietnamese'
                                            )}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 justify-center">
                                            <HeroTooltip content="View details">
                                                <Button
                                                    size="sm"
                                                    isIconOnly
                                                    onPress={() => {
                                                        router.navigate({
                                                            href: INTERNAL_URLS.getJobDetailUrl(
                                                                job.no
                                                            ),
                                                        })
                                                    }}
                                                >
                                                    <Eye size={16} />
                                                </Button>
                                            </HeroTooltip>
                                            <Button
                                                size="sm"
                                                color="success"
                                                variant="flat"
                                                onPress={() =>
                                                    handleOpenModal(job)
                                                }
                                                startContent={
                                                    <CheckCircle2 size={16} />
                                                }
                                            >
                                                Confirm Payment
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </AdminContentContainer>
        </>
    )
}
