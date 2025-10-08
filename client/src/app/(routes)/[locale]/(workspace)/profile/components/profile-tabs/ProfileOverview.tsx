import {
    ApartmentOutlined,
    MailOutlined,
    MessageOutlined,
    MobileOutlined,
    UserOutlined,
} from '@ant-design/icons'
import { User } from '@/shared/interfaces/user.interface'
import { Link } from '@/i18n/navigation'

type Props = {
    data?: User
}

export default function ProfileOverview({ data }: Props) {
    return (
        <div className="mt-2">
            <div className="space-y-4">
                <div className="flex items-center justify-start gap-3">
                    <MailOutlined size={16} className="!text-text2" />
                    <div>
                        <p className="text-xs text-text2">Email</p>
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
                    <MessageOutlined size={16} className="!text-text2" />
                    <div>
                        <p className="text-xs text-text2">Chat</p>
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
                    <ApartmentOutlined size={16} className="!text-text2" />
                    <div>
                        <p className="text-xs text-text2">Department</p>

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
                    <UserOutlined size={16} className="!text-text2" />
                    <div>
                        <p className="text-xs text-text2">Job title</p>

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
                    <MobileOutlined size={16} className="!text-text2" />
                    <div>
                        <p className="text-xs text-text2">Mobile</p>
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
