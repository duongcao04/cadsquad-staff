'use client'

import React from 'react'

import { AntdRegistry } from '@ant-design/nextjs-registry'
import { ConfigProvider } from 'antd'
import { theme } from '@/styles/antd.config'


export default function AntdProvider({ children }: { children: React.ReactNode }) {
	return (
		<AntdRegistry>
			<ConfigProvider theme={theme}>
				{children}
			</ConfigProvider>
		</AntdRegistry>
	)
}