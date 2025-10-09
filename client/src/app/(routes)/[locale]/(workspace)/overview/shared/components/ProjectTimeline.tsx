'use client'

import { Line } from '@ant-design/plots'

export default function ProjectTimeline() {
    const data = [
        { year: '2020', value: 6, category: 'Total projects' },
        { year: '2020', value: 2, category: 'Completed projects' },

        { year: '2021', value: 9, category: 'Total projects' },
        { year: '2021', value: 5, category: 'Completed projects' },

        { year: '2022', value: 7, category: 'Total projects' }, // giảm
        { year: '2022', value: 4, category: 'Completed projects' },

        { year: '2023', value: 11, category: 'Total projects' }, // tăng
        { year: '2023', value: 8, category: 'Completed projects' },

        { year: '2024', value: 10, category: 'Total projects' }, // giảm nhẹ
        { year: '2024', value: 6, category: 'Completed projects' },

        { year: '2025', value: 13, category: 'Total projects' }, // tăng mạnh
        { year: '2025', value: 10, category: 'Completed projects' },
    ]

    const config = {
        data,
        xField: 'year',
        yField: 'value',
        seriesField: 'category',
        smooth: true,
        point: {
            size: 5,
            shape: 'circle',
        },
        colorField: 'category',
        legend: { position: 'top' },
    }
    return (
        <div
            className="p-2 rounded-2xl border border-gray-100"
            style={{
                boxShadow:
                    'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px',
            }}
        >
            <div className="pl-3 pr-5 py-3 w-full flex items-center justify-between">
                <h3 className="font-semibold text-lg text-secondary">
                    Project Timeline
                </h3>
            </div>
            <div>
                <Line {...config} />
            </div>
        </div>
    )
}
