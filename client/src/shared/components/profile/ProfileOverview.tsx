import { Link } from '@/i18n/navigation'
import { User } from '@/shared/interfaces'
import {
    ApartmentOutlined,
    MailOutlined,
    MessageOutlined,
    MobileOutlined,
    UserOutlined,
} from '@ant-design/icons'

type Props = {
    data?: User
}

export function ProfileOverview({ data }: Props) {
    return (
        <div className="mt-2">
            <div className="space-y-4">
                <div className="flex items-center justify-start gap-3">
                    <MailOutlined size={16} className="!text-text-muted" />
                    <div>
                        <p className="text-xs text-text-muted">Email</p>
                        <Link
                            href={`mailto:${data?.email}`}
                            className="text-sm link !text-blue-500"
                            target="_blank"
                        >
                            {data?.email}
                        </Link>
                    </div>
                </div>

                <div className="flex items-center justify-start gap-3">
                    <MessageOutlined size={16} className="!text-text-muted" />
                    <div>
                        <p className="text-xs text-text-muted">Chat</p>
                        <Link
                            href={`mailto:${data?.email}`}
                            className="text-sm link !text-blue-500"
                            target="_blank"
                        >
                            {data?.email}
                        </Link>
                    </div>
                </div>

                <div className="flex items-center justify-start gap-3">
                    <ApartmentOutlined size={16} className="!text-text-muted" />
                    <div>
                        <p className="text-xs text-text-muted">Department</p>

                        <p className="text-sm mt-0.5">
                            {data?.department ? (
                                <span>{data?.department?.displayName}</span>
                            ) : (
                                <span>-</span>
                            )}
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-start gap-3">
                    <UserOutlined size={16} className="!text-text-muted" />
                    <div>
                        <p className="text-xs text-text-muted">Job title</p>

                        <p className="text-sm mt-0.5">
                            {data?.jobTitle ? (
                                <span>{data?.jobTitle?.displayName}</span>
                            ) : (
                                <span>-</span>
                            )}
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-start gap-3">
                    <MobileOutlined size={16} className="!text-text-muted" />
                    <div>
                        <p className="text-xs text-text-muted">Mobile</p>
                        {data?.phoneNumber ? (
                            <Link
                                href={`tel:${data?.phoneNumber}`}
                                className="text-sm link !text-blue-500"
                                target="_blank"
                            >
                                {data?.phoneNumber}
                            </Link>
                        ) : (
                            <p className="text-sm mt-0.5">-</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
