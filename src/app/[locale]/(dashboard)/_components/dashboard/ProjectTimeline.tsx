'use client'

import React from 'react'

import { Line } from '@ant-design/plots'

export default function ProjectTimeline() {
    const data = [
        { year: '1991', value: 3 },
        { year: '1992', value: 4 },
        { year: '1993', value: 3.5 },
        { year: '1994', value: 5 },
        { year: '1995', value: 4.9 },
        { year: '1996', value: 6 },
        { year: '1997', value: 7 },
        { year: '1998', value: 9 },
        { year: '1999', value: 13 },
    ]
    const config = {
        data,
        xField: 'year',
        yField: 'value',
        point: {
            shapeField: 'square',
            sizeField: 4,
        },
        interaction: {
            tooltip: {
                marker: false,
            },
        },
        style: {
            lineWidth: 2,
        },
    }
    return (
        <div className="p-2 rounded-3xl border border-gray-100">
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
