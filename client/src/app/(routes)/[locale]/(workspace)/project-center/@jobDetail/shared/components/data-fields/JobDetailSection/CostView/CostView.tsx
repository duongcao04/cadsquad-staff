import { useProfile } from '@/lib/queries'
import { IncomeView } from './IncomeView'
import { PaymentChannelView } from './PaymentChannelView'
import { StaffCostView } from './StaffCostView'
import { TJob } from '../../../../../../../../../../../shared/types'

type Props = {
    isLoading?: boolean
    data: TJob
}
export function CostView({ isLoading = false, data }: Props) {
    const { isAdmin } = useProfile()

    return (
        <div
            className="border-1 border-text-muted grid grid-cols-3 gap-3 px-4 py-3 rounded-lg divide-x-1 divide-text-muted"
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
