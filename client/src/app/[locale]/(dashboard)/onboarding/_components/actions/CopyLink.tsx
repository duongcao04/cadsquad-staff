'use client'

import { addToast, Button } from '@heroui/react'
import { Tooltip } from 'antd'
import { Link } from 'lucide-react'
import React from 'react'

type Props = {
	value: string
}

export default function CopyLink({ value }: Props) {
	const handleCopy = () => {
		navigator.clipboard
			.writeText(value)
			.then(() => {
				addToast({
					title: 'Copy address successful',
					color: 'success',
				})
			})
			.catch((err) => {
				console.log(err)
				addToast({
					title: 'Copy address fail',
					color: 'danger',
				})
			})
	}
	return (
		<Button size='sm' isIconOnly variant='light' onPress={() => handleCopy()}>
			<Tooltip placement="top" title="Copy link">
				<Link
					size={14}
					strokeWidth={2}
					className="hidden transition duration-150 text-blue-500 group-hover:block"
				/>
			</Tooltip>
		</Button>
	)
}