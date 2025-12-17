import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts'

const data = [
    { name: 'Aug 01', income: 4000 },
    { name: 'Aug 05', income: 3000 },
    { name: 'Aug 10', income: 2000 },
    { name: 'Aug 15', income: 2780 },
    { name: 'Aug 20', income: 1890 },
    { name: 'Aug 25', income: 2390 },
    { name: 'Aug 30', income: 3490 },
]

export const RevenueChart = () => {
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mb-8">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-800">Financial Overview</h3>
                <button className="text-xs border border-slate-200 rounded-lg px-3 py-1 text-slate-500 hover:bg-slate-50">
                    1 Nov - 7 Nov 2024
                </button>
            </div>

            <div className="h-62.5 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient
                                id="colorIncome"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="#10B981"
                                    stopOpacity={0.1}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#10B981"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            vertical={false}
                            strokeDasharray="3 3"
                            stroke="#F1F5F9"
                        />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94A3B8', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94A3B8', fontSize: 12 }}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: '12px',
                                border: 'none',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="income"
                            stroke="#10B981"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorIncome)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
