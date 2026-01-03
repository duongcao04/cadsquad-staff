import {
    ApiResponse,
    dateFormatter,
    editUserSchema,
    getPageTitle,
    INTERNAL_URLS,
    optimizeCloudinary,
    RoleIcons,
    ROLES_LIST,
    TEditUser,
    toFormikValidate,
    useUpdateAvatarMutation,
    useUpdateUserMutation,
    useUploadImageMutation,
} from '@/lib'
import { departmentsListOptions } from '@/lib/queries/options/department-queries'
import { jobTitlesListOptions } from '@/lib/queries/options/job-title-queries'
import { userOptions } from '@/lib/queries/options/user-queries'
import {
    HeroBreadcrumbItem,
    HeroBreadcrumbs,
    HeroButton,
    HeroTooltip,
} from '@/shared/components'
import AdminContentContainer from '@/shared/components/admin/AdminContentContainer'
import { DeleteUserPermanentlyModal } from '@/shared/components/modals/DeleteUserPermanentlyModal'
import ResetPasswordModal from '@/shared/components/modals/ResetPasswordModal'
import { UploadAvatarModal } from '@/shared/components/modals/UploadAvatarModal'
import HeroCopyButton from '@/shared/components/ui/hero-copy-button'
import { TUser } from '@/shared/types'
import {
    addToast,
    Avatar,
    Button,
    Card,
    CardBody,
    CardHeader,
    Chip,
    Divider,
    Input,
    Select,
    SelectItem,
    Spinner,
    Switch,
    Tab,
    Tabs,
    useDisclosure,
} from '@heroui/react'
import { useSuspenseQueries, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useFormik } from 'formik'
import {
    AlertCircle,
    ArrowLeft,
    AtSignIcon,
    Briefcase,
    Building,
    Calendar,
    Info,
    InfoIcon,
    KeyRound,
    Mail,
    Phone,
    Save,
    Shield,
    ShieldAlertIcon,
    Trash2,
    Upload,
    User,
} from 'lucide-react'
import { useState } from 'react'
import { useToggleUserStatusMutation } from '../../../../../../lib/queries/useUser'
import { ChangeUserStatusModal } from '../../../../../../shared/components/modals/ChangeUserStatusModal'

export const Route = createFileRoute(
    '/_administrator/admin/mgmt/staff-directory/$username/edit'
)({
    head: (ctx) => {
        const loader = ctx.loaderData as unknown as ApiResponse<TUser>
        return {
            meta: [
                {
                    title: getPageTitle(
                        loader?.result?.displayName ?? 'User management'
                    ),
                },
            ],
        }
    },
    loader: ({ context, params }) => {
        const { username } = params
        return context.queryClient.ensureQueryData(userOptions(username))
    },
    component: EditStaffPage,
})

