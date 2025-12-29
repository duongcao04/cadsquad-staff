import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Select,
    SelectItem,
    Tab,
    Tabs,
    Avatar,
    Divider,
    Card,
    CardBody,
} from '@heroui/react'
import {
    Landmark,
    Save,
    TrendingUp,
    Users,
    Wallet,
    ReceiptText,
    CheckCircle2,
    DollarSign,
    Scale,
} from 'lucide-react'
import { useMemo, useState, useEffect } from 'react'
import { toast } from 'sonner'

// --- FAKE DATA ---
const FAKE_PAYMENT_CHANNELS = [
    { id: 'ch_1', displayName: 'Techcombank - Main Account' },
    { id: 'ch_2', displayName: 'Vietcombank - Project Fund' },
    { id: 'ch_3', displayName: 'Momo Business' },
]

export default function UpdateCostModal({ data, isOpen, onClose }: any) {
    const [selectedTab, setSelectedTab] = useState<string>('revenue')

    // Revenue States
    const [incomeCost, setIncomeCost] = useState<string>('0')
    const [paymentChannelId, setPaymentChannelId] = useState<string>('')

    // Assignment States
    const [assignedMembers, setAssignedMembers] = useState<any[]>([])

    useEffect(() => {
        if (isOpen && data) {
            setIncomeCost(data.incomeCost?.toString() || '25000000')
            setPaymentChannelId(data.paymentChannelId || 'ch_1')
            if (data.assignments) {
                setAssignedMembers(
                    data.assignments.map((asgn: any) => ({
                        userId: asgn.user.id,
                        displayName: asgn.user.displayName,
                        avatar: asgn.user.avatar,
                        staffCost: asgn.staffCost || 0,
                    }))
                )
            }
        }
    }, [isOpen, data])

    const totalStaffCost = useMemo(
        () => assignedMembers.reduce((sum, m) => sum + m.staffCost, 0),
        [assignedMembers]
    )

    const profit = useMemo(
        () => (parseFloat(incomeCost) || 0) - totalStaffCost,
        [incomeCost, totalStaffCost]
    )
    const profitMargin = useMemo(() => {
        const income = parseFloat(incomeCost) || 0
        return income > 0 ? ((profit / income) * 100).toFixed(1) : '0'
    }, [profit, incomeCost])

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="2xl"
            backdrop="blur"
            scrollBehavior="inside"
            classNames={{
                base: 'bg-background dark:bg-zinc-950 border border-divider shadow-2xl',
                header: 'border-b border-divider bg-default-50/50',
                footer: 'bg-default-50/50 border-t border-divider',
            }}
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1 py-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <TrendingUp size={22} className="text-primary" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">
                                Financial Workbench
                            </h3>
                            <p className="text-tiny font-medium text-default-400">
                                Managing Records for Project #
                                {data?.no || 'N/A'}
                            </p>
                        </div>
                    </div>
                </ModalHeader>

                <ModalBody className="py-6 px-8">
                    <Tabs
                        fullWidth
                        aria-label="Financial Tabs"
                        color="primary"
                        variant="solid"
                        radius="full"
                        selectedKey={selectedTab}
                        onSelectionChange={(k) => setSelectedTab(k as string)}
                        classNames={{
                            tabList: 'bg-default-100 p-1',
                            cursor: 'shadow-sm',
                            tab: 'h-10',
                        }}
                    >
                        {/* TAB 1: REVENUE */}
                        <Tab
                            key="revenue"
                            title={
                                <div className="flex items-center gap-2">
                                    <DollarSign size={16} />
                                    <span>Income</span>
                                </div>
                            }
                        >
                            <div className="flex flex-col gap-8 py-6">
                                <div className="grid grid-cols-1 gap-6">
                                    <Input
                                        label="Project Revenue"
                                        placeholder="0"
                                        variant="faded"
                                        type="number"
                                        labelPlacement="outside"
                                        size="lg"
                                        value={incomeCost}
                                        onValueChange={setIncomeCost}
                                        startContent={
                                            <span className="text-default-400 font-semibold">
                                                ₫
                                            </span>
                                        }
                                        classNames={{
                                            input: 'font-bold text-lg',
                                        }}
                                    />
                                    <Select
                                        label="Settlement Account"
                                        labelPlacement="outside"
                                        placeholder="Select account channel"
                                        variant="faded"
                                        size="lg"
                                        selectedKeys={[paymentChannelId]}
                                        onSelectionChange={(keys) =>
                                            setPaymentChannelId(
                                                Array.from(keys)[0] as string
                                            )
                                        }
                                        startContent={
                                            <Landmark
                                                size={20}
                                                className="text-primary"
                                            />
                                        }
                                    >
                                        {FAKE_PAYMENT_CHANNELS.map((c) => (
                                            <SelectItem key={c.id}>
                                                {c.displayName}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                </div>

                                <div className="flex justify-end">
                                    <Button
                                        color="primary"
                                        className="font-bold px-8 shadow-lg shadow-primary/30"
                                        startContent={
                                            <CheckCircle2 size={18} />
                                        }
                                        onPress={() =>
                                            toast.success(
                                                'Income details updated locally'
                                            )
                                        }
                                    >
                                        Update Revenue
                                    </Button>
                                </div>
                            </div>
                        </Tab>

                        {/* TAB 2: STAFF COSTS */}
                        <Tab
                            key="assignments"
                            title={
                                <div className="flex items-center gap-2">
                                    <Users size={16} />
                                    <span>Payouts</span>
                                </div>
                            }
                        >
                            <div className="flex flex-col gap-6 py-6">
                                <Card
                                    className="bg-primary-50/30 border-none shadow-none"
                                    radius="lg"
                                >
                                    <CardBody className="flex-row items-center gap-3 py-3">
                                        <div className="p-2 bg-primary rounded-full">
                                            <ReceiptText
                                                size={16}
                                                className="text-white"
                                            />
                                        </div>
                                        <p className="text-xs font-medium text-primary-700">
                                            Adjust individual payouts for
                                            current team members below.
                                        </p>
                                    </CardBody>
                                </Card>

                                <div className="flex flex-col gap-3 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                                    {assignedMembers.map((member) => (
                                        <div
                                            key={member.userId}
                                            className="flex items-center justify-between p-4 bg-default-50 rounded-2xl border border-transparent hover:border-primary-200 hover:bg-white dark:hover:bg-zinc-900 transition-all"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Avatar
                                                    src={member.avatar}
                                                    className="w-10 h-10 shadow-sm"
                                                />
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold">
                                                        {member.displayName}
                                                    </span>
                                                    <span className="text-[10px] uppercase text-default-400 font-bold">
                                                        Partner
                                                    </span>
                                                </div>
                                            </div>
                                            <Input
                                                type="number"
                                                variant="flat"
                                                size="sm"
                                                className="w-44"
                                                value={member.staffCost.toString()}
                                                onValueChange={(val) => {
                                                    const num =
                                                        parseFloat(val) || 0
                                                    setAssignedMembers((prev) =>
                                                        prev.map((m) =>
                                                            m.userId ===
                                                            member.userId
                                                                ? {
                                                                      ...m,
                                                                      staffCost:
                                                                          num,
                                                                  }
                                                                : m
                                                        )
                                                    )
                                                }}
                                                endContent={
                                                    <span className="text-[10px] font-bold text-default-400">
                                                        VND
                                                    </span>
                                                }
                                                classNames={{
                                                    input: 'text-right font-bold',
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-end">
                                    <Button
                                        color="primary"
                                        className="font-bold px-8 shadow-lg shadow-primary/30"
                                        startContent={
                                            <CheckCircle2 size={18} />
                                        }
                                        onPress={() =>
                                            toast.success(
                                                'Member payout costs adjusted'
                                            )
                                        }
                                    >
                                        Update Payouts
                                    </Button>
                                </div>
                            </div>
                        </Tab>
                    </Tabs>
                </ModalBody>

                <ModalFooter className="flex-col items-stretch gap-6 py-6 px-8">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-default-100/50 p-4 rounded-3xl flex flex-col gap-1 border border-divider">
                            <div className="flex items-center gap-2 text-default-500 mb-1">
                                <Scale size={14} />
                                <span className="text-[10px] uppercase font-black tracking-wider">
                                    Gross Profit
                                </span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-black text-foreground">
                                    {profit.toLocaleString()}
                                </span>
                                <span className="text-xs font-bold text-success-500">
                                    ({profitMargin}%)
                                </span>
                            </div>
                        </div>

                        <div className="bg-primary/5 p-4 rounded-3xl flex flex-col gap-1 border border-primary/10">
                            <div className="flex items-center gap-2 text-primary-500 mb-1">
                                <Wallet size={14} />
                                <span className="text-[10px] uppercase font-black tracking-wider">
                                    Total Expenses
                                </span>
                            </div>
                            <span className="text-2xl font-black text-primary">
                                {totalStaffCost.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center">
                        <p className="text-tiny text-default-400 max-w-[240px]">
                            * All changes are logged for auditing purposes and
                            will impact the monthly balance sheet.
                        </p>
                        <Button
                            variant="light"
                            className="font-bold text-default-500 hover:text-foreground"
                            onPress={onClose}
                        >
                            Exit Workbench
                        </Button>
                    </div>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
