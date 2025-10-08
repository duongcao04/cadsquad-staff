import { Job } from '@/shared/interfaces/job.interface'
import { useProfile } from '@/shared/queries/useAuth'
import IncomeView from './IncomeView'
import PaymentChannelView from './PaymentChannelView'
import StaffCostView from './StaffCostView'

type Props = {
    isLoading?: boolean
    data?: Job
}
export default function CostView({ isLoading = false, data }: Props) {
    const { isAdmin } = useProfile()

    return (
        <div
            className="border-1 border-text3 grid grid-cols-3 gap-3 px-4 py-3 rounded-lg divide-x-1 divide-text3"
            style={{
                width: isAdmin ? '100%' : 'fit-content',
            }}
        >
            {isAdmin && <IncomeView data={data} isLoading={isLoading} />}
            <StaffCostView data={data} isLoading={isLoading} />
            {isAdmin && <PaymentChannelView data={data} />}
        </div>
    )
}