function EditStaffPage() {
    const { username } = Route.useParams()

    const toggleUserStatusMutation = useToggleUserStatusMutation()

    const uploadImageMutation = useUploadImageMutation()
    const updateAvatarMutation = useUpdateAvatarMutation()
    // 1. Fetch Data
    const options = userOptions(username)
    const { data: user } = useSuspenseQuery(options)

    const [activeTab, setActiveTab] = useState('profile')
    const [toggleUserActive, setToggleUserActive] = useState<
        'active' | 'deActive'
    >(user.isActive ? 'deActive' : 'active')

    const {
        isOpen: isOpenResetPasswordModal,
        onOpen: onOpenResetPasswordModal,
        onClose: onCloseResetPasswordModal,
    } = useDisclosure({
        id: 'ResetPasswordModal',
    })
    const {
        isOpen: isOpenUploadAvatarModal,
        onOpen: onOpenUploadAvatarModal,
        onClose: onCloseUploadAvatarModal,
    } = useDisclosure({
        id: 'UploadAvatarModal',
    })
    const {
        isOpen: isOpenDeleteUserPermanentlyModal,
        onOpen: onOpenDeleteUserPermanentlyModal,
        onClose: onCloseDeleteUserPermanentlyModal,
    } = useDisclosure({
        id: 'DeleteUserPermanentlyModal',
    })
    const changeUserStatusModal = useDisclosure({
        id: 'ChangeUserStatusModal',
    })

    const handleOpenChangeUserModal = (value: boolean) => {
        setToggleUserActive(value ? 'active' : 'deActive')
        changeUserStatusModal.onOpen()
    }

    const handleAvatarSave = async (imageFile: File) => {
        try {
            // Step 1: Upload the file to get the URL
            console.log('Uploading image...')
            const newAvatarUrl =
                await uploadImageMutation.mutateAsync(imageFile)

            if (!newAvatarUrl) throw new Error('Failed to get image URL')

            // Step 2: Update the user record with this URL
            console.log('Updating user profile...', newAvatarUrl)
            await updateAvatarMutation.mutateAsync({
                username: user.username,
                avatarUrl: newAvatarUrl,
            })
        } catch (error) {
            console.error(error)
            addToast({
                title: 'Failed to update avatar',
                color: 'danger',
            })
        }
    }

    return (
        <>
            {changeUserStatusModal.isOpen && (
                <ChangeUserStatusModal
                    isOpen={changeUserStatusModal.isOpen}
                    onClose={changeUserStatusModal.onClose}
                    user={user}
                    action={toggleUserActive}
                    onConfirm={async (userId) => {
                        toggleUserStatusMutation.mutateAsync({ userId })
                    }}
                />
            )}
            {isOpenResetPasswordModal && user && (
                <ResetPasswordModal
                    isOpen={isOpenResetPasswordModal}
                    onClose={onCloseResetPasswordModal}
                    data={user}
                />
            )}
            {isOpenDeleteUserPermanentlyModal && (
                <DeleteUserPermanentlyModal
                    isOpen={isOpenDeleteUserPermanentlyModal}
                    onClose={onCloseDeleteUserPermanentlyModal}
                    user={user}
                    onConfirm={() => {}}
                />
            )}
            {isOpenUploadAvatarModal && (
                <UploadAvatarModal
                    isOpen={isOpenUploadAvatarModal}
                    onClose={onCloseUploadAvatarModal}
                    onSave={handleAvatarSave}
                    currentAvatarUrl={optimizeCloudinary(user.avatar, {
                        width: 256,
                        height: 256,
                    })}
                />
            )}
            <HeroBreadcrumbs className="pt-3 px-7 text-xs">
                <HeroBreadcrumbItem>Management</HeroBreadcrumbItem>
                <HeroBreadcrumbItem>
                    <Link
                        to={INTERNAL_URLS.staffDirectory}
                        className="text-text-subdued!"
                    >
                        Staff Directory
                    </Link>
                </HeroBreadcrumbItem>
                <HeroBreadcrumbItem>
                    <span className="font-medium">@{user?.username}</span>
                </HeroBreadcrumbItem>
            </HeroBreadcrumbs>

            <AdminContentContainer className="mt-1">
                {/* --- Header --- */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <Link to={INTERNAL_URLS.staffDirectory}>
                            <HeroButton
                                isIconOnly
                                variant="light"
                                size="sm"
                                color="default"
                            >
                                <ArrowLeft size={16} />
                            </HeroButton>
                        </Link>
                        <div className="flex items-center justify-start gap-2">
                            <p className="font-medium text-sm">
                                Edit member details
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            color="danger"
                            variant="light"
                            onPress={onOpenResetPasswordModal}
                        >
                            Reset Password
                        </Button>
                        <HeroButton
                            color="primary"
                            size="sm"
                            startContent={<Save size={18} />}
                        >
                            Save Changes
                        </HeroButton>
                    </div>
                </div>

                <div className="mt-3 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* --- LEFT COLUMN: Profile Card (Static/Visual) --- */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="shadow-sm border border-slate-200">
                            <CardBody className="flex flex-col items-center p-8 text-center">
                                <div className="relative mb-4 group">
                                    <Avatar
                                        src={optimizeCloudinary(user.avatar, {
                                            width: 512,
                                            height: 512,
                                        })}
                                        className="w-32 h-32 text-large border-4 border-slate-50 shadow-md"
                                    />
                                    {/* Upload Logic would go here */}
                                    <div
                                        className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                        onClick={onOpenUploadAvatarModal}
                                    >
                                        <Upload
                                            className="text-white"
                                            size={24}
                                        />
                                    </div>
                                </div>

                                <h2 className="text-xl font-bold text-slate-900">
                                    {user.displayName}
                                </h2>
                                <p className="text-sm text-slate-500 mb-4">
                                    @{user.username}
                                </p>

                                <Chip
                                    color={
                                        user.isActive ? 'success' : 'default'
                                    }
                                    variant="flat"
                                    className="mb-6"
                                >
                                    {user.isActive
                                        ? 'Active Account'
                                        : 'Inactive'}
                                </Chip>

                                <div className="w-full space-y-4 text-left">
                                    <Divider />
                                    <div className="flex justify-between text-sm">
                                        <span className="text-text-subdued flex items-center gap-2">
                                            <Calendar size={14} /> Joined
                                        </span>
                                        <span className="font-semibold text-text-default">
                                            {dateFormatter(user.createdAt, {
                                                format: 'longDate',
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-text-subdued flex items-center gap-2">
                                            <Shield size={14} /> Role
                                        </span>
                                        <span className="font-semibold text-text-default">
                                            {user.role}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-text-subdued flex items-center gap-2">
                                            <Briefcase size={14} /> ID
                                        </span>
                                        <div className="flex items-center justify-end gap-1">
                                            <HeroCopyButton
                                                textValue={user.id}
                                            />
                                            <span className="text-xs bg-background-hovered px-2 py-1 rounded">
                                                {user.id}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Account Actions / Danger Zone */}
                        <Card className="shadow-none border border-red-200 bg-red-50/50 dark:bg-red-50/70">
                            <CardHeader className="px-6 pt-6 pb-0">
                                <h4 className="font-bold text-red-900 text-sm flex items-center gap-2">
                                    <AlertCircle size={16} /> Danger Zone
                                </h4>
                            </CardHeader>
                            <CardBody className="p-6">
                                <p className="text-xs text-red-700 mb-4">
                                    Deactivating this user will revoke all
                                    access to the dashboard immediately.
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold text-sm text-slate-700">
                                        Account Status
                                    </span>
                                    {toggleUserStatusMutation.isPending ? (
                                        <Spinner />
                                    ) : (
                                        <Switch
                                            color="success"
                                            isSelected={user.isActive}
                                            onValueChange={
                                                handleOpenChangeUserModal
                                            }
                                        />
                                    )}
                                </div>
                                <Button
                                    className="w-full mt-4 bg-white border border-red-200 text-red-600 hover:bg-red-50"
                                    variant="flat"
                                    startContent={<Trash2 size={16} />}
                                    onPress={onOpenDeleteUserPermanentlyModal}
                                >
                                    Delete User Permanently
                                </Button>
                            </CardBody>
                        </Card>
                    </div>

                    {/* --- RIGHT COLUMN: Edit Form with Formik --- */}
                    <div className="lg:col-span-2">
                        <Card className="shadow-sm border border-slate-200 min-h-150">
                            <CardHeader className="p-0 border-b border-border-default">
                                <Tabs
                                    aria-label="User Edit Tabs"
                                    variant="underlined"
                                    color="primary"
                                    classNames={{
                                        tabList: 'p-4 gap-6',
                                        cursor: 'w-full bg-primary',
                                        tab: 'max-w-fit px-0 h-10',
                                        tabContent:
                                            'group-data-[selected=true]:text-primary font-semibold text-slate-500',
                                    }}
                                    selectedKey={activeTab}
                                    onSelectionChange={(k) =>
                                        setActiveTab(k as string)
                                    }
                                >
                                    <Tab
                                        key="profile"
                                        title={
                                            <div className="flex items-center gap-2">
                                                <User size={16} /> Personal Info
                                            </div>
                                        }
                                    />
                                    <Tab
                                        key="organization"
                                        title={
                                            <div className="flex items-center gap-2">
                                                <Briefcase size={16} />{' '}
                                                Organization
                                            </div>
                                        }
                                    />
                                    <Tab
                                        key="security"
                                        title={
                                            <div className="flex items-center gap-2">
                                                <KeyRound size={16} /> Security
                                            </div>
                                        }
                                    />
                                </Tabs>
                            </CardHeader>

                            <CardBody className="p-6">
                                {/* TAB: PERSONAL INFO */}
                                {activeTab === 'profile' && (
                                    <EditProfileTab user={user} />
                                )}

                                {/* TAB: ORGANIZATION */}
                                {activeTab === 'organization' && (
                                    <OrganizationDepartment user={user} />
                                )}

                                {/* TAB: SECURITY */}
                                {activeTab === 'security' && (
                                    <div className="space-y-6 animate-in fade-in">
                                        <div>
                                            <h3 className="font-bold text-slate-800 text-sm mb-4">
                                                Password Management
                                            </h3>
                                            <div className="flex justify-between items-center p-4 border border-slate-200 rounded-xl">
                                                <div>
                                                    <p className="font-semibold text-slate-700">
                                                        Send Password Reset
                                                        Email
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        User will receive a link
                                                        to set a new password.
                                                    </p>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="flat"
                                                    color="primary"
                                                >
                                                    Send Link
                                                </Button>
                                            </div>
                                        </div>

                                        <Divider />

                                        <div>
                                            <h3 className="font-bold text-slate-800 text-sm mb-4">
                                                Session Control
                                            </h3>
                                            <div className="flex justify-between items-center p-4 border border-slate-200 rounded-xl bg-slate-50">
                                                <div>
                                                    <p className="font-semibold text-slate-700">
                                                        Force Logout
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        Sign out this user from
                                                        all active devices
                                                        immediately.
                                                    </p>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="bordered"
                                                    color="danger"
                                                >
                                                    Log Out All
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </AdminContentContainer>
        </>
    )
}

function EditProfileTab({ user }: { user: TUser }) {
    const updateUserMutation = useUpdateUserMutation()
    // 2. Initialize Formik
    const formik = useFormik<TEditUser>({
        initialValues: {
            displayName: user.displayName,
            username: user.username,
            email: user.email,
            phoneNumber: user.phoneNumber || '',
        },
        enableReinitialize: true,
        validate: toFormikValidate(editUserSchema),
        onSubmit: async (values) => {
            console.log('Submitting validated data:', values)
            try {
                // Call your mutation here
                await updateUserMutation.mutateAsync({
                    // Adjust according to what your mutation expects (e.g., username + body)
                    username: user.username,
                    data: values,
                })
            } catch (error) {
                console.error('Failed to update user', error)
            }
        },
    })
    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    label="Full Name"
                    labelPlacement="outside"
                    placeholder="e.g. Sarah Wilson"
                    variant="bordered"
                    name="displayName"
                    description="This name will be visible to your teammates across the platform."
                    value={formik.values.displayName}
                    onValueChange={(v) =>
                        formik.setFieldValue('displayName', v)
                    }
                    isInvalid={
                        !!formik.errors.displayName &&
                        formik.touched.displayName
                    }
                    errorMessage={
                        formik.touched.displayName && formik.errors.displayName
                    }
                    onBlur={formik.handleBlur}
                />
                <Input
                    label="Username"
                    labelPlacement="outside"
                    placeholder="e.g. sarah_w"
                    variant="bordered"
                    name="username"
                    description="Your unique handle. Only letters, numbers, and underscores allowed."
                    startContent={
                        <AtSignIcon size={14} className="text-text-subdued" />
                    }
                    value={formik.values.username}
                    onValueChange={(v) => formik.setFieldValue('username', v)}
                    isInvalid={
                        !!formik.errors.username && formik.touched.username
                    }
                    errorMessage={
                        formik.touched.username && formik.errors.username
                    }
                    onBlur={formik.handleBlur}
                />
                <Input
                    label="Email Address"
                    labelPlacement="outside"
                    placeholder="sarah@company.com"
                    description="Used for system notifications and secure account login."
                    variant="bordered"
                    startContent={
                        <Mail className="text-text-subdued" size={16} />
                    }
                    name="email"
                    value={formik.values.email}
                    onValueChange={(v) => formik.setFieldValue('email', v)}
                    isInvalid={!!formik.errors.email && formik.touched.email}
                    errorMessage={formik.touched.email && formik.errors.email}
                    onBlur={formik.handleBlur}
                />
                <Input
                    label="Phone Number"
                    labelPlacement="outside"
                    placeholder="+84..."
                    variant="bordered"
                    description="Used for direct project coordination via WhatsApp/Phone."
                    startContent={
                        <Phone className="text-text-subdued" size={16} />
                    }
                    name="phoneNumber"
                    value={formik.values.phoneNumber}
                    onValueChange={(v) =>
                        formik.setFieldValue('phoneNumber', v)
                    }
                    isInvalid={
                        !!formik.errors.phoneNumber &&
                        formik.touched.phoneNumber
                    }
                    errorMessage={
                        formik.touched.phoneNumber && formik.errors.phoneNumber
                    }
                    onBlur={formik.handleBlur}
                />
            </div>
            <div className="flex items-center justify-end">
                <HeroButton
                    color="primary"
                    size="sm"
                    startContent={!formik.isSubmitting && <Save size={18} />}
                    isLoading={formik.isSubmitting}
                    onPress={() => formik.handleSubmit()}
                >
                    Save Changes
                </HeroButton>
            </div>
        </div>
    )
}

function OrganizationDepartment({ user }: { user: TUser }) {
    const updateUserMutation = useUpdateUserMutation()
    const [
        {
            data: { departments },
        },
        {
            data: { jobTitles },
        },
    ] = useSuspenseQueries({
        queries: [
            {
                ...departmentsListOptions(),
            },
            {
                ...jobTitlesListOptions(),
            },
        ],
    })

    const formik = useFormik({
        initialValues: {
            departmentId: user.department?.id,
            jobTitleId: user.jobTitle?.id,
            role: user.role,
        },
        enableReinitialize: true,
        onSubmit: async (values) => {
            console.log('Submitting validated data:', values)
            try {
                // Call your mutation here
                await updateUserMutation.mutateAsync({
                    // Adjust according to what your mutation expects (e.g., username + body)
                    username: user.username,
                    data: values,
                })
            } catch (error) {
                console.error('Failed to update user', error)
            }
        },
    })
    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6">
                <h4 className="text-sm font-bold text-blue-900 mb-1">
                    Permissions & Access
                </h4>
                <p className="text-xs text-blue-700">
                    Changing the Department or Role will immediately affect what
                    this user can see.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* --- Department Select --- */}
                <div className="space-y-1">
                    <div className="flex items-center gap-1">
                        <span className="text-small font-medium">
                            Department
                        </span>
                        <HeroTooltip content="Determines which departmental community hubs the user can join.">
                            <InfoIcon
                                size={14}
                                className="text-text-subdued cursor-help"
                            />
                        </HeroTooltip>
                    </div>
                    <Select
                        labelPlacement="outside"
                        placeholder="Select department"
                        variant="bordered"
                        description="Linked to departmental social hubs and reports."
                        selectedKeys={
                            formik.values.departmentId
                                ? [formik.values.departmentId]
                                : []
                        }
                        disallowEmptySelection
                        onSelectionChange={(keys) =>
                            formik.setFieldValue(
                                'departmentId',
                                Array.from(keys)[0]
                            )
                        }
                        startContent={
                            <Building className="text-text-subdued" size={16} />
                        }
                        isInvalid={
                            !!formik.errors.departmentId &&
                            formik.touched.departmentId
                        }
                        errorMessage={formik.errors.departmentId}
                    >
                        {departments?.map((d) => (
                            <SelectItem key={d.id} textValue={d.displayName}>
                                {d.displayName}
                            </SelectItem>
                        )) || []}
                    </Select>
                </div>

                {/* --- Job Title Select --- */}
                <div className="space-y-1">
                    <div className="flex items-center gap-1">
                        <span className="text-small font-medium">
                            Job Title
                        </span>
                        <HeroTooltip content="Formal title used in the company directory and project signatures.">
                            <Info
                                size={14}
                                className="text-text-subdued cursor-help"
                            />
                        </HeroTooltip>
                    </div>
                    <Select
                        labelPlacement="outside"
                        placeholder="Select title"
                        variant="bordered"
                        description="Defines the user's professional role in the workspace."
                        selectedKeys={
                            formik.values.jobTitleId
                                ? [formik.values.jobTitleId]
                                : []
                        }
                        disallowEmptySelection
                        onSelectionChange={(keys) =>
                            formik.setFieldValue(
                                'jobTitleId',
                                Array.from(keys)[0]
                            )
                        }
                        startContent={
                            <Briefcase
                                className="text-text-subdued"
                                size={16}
                            />
                        }
                        isInvalid={
                            !!formik.errors.jobTitleId &&
                            formik.touched.jobTitleId
                        }
                        errorMessage={formik.errors.jobTitleId}
                    >
                        {jobTitles?.map((j) => (
                            <SelectItem key={j.id} textValue={j.displayName}>
                                {j.displayName}
                            </SelectItem>
                        )) || []}
                    </Select>
                </div>

                {/* --- System Role Select --- */}
                <div className="md:col-span-2 space-y-1">
                    <div className="flex items-center gap-1">
                        <span className="text-small font-medium text-danger-600">
                            Security: System Role
                        </span>
                        <HeroTooltip
                            color="danger"
                            content="Warning: Escalating a role grants access to restricted billing and user data."
                        >
                            <ShieldAlertIcon
                                size={14}
                                className="text-danger cursor-help"
                            />
                        </HeroTooltip>
                    </div>
                    <Select
                        labelPlacement="outside"
                        variant="bordered"
                        selectedKeys={[formik.values.role]}
                        onSelectionChange={(keys) =>
                            formik.setFieldValue('role', Array.from(keys)[0])
                        }
                        disallowEmptySelection
                        startContent={(() => {
                            const SelectedIcon =
                                RoleIcons[
                                    formik.values.role as keyof typeof RoleIcons
                                ]
                            return SelectedIcon ? (
                                <SelectedIcon
                                    size={16}
                                    className="text-text-subdued"
                                />
                            ) : (
                                <Shield
                                    size={16}
                                    className="text-text-subdued"
                                />
                            )
                        })()}
                        description="Admins manage system settings. Accounting manages finances. Users manage assigned jobs."
                        isInvalid={!!formik.errors.role && formik.touched.role}
                        errorMessage={formik.errors.role}
                    >
                        {ROLES_LIST.map((r) => (
                            <SelectItem
                                key={r.value}
                                textValue={r.label}
                                startContent={
                                    <r.icon
                                        size={14}
                                        className="text-text-subdued"
                                    />
                                }
                            >
                                {r.label}
                            </SelectItem>
                        ))}
                    </Select>
                </div>
            </div>

            <div className="flex items-center justify-end">
                <HeroButton
                    color="primary"
                    size="sm"
                    startContent={!formik.isSubmitting && <Save size={18} />}
                    isLoading={formik.isSubmitting}
                    onPress={() => formik.handleSubmit()}
                >
                    Save Changes
                </HeroButton>
            </div>
        </div>
    )
}
