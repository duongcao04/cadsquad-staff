import { Briefcase, AlertCircle, Clock, BanknoteArrowDown } from 'lucide-react'

export const TopStats = ({
    activeJobs,
    overdueJobs,
    pendingReview,
}: {
    activeJobs: number
    overdueJobs: number
    pendingReview: number
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {/* Active Jobs Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-3">
                        <Briefcase className="w-5 h-5" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800">
                        {activeJobs}
                    </h3>
                    <p className="text-sm text-slate-500 font-medium">
                        Active Jobs
                    </p>
                </div>
                <div className="h-full flex flex-col justify-end">
                    <span className="text-xs text-emerald-600 font-bold cursor-pointer hover:underline flex items-center gap-1">
                        View details →
                    </span>
                </div>
            </div>

            {/* Overdue Jobs Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-3">
                        <AlertCircle className="w-5 h-5" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800">
                        {overdueJobs}
                    </h3>
                    <p className="text-sm text-slate-500 font-medium">
                        Overdue / Late
                    </p>
                </div>
                <div className="h-full flex flex-col justify-end">
                    <span className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer hover:underline flex items-center gap-1">
                        View details →
                    </span>
                </div>
            </div>

            {/* Pending Review Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 mb-3">
                        <Clock className="w-5 h-5" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800">
                        {pendingReview}
                    </h3>
                    <p className="text-sm text-slate-500 font-medium">
                        Pending Review
                    </p>
                </div>
                <div className="h-full flex flex-col justify-end">
                    <span className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer hover:underline flex items-center gap-1">
                        View details →
                    </span>
                </div>
            </div>

            {/* Waiting for Payment Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-3">
                        <BanknoteArrowDown className="w-5 h-5" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800">
                        {pendingReview}
                    </h3>
                    <p className="text-sm text-slate-500 font-medium">
                        Waiting for Payment
                    </p>
                </div>
                <div className="h-full flex flex-col justify-end">
                    <span className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer hover:underline flex items-center gap-1">
                        View details →
                    </span>
                </div>
            </div>
        </div>
    )
}
