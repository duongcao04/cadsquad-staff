import React from 'react'

import {
    ApartmentOutlined,
    MailOutlined,
    MessageOutlined,
    MobileOutlined,
    UserOutlined,
} from '@ant-design/icons'
import { Avatar } from 'antd'

import { useAuthStore } from '@/lib/zustand/useAuthStore'

export default function ProfileOverview() {
    const userProfile = useAuthStore((state) => state.authUser)

    return (
        <>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 16,
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                    }}
                >
                    <MailOutlined style={{ color: '#666', fontSize: 16 }} />
                    <div>
                        <p
                            style={{
                                margin: 0,
                                fontSize: 12,
                                color: '#666',
                            }}
                        >
                            Email
                        </p>
                        <p
                            style={{
                                margin: 0,
                                fontSize: 14,
                                color: '#1890ff',
                            }}
                        >
                            {userProfile?.email}
                        </p>
                    </div>
                </div>

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                    }}
                >
                    <MessageOutlined style={{ color: '#666', fontSize: 16 }} />
                    <div>
                        <p
                            style={{
                                margin: 0,
                                fontSize: 12,
                                color: '#666',
                            }}
                        >
                            Chat
                        </p>
                        <p
                            style={{
                                margin: 0,
                                fontSize: 14,
                                color: '#1890ff',
                            }}
                        >
                            {userProfile?.email}
                        </p>
                    </div>
                </div>

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                    }}
                >
                    <UserOutlined style={{ color: '#666', fontSize: 16 }} />
                    <div>
                        <p
                            style={{
                                margin: 0,
                                fontSize: 12,
                                color: '#666',
                            }}
                        >
                            Job title
                        </p>
                        <p style={{ margin: 0, fontSize: 14 }}>
                            {userProfile?.jobTitle}
                        </p>
                    </div>
                </div>

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                    }}
                >
                    <ApartmentOutlined
                        style={{ color: '#666', fontSize: 16 }}
                    />
                    <div>
                        <p
                            style={{
                                margin: 0,
                                fontSize: 12,
                                color: '#666',
                            }}
                        >
                            Department
                        </p>
                        <p style={{ margin: 0, fontSize: 14 }}>
                            {userProfile?.department}
                        </p>
                    </div>
                </div>

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                    }}
                >
                    <MobileOutlined style={{ color: '#666', fontSize: 16 }} />
                    <div>
                        <p
                            style={{
                                margin: 0,
                                fontSize: 12,
                                color: '#666',
                            }}
                        >
                            Mobile
                        </p>
                        <p style={{ margin: 0, fontSize: 14 }}>
                            {userProfile?.phoneNumber}
                        </p>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: 32 }}>
                <h3
                    style={{
                        fontSize: 14,
                        fontWeight: 600,
                        marginBottom: 16,
                    }}
                >
                    Reports to
                </h3>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                    }}
                >
                    <Avatar
                        size={40}
                        style={{
                            backgroundColor: '#f0f0f0',
                            color: '#333',
                        }}
                    >
                        {/* {userProfile?.reportsTo.initials} */}
                    </Avatar>
                    <div>
                        <p
                            style={{
                                margin: 0,
                                fontSize: 14,
                                fontWeight: 500,
                            }}
                        >
                            {/* {userProfile?.reportsTo.name} */}
                        </p>
                        <p
                            style={{
                                margin: 0,
                                fontSize: 12,
                                color: '#666',
                            }}
                        >
                            {/* {userProfile?.reportsTo.title} */}
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}
