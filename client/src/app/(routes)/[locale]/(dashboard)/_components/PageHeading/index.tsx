import React from 'react'
import Timmer from './Timmer'

type Props = {
    title: string
}
export default function PageHeading({ title }: Props) {
    return (
        <div className="w-full pt-2  pb-1 flex items-center justify-between">
            <h1 className="align-middle font-medium text-xl">{title}</h1>
            <Timmer />
        </div>
    )
}
