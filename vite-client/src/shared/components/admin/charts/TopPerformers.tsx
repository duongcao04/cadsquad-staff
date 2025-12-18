import React from 'react'
import { MoreVertical } from 'lucide-react'

const performers = [
    {
        id: 1,
        name: 'Rainer Brown',
        email: 'rainer@company.com',
        avatar: 'https://i.pravatar.cc/150?u=1',
    },
    {
        id: 2,
        name: 'Conny Rany',
        email: 'conny@company.com',
        avatar: 'https://i.pravatar.cc/150?u=2',
    },
    {
        id: 3,
        name: 'Armin Falcon',
        email: 'armin@company.com',
        avatar: 'https://i.pravatar.cc/150?u=3',
    },
    {
        id: 4,
        name: 'Alex Sullivan',
        email: 'alex@company.com',
        avatar: 'https://i.pravatar.cc/150?u=4',
    },
]

export const TopPerformers = () => {
    return (
        <div className="bg-white p-6 rounded-2xl border border-border-default shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-800">Top Performers</h3>
                <div className="flex bg-slate-100 rounded-lg p-1">
                    <button className="px-3 py-1 text-xs font-medium rounded-md bg-white shadow-sm text-slate-800">
                        7d
                    </button>
                    <button className="px-3 py-1 text-xs font-medium rounded-md text-slate-500 hover:text-slate-800">
                        1m
                    </button>
                    <button className="px-3 py-1 text-xs font-medium rounded-md text-slate-500 hover:text-slate-800">
                        1y
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {performers.map((user) => (
                    <div
                        key={user.id}
                        className="flex items-center p-3 rounded-xl border border-slate-50 hover:border-emerald-100 hover:bg-emerald-50/30 transition-all group"
                    >
                        <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover mr-3"
                        />
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-slate-800 truncate">
                                {user.name}
                            </h4>
                            <p className="text-xs text-slate-400 truncate group-hover:text-emerald-600">
                                {user.email}
                            </p>
                        </div>
                        <button className="text-slate-300 hover:text-slate-600">
                            <MoreVertical className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}
