import React from 'react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'

export const DashboardRightPanel = () => {
    const scheduleItems = [
        {
            id: 1,
            title: 'Meeting with Herry',
            time: '12:00 - 01:00 PM',
            avatars: 3,
            color: 'border-l-teal-500',
        },
        {
            id: 2,
            title: 'Meeting with Salah',
            time: '10:00 - 11:30 AM',
            avatars: 2,
            color: 'border-l-blue-500',
        },
        {
            id: 3,
            title: 'Meeting with Mbappe',
            time: '02:00 - 03:00 PM',
            avatars: 4,
            color: 'border-l-orange-500',
        },
    ]

    return (
        <div className="w-80 bg-white p-6 hidden xl:block">
            {/* Mini Calendar Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-800">January 2024</h3>
                <div className="flex gap-1">
                    <button className="p-1 rounded hover:bg-slate-100 text-slate-400">
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button className="p-1 rounded hover:bg-slate-100 text-slate-400">
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Calendar Grid (Simplified Visual) */}
            <div className="grid grid-cols-7 gap-2 mb-8 text-center text-sm">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                    <span
                        key={i}
                        className="text-slate-400 text-xs font-medium"
                    >
                        {d}
                    </span>
                ))}
                {Array.from({ length: 7 }).map((_, i) => (
                    <span
                        key={i}
                        className={`p-2 rounded-full text-xs cursor-pointer ${i === 4 ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        {15 + i}
                    </span>
                ))}
            </div>

            {/* Today Schedule */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                        Today
                    </h4>
                </div>

                <div className="space-y-4">
                    {scheduleItems.map((item) => (
                        <div
                            key={item.id}
                            className={`bg-slate-50 p-4 rounded-xl border-l-4 ${item.color} relative group hover:bg-white hover:shadow-md transition-all`}
                        >
                            <h5 className="font-bold text-slate-800 text-sm mb-1">
                                {item.title}
                            </h5>
                            <p className="text-xs text-slate-500 mb-3">
                                {item.time}
                            </p>

                            <div className="flex -space-x-2">
                                {[1, 2, 3].map((i) => (
                                    <img
                                        key={i}
                                        src={`https://i.pravatar.cc/150?u=${i * 10}`}
                                        className="w-6 h-6 rounded-full border-2 border-white"
                                    />
                                ))}
                                <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[9px] font-bold text-slate-500">
                                    +{item.avatars}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Card: Job Applications */}
            <div className="bg-orange-50 p-5 rounded-2xl">
                <p className="text-orange-800 text-xs font-bold uppercase mb-2">
                    Job Applications
                </p>
                <h3 className="text-xl font-bold text-slate-800 mb-1">
                    Job Applications
                </h3>
                <p className="text-slate-500 text-xs mb-4">
                    246 Interviews • 101 Hired
                </p>
                <div className="h-16 bg-gradient-to-r from-orange-200 to-orange-100 rounded-xl opacity-50"></div>
            </div>
        </div>
    )
}
